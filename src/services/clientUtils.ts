/**
 * Small browser helpers shared by components.
 */

/** Copy text to the clipboard with a legacy fallback. Resolves true on success. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

/**
 * Fetch JSON from a local dev-only `/api/*` route. On the static GitHub Pages build
 * these routes don't exist (404, or index.html served with 200), so this rejects
 * unless the response is OK *and* actually JSON. Callers fall back client-side.
 */
export async function fetchApiJson<T>(path: string, init?: RequestInit, timeoutMs = 8000): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(path, { ...init, signal: controller.signal });
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !type.includes('application/json')) {
      throw new Error(`API unavailable (${res.status})`);
    }
    return (await res.json()) as T;
  } finally {
    window.clearTimeout(timer);
  }
}
