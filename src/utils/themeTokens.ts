/**
 * Unified Design System & Color Tokens for SunuRDV
 * Ensures 100% fluid compatibility between Dark Mode & Light Mode
 */

export interface ThemePalette {
  isDark: boolean;
  // Backgrounds
  pageBg: string;
  cardBg: string;
  cardElevated: string;
  subBg: string;
  codeBg: string;
  
  // Borders
  borderCol: string;
  borderSubtle: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Form Controls
  inputBg: string;

  // Badges & Accents (Accessible in both Light & Dark modes)
  badgeNeutral: string;
  badgeSuccess: string;
  badgeWarning: string;
  badgeInfo: string;
  badgePurple: string;
  badgeRose: string;

  // Tables & Lists
  tableRowHover: string;
  tableDivider: string;

  // Accents
  accentGreen: string;
  accentAmber: string;
  accentSky: string;
}

export const getThemeTokens = (isDark: boolean): ThemePalette => {
  if (isDark) {
    return {
      isDark: true,
      pageBg: 'bg-slate-950 text-slate-100',
      cardBg: 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-xl shadow-black/30',
      cardElevated: 'bg-slate-900 border-slate-700 text-slate-100 shadow-2xl',
      subBg: 'bg-slate-950/75 border-slate-800/80 text-slate-300',
      codeBg: 'bg-slate-950 border-slate-800 text-emerald-300',
      borderCol: 'border-slate-800',
      borderSubtle: 'border-slate-800/60',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-400',
      textMuted: 'text-slate-500',
      inputBg: 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500',
      
      badgeNeutral: 'bg-slate-800 text-slate-300 border-slate-700',
      badgeSuccess: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
      badgeWarning: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
      badgeInfo: 'bg-sky-950/60 text-sky-400 border-sky-800/60',
      badgePurple: 'bg-purple-950/60 text-purple-300 border-purple-800/60',
      badgeRose: 'bg-rose-950/60 text-rose-400 border-rose-800/60',

      tableRowHover: 'hover:bg-slate-800/40',
      tableDivider: 'border-slate-800',

      accentGreen: 'text-emerald-400',
      accentAmber: 'text-amber-400',
      accentSky: 'text-sky-400',
    };
  }

  return {
    isDark: false,
    pageBg: 'bg-slate-50 text-slate-900',
    cardBg: 'bg-white border-slate-200/90 text-slate-900 shadow-sm',
    cardElevated: 'bg-white border-slate-200 text-slate-900 shadow-md',
    subBg: 'bg-slate-50/90 border-slate-200 text-slate-700',
    codeBg: 'bg-slate-900 border-slate-800 text-emerald-300',
    borderCol: 'border-slate-200',
    borderSubtle: 'border-slate-200/80',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-500',
    inputBg: 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600 shadow-xs',

    badgeNeutral: 'bg-slate-100 text-slate-700 border-slate-300',
    badgeSuccess: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badgeWarning: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeInfo: 'bg-sky-50 text-sky-800 border-sky-200',
    badgePurple: 'bg-purple-50 text-purple-800 border-purple-200',
    badgeRose: 'bg-rose-50 text-rose-800 border-rose-200',

    tableRowHover: 'hover:bg-slate-50/90',
    tableDivider: 'border-slate-200',

    accentGreen: 'text-emerald-700 font-semibold',
    accentAmber: 'text-amber-700 font-semibold',
    accentSky: 'text-sky-700 font-semibold',
  };
};
