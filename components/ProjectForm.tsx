"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowIcon, CheckIcon, CloseIcon } from "./Icons";
import type { Dictionary, Locale } from "@/lib/i18n";
import {
  ACCEPTED_FILE_EXTENSIONS,
  MAX_FILES,
  MAX_TOTAL_BYTES,
  isAcceptedFile,
} from "@/lib/upload";

type Errors = Partial<Record<string, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function formatBytes(bytes: number, locale: Locale): string {
  const kb = bytes / 1024;
  if (kb < 1024) return `${new Intl.NumberFormat(locale).format(Math.max(1, Math.round(kb)))} KB`;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(kb / 1024)} MB`;
}

export function ProjectForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.start.form;
  const v = dict.start.validation;

  const formRef = useRef<HTMLFormElement>(null);
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
    if (!get("budget")) next.budget = v.budget;
    if (!get("timeline")) next.timeline = v.timeline;

    if (files.length > MAX_FILES) next.files = v.filesCount;
    if (files.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_BYTES) {
      next.files = v.filesSize;
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
      window.scrollTo({ top: 0, behavior: "smooth" });
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
        <h2 className="form-success__title">{dict.start.success.title}</h2>
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

  const required = (
    <span className="field__req" aria-hidden="true">
      *
    </span>
  );

  return (
    <form className="form" ref={formRef} onSubmit={onSubmit} noValidate>
      {formError ? (
        <div className="form__alert form__alert--error" role="alert">
          <p className="form__alert-title">{dict.start.errorTitle}</p>
          <p>{formError}</p>
        </div>
      ) : null}

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="visually-hidden">
        <label htmlFor="company-website">Company website</label>
        <input id="company-website" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="form__fieldset">
        <legend className="form__legend mono">{t.legendContact}</legend>

        <div className="form__row">
          <Field id="name" label={t.name} error={errors.name} requiredMark={required}>
            <input
              id="name"
              name="name"
              type="text"
              className="field__control"
              placeholder={t.namePlaceholder}
              autoComplete="name"
              required
              aria-invalid={errors.name ? "true" : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          </Field>

          <Field id="email" label={t.email} error={errors.email} requiredMark={required}>
            <input
              id="email"
              name="email"
              type="email"
              dir="ltr"
              className="field__control"
              placeholder={t.emailPlaceholder}
              autoComplete="email"
              required
              aria-invalid={errors.email ? "true" : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </Field>

          <Field id="phone" label={t.phone} error={errors.phone} requiredMark={required}>
            <input
              id="phone"
              name="phone"
              type="tel"
              dir="ltr"
              className="field__control"
              placeholder={t.phonePlaceholder}
              autoComplete="tel"
              required
              aria-invalid={errors.phone ? "true" : undefined}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
          </Field>

          <Field id="organization" label={t.organization} optionalLabel={t.optional}>
            <input
              id="organization"
              name="organization"
              type="text"
              className="field__control"
              placeholder={t.organizationPlaceholder}
              autoComplete="organization"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="form__fieldset">
        <legend className="form__legend mono">{t.legendProject}</legend>

        <div className="form__row">
          <Field
            id="projectType"
            label={t.projectType}
            error={errors.projectType}
            requiredMark={required}
          >
            <select
              id="projectType"
              name="projectType"
              className="field__control"
              defaultValue=""
              required
              aria-invalid={errors.projectType ? "true" : undefined}
              aria-describedby={errors.projectType ? "projectType-error" : undefined}
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

          <Field id="budget" label={t.budget} error={errors.budget} requiredMark={required}>
            <select
              id="budget"
              name="budget"
              className="field__control"
              defaultValue=""
              required
              aria-invalid={errors.budget ? "true" : undefined}
              aria-describedby={errors.budget ? "budget-error" : undefined}
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

          <Field
            id="description"
            label={t.description}
            error={errors.description}
            requiredMark={required}
            full
          >
            <textarea
              id="description"
              name="description"
              className="field__control"
              placeholder={t.descriptionPlaceholder}
              rows={6}
              required
              aria-invalid={errors.description ? "true" : undefined}
              aria-describedby={errors.description ? "description-error" : undefined}
            />
          </Field>

          <Field
            id="outcome"
            label={t.outcome}
            error={errors.outcome}
            requiredMark={required}
            full
          >
            <textarea
              id="outcome"
              name="outcome"
              className="field__control"
              placeholder={t.outcomePlaceholder}
              rows={4}
              required
              aria-invalid={errors.outcome ? "true" : undefined}
              aria-describedby={errors.outcome ? "outcome-error" : undefined}
            />
          </Field>

          <Field id="timeline" label={t.timeline} error={errors.timeline} requiredMark={required}>
            <select
              id="timeline"
              name="timeline"
              className="field__control"
              defaultValue=""
              required
              aria-invalid={errors.timeline ? "true" : undefined}
              aria-describedby={errors.timeline ? "timeline-error" : undefined}
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
            <span className="field__label" id="attachments-label">
              {t.attachments}
            </span>

            <div className="files__row">
              <input
                ref={fileInputRef}
                id="attachments"
                name="attachments"
                type="file"
                className="files__input"
                multiple
                accept={ACCEPTED_FILE_EXTENSIONS.join(",")}
                onChange={onFilesChosen}
              />
              <label htmlFor="attachments" className="files__btn">
                {t.attachmentsButton}
              </label>
              {files.length === 0 ? <span className="files__empty">{t.attachmentsEmpty}</span> : null}
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

            <p className="field__hint" id="attachments-hint">
              {t.attachmentsHint}
            </p>
            {errors.files ? (
              <p className="field__error" role="alert">
                {errors.files}
              </p>
            ) : null}
          </div>
        </div>
      </fieldset>

      <div className="form__footer">
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
  optionalLabel,
  requiredMark,
  full,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optionalLabel?: string;
  requiredMark?: React.ReactNode;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "field field--full" : "field"}>
      <label className="field__label" htmlFor={id}>
        {label}
        {requiredMark}
        {optionalLabel ? <span className="field__opt">{optionalLabel}</span> : null}
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
