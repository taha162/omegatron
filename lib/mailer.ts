import "server-only";

/**
 * Server-side email delivery.
 *
 * Credentials live only in environment variables and are read inside the
 * request handler — nothing here is ever bundled for the browser (`server-only`
 * makes an accidental client import a build error).
 *
 * Provider: Resend's REST API, called with `fetch` so the project carries no
 * extra dependency. To move to another provider, replace `sendEmail` — the
 * calling route only needs the returned `{ ok }`.
 */

export type Attachment = {
  filename: string;
  /** Base64-encoded file contents. */
  content: string;
};

export type MailConfig = {
  apiKey: string;
  to: string[];
  from: string;
  bcc?: string[];
};

export type MailConfigError = "missing_api_key" | "missing_recipient" | "missing_sender";

function splitAddresses(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

/** Reads and validates configuration. Returns an error code, never throws. */
export function readMailConfig(): { config: MailConfig } | { error: MailConfigError } {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { error: "missing_api_key" };

  const to = splitAddresses(process.env.CONTACT_TO_EMAIL);
  if (to.length === 0) return { error: "missing_recipient" };

  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  if (!from) return { error: "missing_sender" };

  const bcc = splitAddresses(process.env.CONTACT_BCC_EMAIL);

  return { config: { apiKey, to, from, bcc: bcc.length > 0 ? bcc : undefined } };
}

export async function sendEmail(
  config: MailConfig,
  message: {
    subject: string;
    html: string;
    text: string;
    replyTo?: string;
    attachments?: Attachment[];
  },
): Promise<{ ok: true } | { ok: false; status: number; detail: string }> {
  let response: Response;

  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: config.to,
        bcc: config.bcc,
        reply_to: message.replyTo,
        subject: message.subject,
        html: message.html,
        text: message.text,
        attachments: message.attachments,
      }),
      cache: "no-store",
    });
  } catch (cause) {
    return { ok: false, status: 502, detail: `transport: ${(cause as Error).message}` };
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return { ok: false, status: response.status, detail: detail.slice(0, 500) };
  }

  return { ok: true };
}
