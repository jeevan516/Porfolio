/**
 * Shared Tailwind class recipes so buttons and inputs look consistent across
 * sections and modals. Primary = emerald filled, secondary = outlined.
 */

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

export const ui = {
  focusRing,
  btnPrimary: `inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`,
  btnSecondary: `inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-transparent px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:border-emerald-500/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`,
  btnGhost: `inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white ${focusRing}`,
  iconBtn: `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white ${focusRing}`,
  input:
    'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30',
  label: 'mb-1.5 block text-xs font-semibold text-slate-300',
  overlay: 'fixed inset-0 z-[60] flex items-start sm:items-center justify-center overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm',
  panel: 'relative my-auto w-full rounded-2xl border border-slate-800 bg-slate-900 text-slate-200 shadow-2xl focus:outline-none',
  chip: (active: boolean) =>
    `inline-flex items-center gap-2 whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors ${focusRing} ${
      active
        ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
        : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700 hover:text-slate-200'
    }`,
};
