/**
 * Shared Tailwind class recipes so buttons and inputs look consistent across
 * sections and modals. Primary = amber filled, secondary = outlined.
 */

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

export const ui = {
  focusRing,
  btnPrimary: `inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`,
  btnSecondary: `inline-flex items-center justify-center gap-2 rounded-xl border border-line-strong bg-transparent px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-accent/60 hover:text-fg disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`,
  btnGhost: `inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg ${focusRing}`,
  iconBtn: `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-fg ${focusRing}`,
  input:
    'w-full rounded-xl border border-line-strong bg-bg px-3 py-2.5 text-sm text-fg placeholder-subtle transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-fg/30',
  label: 'mb-1.5 block text-xs font-semibold text-muted',
  overlay: 'fixed inset-0 z-[60] flex items-start sm:items-center justify-center overflow-y-auto bg-bg/80 p-3 sm:p-6 backdrop-blur-sm',
  panel: 'relative my-auto w-full rounded-2xl border border-line bg-surface text-fg shadow-2xl focus:outline-none',
  chip: (active: boolean) =>
    `inline-flex items-center gap-2 whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors ${focusRing} ${
      active
        ? 'border-accent/60 bg-accent/15 text-accent-fg'
        : 'border-line bg-surface/70 text-muted hover:border-line-strong hover:text-fg'
    }`,
};
