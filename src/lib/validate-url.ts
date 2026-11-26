// Returns an error message, or null when the input looks like a valid http(s) URL.
export function validateUrl(input: string): string | null {
  const v = input.trim();
  if (!v) return "Please enter a link to scan.";
  if (/\s/.test(v)) return "Links can't contain spaces.";
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : `https://${v}`;
  let u: URL;
  try {
    u = new URL(withScheme);
  } catch {
    return "That doesn't look like a valid link.";
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return "Only http and https links can be scanned.";
  if (!u.hostname.includes(".") && u.hostname !== "localhost") return "That link is missing a domain, e.g. example.com.";
  return null;
}
