/**
 * Attachment limits, shared by the browser form and the API route so the two
 * can never drift. The ceiling is deliberately below Vercel's ~4.5 MB request
 * body limit for serverless functions.
 */
export const MAX_FILES = 3;
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024;

export const ACCEPTED_FILE_EXTENSIONS = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".heic",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".txt",
  ".csv",
  ".zip",
] as const;

const ACCEPTED_MIME_PREFIXES = [
  "application/pdf",
  "image/",
  "application/msword",
  "application/vnd.openxmlformats-officedocument",
  "application/vnd.ms-excel",
  "text/plain",
  "text/csv",
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
];

export function isAcceptedFile(name: string, mimeType: string): boolean {
  const lower = name.toLowerCase();
  const extensionOk = ACCEPTED_FILE_EXTENSIONS.some((ext) => lower.endsWith(ext));
  if (!extensionOk) return false;

  // Some browsers report an empty type for less common formats; the extension
  // check above already gates those.
  if (!mimeType) return true;
  return ACCEPTED_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix));
}
