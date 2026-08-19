"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { ArrowIcon, CheckIcon, CloseIcon } from "./Icons";
import type { Dictionary, Locale } from "@/lib/i18n";
import {
  ACCEPTED_FILE_EXTENSIONS,
  MAX_FILES,
  MAX_TOTAL_BYTES,
  isAcceptedFile,
} from "@/lib/upload";

/**
 * One form, two shapes.
 *
 * `full`    — the /start page: every field, including attachments.
 * `compact` — the contact section on the home page: the five fields needed to
 *             open an engineering conversation. Both post to the same endpoint,
 *             which treats the extra fields as optional.
 */
export type FormVariant = "full" | "compact";

type Errors = Partial<Record<string, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function formatBytes(bytes: number, locale: Locale): string {
  const kb = bytes / 1024;
  if (kb < 1024) return `${new Intl.NumberFormat(locale).format(Math.max(1, Math.round(kb)))} KB`;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(kb / 1024)} MB`;
}

export function ProjectForm({
  locale,
  dict,
  variant = "full",
  idPrefix,
}: {
  locale: Locale;
  dict: Dictionary;
  variant?: FormVariant;
  /** Keeps element ids unique when both variants exist in one document. */
  idPrefix?: string;
}) {
  const t = dict.start.form;
  const v = dict.start.validation;
  const isFull = variant === "full";
  const prefix = idPrefix ? `${idPrefix}-` : "";
  const id = (name: string) => `${prefix}${name}`;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef<number>(Date.now());

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function onFilesChosen(event: ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(event.target.files ?? []);
    if (chosen.length === 0) return;

    const next = [...files, ...chosen].slice(0, MAX_FILES);
    const fileErrors: string[] = [];

    if (files.length + chosen.length > MAX_FILES) fileErrors.push(v.filesCount);
    if (next.some((file) => !isAcceptedFile(file.name, file.type))) fileErrors.push(v.filesType);
    if (next.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_BYTES) {
      fileErrors.push(v.filesSize);
    }

    setFiles(next.filter((file) => isAcceptedFile(file.name, file.type)));
    setErrors((prev) => ({ ...prev, files: fileErrors[0] }));

    // Reset so re-picking the same file still fires a change event.
    event.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => ({ ...prev, files: undefined }));
  }

  function validate(data: FormData): Errors {
    const next: Errors = {};
    const get = (key: string) => String(data.get(key) ?? "").trim();

    if (get("name").length < 2) next.name = v.name;
    if (!EMAIL_RE.test(get("email"))) next.email = v.email;
    if (get("phone").length < 6) next.phone = v.phone;
    if (!get("projectType")) next.projectType = v.projectType;
    if (get("description").length < 20) next.description = v.description;
    if (get("outcome").length < 5) next.outcome = v.outcome;

    if (isFull) {
      if (!get("environment")) next.environment = v.environment;
      if (!get("stage")) next.stage = v.stage;
      if (!get("budget")) next.budget = v.budget;
      if (!get("timeline")) next.timeline = v.timeline;

      if (files.length > MAX_FILES) next.files = v.filesCount;
      if (files.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_BYTES) {
        next.files = v.filesSize;
      }
    }

    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      setFormError(null);
      const firstKey = Object.keys(found)[0];
      const field = form.querySelector<HTMLElement>(`[name="${firstKey}"]`);
      field?.focus();
      field?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    setStatus("sending");
    setFormError(null);

    // Attach the current file list explicitly; the input itself is cleared
    // after every pick so the user can build the set up piece by piece.
    data.delete("attachments");
    for (const file of files) data.append("attachments", file);
    data.set("locale", locale);
    data.set("source", variant);
    data.set("elapsed", String(Date.now() - startedAt.current));

    try {
      const response = await fetch("/api/contact", { method: "POST", body: data });

      if (!response.ok) {
        // The API answers in English for logging; the visitor sees their own
        // language, chosen from the status code.
        const byStatus: Record<number, string> = {
          429: v.tooMany,
          413: v.filesSize,
          415: v.filesType,
        };
        setFormError(byStatus[response.status] ?? v.generic);
        setStatus("idle");
        return;
      }

      setStatus("sent");
      setFiles([]);
      form.reset();
    } catch {
      setFormError(v.network);
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="form-success" role="status">
        <div className="form-success__mark" aria-hidden="true">
          <CheckIcon />
        </div>
        <h3 className="form-success__title">{dict.start.success.title}</h3>
        <p className="form-success__body">{dict.start.success.body}</p>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus("idle");
          }}
        >
          {dict.start.success.again}
        </button>
      </div>
    );
  }

  const optional = <span className="field__opt">{t.optional}</span>;
  const req = (
    <span className="field__req" title={t.required} aria-label={t.required}>
      *
    </span>
  );

  const contactFields = (
    <div className="form__row">
      <Field id={id("name")} label={t.name} error={errors.name}
        suffix={req}>
        <input
          id={id("name")}
          name="name"
          type="text"
          className="field__control"
          placeholder={t.namePlaceholder}
          autoComplete="name"
          required
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? `${id("name")}-error` : undefined}
        />
      </Field>

      <Field id={id("email")} label={t.email} error={errors.email}
        suffix={req}>
        <input
          id={id("email")}
          name="email"
          type="email"
          dir="ltr"
          className="field__control"
          placeholder={t.emailPlaceholder}
          autoComplete="email"
          required
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? `${id("email")}-error` : undefined}
        />
      </Field>

      <Field id={id("phone")} label={t.phone} error={errors.phone}
        suffix={req}>
        <input
          id={id("phone")}
          name="phone"
          type="tel"
          dir="ltr"
          className="field__control"
          placeholder={t.phonePlaceholder}
          autoComplete="tel"
          required
          aria-invalid={errors.phone ? "true" : undefined}
          aria-describedby={errors.phone ? `${id("phone")}-error` : undefined}
        />
      </Field>

      {isFull ? (
        <>
          <Field id={id("organization")} label={t.organization} suffix={optional}>
            <input
              id={id("organization")}
              name="organization"
              type="text"
              className="field__control"
              placeholder={t.organizationPlaceholder}
              autoComplete="organization"
            />
          </Field>
        </>
      ) : null}
    </div>
  );

  const projectFields = (
    <div className="form__row">
      <Field
        id={id("projectType")}
        label={t.projectType}
        error={errors.projectType}
        suffix={req}
        full={!isFull}
      >
        <select
          id={id("projectType")}
          name="projectType"
          className="field__control"
          defaultValue=""
          required
          aria-invalid={errors.projectType ? "true" : undefined}
          aria-describedby={errors.projectType ? `${id("projectType")}-error` : undefined}
        >
          <option value="" disabled>
            {t.select}
          </option>
          {t.projectTypeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>

      {isFull ? (
        <>
          <Field id={id("environment")} label={t.environment} error={errors.environment}
        suffix={req}>
            <select
              id={id("environment")}
              name="environment"
              className="field__control"
              defaultValue=""
              required
              aria-invalid={errors.environment ? "true" : undefined}
              aria-describedby={errors.environment ? `${id("environment")}-error` : undefined}
            >
              <option value="" disabled>
                {t.select}
              </option>
              {t.environmentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field id={id("stage")} label={t.stage} error={errors.stage}
        suffix={req}>
            <select
              id={id("stage")}
              name="stage"
              className="field__control"
              defaultValue=""
              required
              aria-invalid={errors.stage ? "true" : undefined}
              aria-describedby={errors.stage ? `${id("stage")}-error` : undefined}
            >
              <option value="" disabled>
                {t.select}
              </option>
              {t.stageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field id={id("budget")} label={t.budget} error={errors.budget}
        suffix={req}>
          <select
            id={id("budget")}
            name="budget"
            className="field__control"
            defaultValue=""
            required
            aria-invalid={errors.budget ? "true" : undefined}
            aria-describedby={errors.budget ? `${id("budget")}-error` : undefined}
          >
            <option value="" disabled>
              {t.select}
            </option>
            {t.budgetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          </Field>
        </>
      ) : null}

      <Field id={id("description")} label={t.description} error={errors.description}
        suffix={req} full>
        <textarea
          id={id("description")}
          name="description"
          className="field__control"
          placeholder={t.descriptionPlaceholder}
          rows={isFull ? 6 : 5}
          required
          aria-invalid={errors.description ? "true" : undefined}
          aria-describedby={errors.description ? `${id("description")}-error` : undefined}
        />
      </Field>

      <Field id={id("outcome")} label={t.outcome} error={errors.outcome}
        suffix={req} full>
        <textarea
          id={id("outcome")}
          name="outcome"
          className="field__control"
          placeholder={t.outcomePlaceholder}
          rows={isFull ? 4 : 3}
          required
          aria-invalid={errors.outcome ? "true" : undefined}
          aria-describedby={errors.outcome ? `${id("outcome")}-error` : undefined}
        />
      </Field>

      {isFull ? (
        <>
          <Field id={id("timeline")} label={t.timeline} error={errors.timeline}
        suffix={req}>
            <select
              id={id("timeline")}
              name="timeline"
              className="field__control"
              defaultValue=""
              required
              aria-invalid={errors.timeline ? "true" : undefined}
              aria-describedby={errors.timeline ? `${id("timeline")}-error` : undefined}
            >
              <option value="" disabled>
                {t.select}
              </option>
              {t.timelineOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <div className="field field--full">
            <span className="field__label">
              {t.attachments}
              {optional}
            </span>

            <div className="files__row">
              <input
                ref={fileInputRef}
                id={id("attachments")}
                name="attachments"
                type="file"
                className="files__input"
                multiple
                accept={ACCEPTED_FILE_EXTENSIONS.join(",")}
                onChange={onFilesChosen}
                aria-describedby={id("attachments-hint")}
              />
              <label htmlFor={id("attachments")} className="files__btn">
                {t.attachmentsButton}
              </label>
              {files.length === 0 ? (
                <span className="files__empty">{t.attachmentsEmpty}</span>
              ) : null}
            </div>

            {files.length > 0 ? (
              <ul className="files__list">
                {files.map((file, index) => (
                  <li className="files__item" key={`${file.name}-${file.size}-${index}`}>
                    <span className="files__name">{file.name}</span>
                    <span className="files__size" dir="ltr">
                      {formatBytes(file.size, locale)}
                    </span>
                    <button
                      type="button"
                      className="files__remove"
                      onClick={() => removeFile(index)}
                      aria-label={`${t.attachmentsRemove}: ${file.name}`}
                    >
                      <CloseIcon />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="field__hint" id={id("attachments-hint")}>
              {t.attachmentsHint}
            </p>
            {errors.files ? (
              <p className="field__error" role="alert">
                {errors.files}
              </p>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );

  return (
    <form className={isFull ? "form" : "form form--compact"} onSubmit={onSubmit} noValidate>
      {formError ? (
        <div className="form__alert form__alert--error" role="alert">
          <p className="form__alert-title">{dict.start.errorTitle}</p>
          <p>{formError}</p>
        </div>
      ) : null}

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="visually-hidden">
        <label htmlFor={id("company-website")}>Company website</label>
        <input
          id={id("company-website")}
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {isFull ? (
        <>
          <fieldset className="form__fieldset">
            <legend className="form__legend mono">{t.legendContact}</legend>
            {contactFields}
          </fieldset>
          <fieldset className="form__fieldset">
            <legend className="form__legend mono">{t.legendProject}</legend>
            {projectFields}
          </fieldset>
        </>
      ) : (
        <fieldset className="form__fieldset">
          {contactFields}
          {projectFields}
        </fieldset>
      )}

      <div className="form__footer">
        <p className="form__required-note">
          <span className="field__req" aria-hidden="true">
            *
          </span>
          {t.requiredNote}
        </p>
        <button type="submit" className="btn" disabled={status === "sending"}>
          {status === "sending" ? t.submitting : t.submit}
          {status === "sending" ? null : <ArrowIcon className="btn__arrow" />}
        </button>
        <p className="form__privacy">{t.privacy}</p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  suffix,
  full,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  suffix?: ReactNode;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={full ? "field field--full" : "field"}>
      <label className="field__label" htmlFor={id}>
        {label}
        {suffix}
      </label>
      {children}
      {error ? (
        <p className="field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
