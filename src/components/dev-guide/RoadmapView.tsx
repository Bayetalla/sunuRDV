import React from 'react';
import { allStepsOverview } from '../../data/step1Doc';
import { CheckCircle2, Circle, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { getThemeTokens } from '../../utils/themeTokens';

interface RoadmapViewProps {
  onGoToStep1: () => void;
  isDark?: boolean;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onGoToStep1, isDark = true }) => {
  const theme = getThemeTokens(isDark);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className={`border rounded-2xl p-6 sm:p-8 space-y-3 transition-colors ${
        isDark 
          ? 'bg-slate-900 border-slate-800 text-white shadow-xl shadow-black/20' 
          : 'bg-white border-slate-200/90 text-slate-900 shadow-sm'
      }`}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Roadmap SaaS SunuRDV
        </div>
        <h1 className={`text-2xl sm:text-3xl font-extrabold ${theme.textPrimary}`}>
          Les 17 étapes de construction du SaaS
        </h1>
        <p className={`text-sm max-w-2xl leading-relaxed ${theme.textSecondary}`}>
          Progression séquentielle et rigoureuse. Chaque étape consolide la précédente pour aboutir à un SaaS professionnel, scalable et adapté au contexte sénégalais en production.
        </p>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allStepsOverview.map((item) => {
          const isActive = item.step === 1;
          return (
            <div
              key={item.step}
              className={`rounded-2xl p-5 border transition flex flex-col justify-between relative overflow-hidden ${
                isActive
                  ? isDark
                    ? 'bg-blue-950/40 border-blue-500/70 shadow-lg shadow-blue-950/50'
                    : 'bg-blue-50/70 border-blue-300 shadow-sm'
                  : isDark
                    ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">
                  ÉTAPE ACTIVE
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isDark
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {item.step}
                  </span>

                  <span
                    className={`text-[11px] font-medium flex items-center gap-1.5 ${
                      isActive 
                        ? 'text-blue-500 font-bold' 
                        : theme.textMuted
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" /> En cours
                      </>
                    ) : (
                      <>
                        <Circle className="w-3 h-3" /> À venir
                      </>
                    )}
                  </span>
                </div>

                <div>
                  <h3 className={`text-base font-bold tracking-tight ${theme.textPrimary}`}>
                    {item.title}
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${theme.textSecondary}`}>
                    {item.desc}
                  </p>
                </div>
              </div>

              {isActive && (
                <button
                  onClick={onGoToStep1}
                  className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm hover:scale-[1.01]"
                >
                  <span>Consulter le guide Étape 1</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
