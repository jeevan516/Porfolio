/**
 * Helpers for exporting a DOM subtree (CV / brief) to PDF or the print dialog.
 *
 * - html2canvas 1.4 cannot parse modern CSS color functions (oklch/oklab/color-mix
 *   output) that Tailwind v4 emits, and throws "unsupported color function".
 *   `normalizeColorsForCanvas` rewrites computed colors on the cloned document to rgb().
 * - `printElement` prints only the given element via an isolated iframe, instead of
 *   `window.print()` which would print the whole single-page site.
 */

const MODERN_COLOR_FN = /\b(?:oklch|oklab|lab|lch|hwb|color)\([^()]*\)/gi;
const HAS_MODERN_COLOR = /\b(?:oklch|oklab|lab|lch|hwb|color)\(/i;

const COLOR_PROPS = [
  'color',
  'background-color',
  'background-image',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'text-decoration-color',
  'column-rule-color',
  'caret-color',
  'fill',
  'stroke',
  'box-shadow',
  'text-shadow',
];

let probeCtx: CanvasRenderingContext2D | null = null;
const colorCache = new Map<string, string>();

function toRgb(color: string): string {
  const cached = colorCache.get(color);
  if (cached) return cached;
  if (!probeCtx) {
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    probeCtx = c.getContext('2d', { willReadFrequently: true });
  }
  if (!probeCtx) return 'rgb(0, 0, 0)';
  probeCtx.clearRect(0, 0, 1, 1);
  probeCtx.fillStyle = '#000';
  probeCtx.fillStyle = color;
  probeCtx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = probeCtx.getImageData(0, 0, 1, 1).data;
  const out = a === 255 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
  colorCache.set(color, out);
  return out;
}

function normalizeElement(el: Element, win: Window) {
  const cs = win.getComputedStyle(el);
  const style = (el as HTMLElement).style;
  if (!style) return;
  for (const prop of COLOR_PROPS) {
    const value = cs.getPropertyValue(prop);
    if (value && HAS_MODERN_COLOR.test(value)) {
      style.setProperty(prop, value.replace(MODERN_COLOR_FN, (m) => toRgb(m)), 'important');
    }
  }
}

/** Use as html2canvas `onclone`. */
export function normalizeColorsForCanvas(clonedDoc: Document, root: HTMLElement) {
  const win = clonedDoc.defaultView ?? window;
  normalizeElement(clonedDoc.documentElement, win);
  if (clonedDoc.body) normalizeElement(clonedDoc.body, win);
  normalizeElement(root, win);
  root.querySelectorAll('*').forEach((el) => normalizeElement(el, win));
}

/** Print a single element in an isolated iframe that reuses the page's stylesheets. */
export function printElement(element: HTMLElement, title: string): Promise<void> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;
    if (!doc || !win) {
      iframe.remove();
      window.print();
      resolve();
      return;
    }

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((node) => {
        if (node instanceof HTMLLinkElement) return `<link rel="stylesheet" href="${node.href}">`;
        return node.outerHTML;
      })
      .join('\n');

    doc.open();
    doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title.replace(/</g, '&lt;')}</title>${styles}
<style>
  @page { size: A4; margin: 12mm; }
  html, body { background: #ffffff !important; color: #0f172a !important; margin: 0; padding: 0; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  #print-root > * { max-width: none !important; width: 100% !important; margin: 0 !important; box-shadow: none !important; border: 0 !important; border-radius: 0 !important; }
</style></head><body><div id="print-root">${element.outerHTML}</div></body></html>`);
    doc.close();

    let done = false;
    const cleanup = () => {
      if (done) return;
      done = true;
      window.setTimeout(() => iframe.remove(), 500);
      resolve();
    };

    const links = Array.from(doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
    const waitForStyles = Promise.all(
      links.map(
        (l) =>
          new Promise<void>((res) => {
            if (l.sheet) return res();
            l.addEventListener('load', () => res(), { once: true });
            l.addEventListener('error', () => res(), { once: true });
            window.setTimeout(res, 2500);
          })
      )
    );
    const waitForFonts = (doc as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve();

    Promise.all([waitForStyles, waitForFonts.catch(() => undefined)]).then(() => {
      win.addEventListener('afterprint', cleanup, { once: true });
      win.focus();
      win.print();
      // Safari/Firefox may not fire afterprint reliably
      window.setTimeout(cleanup, 60000);
    });
  });
}
