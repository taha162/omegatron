import { NextResponse } from "next/server";

import { readMailConfig, sendEmail, type Attachment } from "@/lib/mailer";
import { MAX_FILES, MAX_TOTAL_BYTES, isAcceptedFile } from "@/lib/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Enough headroom to base64-encode attachments and hand them to the provider. */
export const maxDuration = 15;

/** Per-field caps, so an oversized paste cannot inflate the email. */
const FIELD_LIMITS: Record<string, number> = {
  name: 120,
  email: 160,
  phone: 60,
  organization: 160,
  projectType: 120,
  description: 6000,
  outcome: 3000,
  budget: 80,
  timeline: 80,
};

/**
 * The short contact form on the home page sends only these; the full request
 * form on /start adds phone, organisation, budget, and timeline, which the
 * browser enforces there and this handler treats as optional.
 */
const REQUIRED_FIELDS = [
  "name",
  "email",
  "projectType",
  "description",
  "outcome",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Best-effort in-process rate limit. Serverless instances are not shared, so
 * this throttles a single burst rather than a distributed flood; the honeypot
 * and elapsed-time checks cover the rest.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strips control characters that could forge headers in the subject line. */
function singleLine(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

type Submission = Record<string, string>;

function buildHtml(submission: Submission, meta: Submission): string {
  const rows = [
    ["Name", submission.name],
    ["Email", submission.email],
    ["Phone / WhatsApp", submission.phone || "—"],
    ["Organisation", submission.organization || "—"],
    ["Project type", submission.projectType],
    ["Budget", submission.budget || "—"],
    ["Timeline", submission.timeline || "—"],
    ["Description", submission.description],
    ["Expected outcome", submission.outcome],
  ];

  const body = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #e3e0d9;vertical-align:top;width:190px;color:#6a7078;font-size:13px;">${escapeHtml(
            label,
          )}</td>
          <td dir="auto" style="padding:12px 16px;border-bottom:1px solid #e3e0d9;vertical-align:top;color:#101418;font-size:15px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(
            value,
          )}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html><body style="margin:0;background:#f7f6f3;padding:24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e3e0d9;border-radius:4px;width:100%;">
    <tr><td style="padding:24px 16px;border-bottom:2px solid #a9561e;">
      <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6a7078;">OmegaTron</div>
      <div style="font-size:20px;font-weight:700;color:#101418;margin-top:4px;">New project request</div>
    </td></tr>
    <tr><td style="padding:0;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${body}</table>
    </td></tr>
    <tr><td style="padding:16px;color:#6a7078;font-size:12px;">
      Submitted ${escapeHtml(meta.submittedAt)} · language: ${escapeHtml(meta.locale)} · form: ${escapeHtml(
        meta.source,
      )} · attachments: ${escapeHtml(meta.attachments)}
    </td></tr>
  </table>
</body></html>`;
}

function buildText(submission: Submission, meta: Submission): string {
  return [
    "NEW PROJECT REQUEST — OmegaTron",
    "",
    `Name:              ${submission.name}`,
    `Email:             ${submission.email}`,
    `Phone / WhatsApp:  ${submission.phone || "—"}`,
    `Organisation:      ${submission.organization || "—"}`,
    `Project type:      ${submission.projectType}`,
    `Budget:            ${submission.budget || "—"}`,
    `Timeline:          ${submission.timeline || "—"}`,
    "",
    "Description:",
    submission.description,
    "",
    "Expected outcome:",
    submission.outcome,
    "",
    `Submitted ${meta.submittedAt} · language: ${meta.locale} · form: ${meta.source} · attachments: ${meta.attachments}`,
  ].join("\n");
}

export async function POST(request: Request) {
  const config = readMailConfig();
  if ("error" in config) {
    // Never leak which variable is missing to the browser; log it for the operator.
    console.error(`[contact] email is not configured: ${config.error}`);
    return NextResponse.json({ error: "Email delivery is not configured." }, { status: 503 });
  }

  if (rateLimited(clientKey(request))) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Bot signals: a filled honeypot, or a form completed implausibly fast.
  const honeypot = String(form.get("companyWebsite") ?? "").trim();
  const elapsed = Number(form.get("elapsed") ?? 0);
  if (honeypot || (Number.isFinite(elapsed) && elapsed > 0 && elapsed < 2500)) {
    // Answer as if accepted so bots learn nothing from the response.
    return NextResponse.json({ ok: true });
  }

  const submission: Submission = {};
  for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
    submission[field] = String(form.get(field) ?? "")
      .trim()
      .slice(0, limit);
  }

  const missing = REQUIRED_FIELDS.filter((field) => !submission[field]);
  if (missing.length > 0 || !EMAIL_RE.test(submission.email)) {
    return NextResponse.json({ error: "Some required fields are missing." }, { status: 400 });
  }

  const uploads = form.getAll("attachments").filter((entry): entry is File => entry instanceof File);
  const realUploads = uploads.filter((file) => file.size > 0);

  if (realUploads.length > MAX_FILES) {
    return NextResponse.json({ error: "Too many attachments." }, { status: 400 });
  }
  if (realUploads.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_BYTES) {
    return NextResponse.json({ error: "Attachments are too large." }, { status: 413 });
  }
  if (realUploads.some((file) => !isAcceptedFile(file.name, file.type))) {
    return NextResponse.json({ error: "Unsupported attachment format." }, { status: 415 });
  }

  const attachments: Attachment[] = [];
  for (const file of realUploads) {
    const bytes = Buffer.from(await file.arrayBuffer());
    attachments.push({
      filename: singleLine(file.name).slice(0, 120) || "attachment",
      content: bytes.toString("base64"),
    });
  }

  const locale = String(form.get("locale") ?? "ar").slice(0, 5);
  const source = String(form.get("source") ?? "full").slice(0, 16);
  const meta: Submission = {
    submittedAt: new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC",
    locale,
    source,
    attachments: attachments.length > 0 ? attachments.map((a) => a.filename).join(", ") : "none",
  };

  const subject = singleLine(
    `New project request — ${submission.name} · ${submission.projectType}`,
  ).slice(0, 180);

  const result = await sendEmail(config.config, {
    subject,
    html: buildHtml(submission, meta),
    text: buildText(submission, meta),
    replyTo: submission.email,
    attachments: attachments.length > 0 ? attachments : undefined,
  });

  if (!result.ok) {
    console.error(`[contact] delivery failed (${result.status}): ${result.detail}`);
    return NextResponse.json(
      { error: "The request could not be delivered. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
