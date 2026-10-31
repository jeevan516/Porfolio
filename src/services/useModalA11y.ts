import { useEffect, useRef, type RefObject } from 'react';

/**
 * Shared modal behaviour: Escape closes, body scroll is locked while open
 * (ref-counted so stacked modals don't unlock early), focus moves into the
 * dialog on open and returns to the previously focused element on close,
 * and Tab is kept inside the dialog.
 */
let openModalCount = 0;
let savedOverflow = '';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useModalA11y(
  isOpen: boolean,
  onClose: () => void,
  dialogRef?: RefObject<HTMLElement | null>,
  options: { lockScroll?: boolean } = {}
) {
  const { lockScroll = true } = options;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    if (lockScroll) {
      if (openModalCount === 0) {
        savedOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
      openModalCount += 1;
    }

    // Move focus into the dialog (first focusable element, else the dialog itself)
    const focusTimer = window.setTimeout(() => {
      const root = dialogRef?.current;
      if (!root || root.contains(document.activeElement)) return;
      const first = root.querySelector<HTMLElement>('[data-autofocus]') ?? root.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? root).focus({ preventScroll: true });
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key === 'Tab' && dialogRef?.current) {
        const all = Array.prototype.slice.call(dialogRef.current.querySelectorAll(FOCUSABLE)) as HTMLElement[];
        const nodes = all.filter((n) => n.offsetParent !== null || n === document.activeElement);
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      if (lockScroll) {
        openModalCount = Math.max(0, openModalCount - 1);
        if (openModalCount === 0) document.body.style.overflow = savedOverflow;
      }
      if (previouslyFocused && typeof previouslyFocused.focus === 'function' && document.contains(previouslyFocused)) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [isOpen, lockScroll, dialogRef]);
}
