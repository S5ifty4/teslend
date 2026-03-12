/**
 * Strip all HTML tags from a string to prevent XSS in email templates.
 * Safe to use on any user-supplied input before interpolating into HTML.
 */
export function stripHtml(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')          // remove all tags
    .replace(/&/g, '&amp;')           // encode & first (must be first)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Preserve line breaks as <br> after sanitizing — safe for email HTML.
 */
export function sanitizeForEmail(input: unknown): string {
  return stripHtml(input).replace(/\n/g, '<br>');
}
