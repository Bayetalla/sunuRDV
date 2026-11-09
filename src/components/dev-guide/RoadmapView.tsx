import React, { useState } from 'react';
import { allStepsData, StepDetail } from '../../data/allStepsData';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Terminal, 
  FileCode, 
  AlertTriangle, 
  X, 
  Copy, 
  Check, 
  Search,
  Filter,
  Wrench,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { getThemeTokens } from '../../utils/themeTokens';
import { ArchitectureMatrixView } from './ArchitectureMatrixView';
import { useToast } from '../ui/Toast';

interface RoadmapViewProps {
  onGoToStep1: () => void;
  isDark?: boolean;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onGoToStep1, isDark = true }) => {
  const { showToast } = useToast();
  const theme = getThemeTokens(isDark);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'matrix'>('roadmap');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStepModal, setSelectedStepModal] = useState<StepDetail | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const categories = ['Tous', 'Fondations', 'Espaces Métier', 'Intégrations Sénégal', 'Production & Sécurité'];

  const filteredSteps = allStepsData.filter((item) => {
    const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.routes.some(r => r.toLowerCase().includes(q)) ||
      item.controllers.some(c => c.toLowerCase().includes(q)) ||
      item.middlewares.some(m => m.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    showToast({
      type: 'info',
      title: 'Copié dans le presse-papier',
      message: label
    });
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const cardBg = theme.cardBg;
  const subBg = theme.subBg;
  const textPrimary = theme.textPrimary;
  const textSecondary = theme.textSecondary;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Main Navigation Tabs: Roadmap vs Separation Matrix */}
      <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 w-full sm:w-auto self-start shadow-sm transition ${subBg}`}>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'roadmap'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
              : `${textSecondary} hover:${textPrimary}`
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Roadmap Complète (17 Étapes)</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'matrix'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
              : `${textSecondary} hover:${textPrimary}`
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Matrice Séparation Routes ➔ Middlewares ➔ Contrôleurs</span>
        </button>
      </div>

      {/* VIEW 1: ROADMAP DES 17 ÉTAPES */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className={`border rounded-2xl p-6 sm:p-8 space-y-3 transition-colors ${
            isDark 
              ? 'bg-slate-900 border-slate-800 text-white shadow-xl shadow-black/20' 
              : 'bg-white border-slate-200/90 text-slate-900 shadow-sm'
          }`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Architecture SaaS Sénégal • 17 Étapes Validées
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold ${textPrimary}`}>
              Les 17 Étapes de Construction du SaaS SunuRDV
            </h1>
            <p className={`text-sm max-w-3xl leading-relaxed ${textSecondary}`}>
              Progression séquentielle et rigoureuse. Chaque étape détaille ses <strong>routes</strong>, ses <strong>middlewares sentinelles</strong>, 
              ses <strong>contrôleurs</strong> et ses commandes XAMPP pour permettre un développement sans faille et une maintenance facile.
            </p>

            {/* Category Filter Pills & Search */}
            <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-slate-700/20">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white shadow-xs'
                        : `${subBg} ${textSecondary} hover:${textPrimary}`
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${textSecondary}`} />
                <input
                  type="text"
                  placeholder="Filtrer par mot-clé, route, middleware..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full rounded-xl pl-8 pr-3 py-1.5 text-xs border focus:outline-none focus:ring-1 focus:ring-purple-500 transition ${theme.inputBg}`}
                />
              </div>
            </div>
          </div>

          {/* Grid of 17 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSteps.map((item) => {
              const isActive = item.step === 1;
              return (
                <div
                  key={item.step}
                  onClick={() => setSelectedStepModal(item)}
                  className={`rounded-2xl p-5 border transition-all flex flex-col justify-between relative overflow-hidden cursor-pointer group hover:-translate-y-1 hover:shadow-lg ${
                    isActive
                      ? isDark
                        ? 'bg-blue-950/40 border-blue-500/70 shadow-lg shadow-blue-950/50'
                        : 'bg-blue-50/70 border-blue-300 shadow-sm'
                      : isDark
                        ? 'bg-slate-900/90 border-slate-800 hover:border-purple-500/60'
                        : 'bg-white border-slate-200/90 hover:border-purple-400 shadow-xs'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">
                      ÉTAPE ACTIVE
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : isDark
                                ? 'bg-slate-800 text-purple-400 border border-purple-500/30'
                                : 'bg-purple-100 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {item.step}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                          item.category === 'Fondations' ? 'bg-blue-500/10 text-blue-400' :
                          item.category === 'Espaces Métier' ? 'bg-emerald-500/10 text-emerald-400' :
                          item.category === 'Intégrations Sénégal' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-purple-500/10 text-purple-400'
                        }`}>
                          {item.category}
                        </span>
                      </div>

                      <span className="text-[11px] font-medium flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Prêt
                      </span>
                    </div>

                    <div>
                      <h3 className={`text-base font-bold tracking-tight group-hover:text-purple-400 transition-colors ${textPrimary}`}>
                        {item.title}
                      </h3>
                      <p className={`text-xs mt-1 leading-relaxed ${textSecondary} line-clamp-2`}>
                        {item.desc}
                      </p>
                    </div>

                    {/* Quick Tags for Routes & Middlewares */}
                    <div className="pt-2 border-t border-slate-700/20 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono truncate text-slate-400">
                        <span className="font-bold text-slate-500">Route :</span>
                        <span className="truncate text-emerald-400">{item.routes[0]}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono truncate text-slate-400">
                        <span className="font-bold text-slate-500">Middleware :</span>
                        <span className="truncate text-purple-400">{item.middlewares[0] || 'web'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
                    <span>Inspecter les détails & fichiers</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: MATRICE SÉPARATION ROUTES / MIDDLEWARES / CONTRÔLEURS */}
      {activeTab === 'matrix' && (
        <ArchitectureMatrixView isDark={isDark} />
      )}

      {/* STEP DETAILS MODAL */}
      {selectedStepModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-7 border shadow-2xl space-y-6 animate-scaleIn ${cardBg}`}>
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-4 border-slate-700/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-600 text-white">
                    Étape {selectedStepModal.step} / 17
                  </span>
                  <span className="text-xs font-mono text-purple-400">{selectedStepModal.category}</span>
                </div>
                <h2 className={`text-lg sm:text-xl font-black ${textPrimary}`}>
                  {selectedStepModal.title}
                </h2>
                <p className={`text-xs ${textSecondary}`}>{selectedStepModal.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStepModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Architecture Separation Breakdown for this step */}
            <div className={`p-4 rounded-xl border space-y-3 ${subBg}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider ${textPrimary} flex items-center gap-1.5`}>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Séparation des Responsabilités (Cette Étape)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block">Fichier(s) Route</span>
                  <ul className="text-[11px] text-slate-300 space-y-0.5">
                    {selectedStepModal.routes.map((r, i) => <li key={i}>• {r}</li>)}
                  </ul>
                </div>

                <div className="p-2.5 rounded-lg border border-purple-500/30 bg-purple-500/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-purple-400 block">Middleware Sentinelle</span>
                  <ul className="text-[11px] text-slate-300 space-y-0.5">
                    {selectedStepModal.middlewares.map((m, i) => <li key={i}>• {m.split('\\').pop()}</li>)}
                  </ul>
                </div>

                <div className="p-2.5 rounded-lg border border-sky-500/30 bg-sky-500/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-sky-400 block">Contrôleur(s)</span>
                  <ul className="text-[11px] text-slate-300 space-y-0.5">
                    {selectedStepModal.controllers.map((c, i) => <li key={i}>• {c.split('\\').pop()}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* Why This Choice */}
            <div className="space-y-2">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                Pourquoi ce choix technique au Sénégal ?
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-outside pl-4">
                {selectedStepModal.whyThisChoice.map((why, i) => (
                  <li key={i} className="leading-relaxed">{why}</li>
                ))}
              </ul>
            </div>

            {/* Artisan / XAMPP Commands */}
            <div className="space-y-2">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                Commandes XAMPP / Artisan à exécuter :
              </h3>
              <div className="space-y-2">
                {selectedStepModal.xamppCommands.map((cmd, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>{cmd.explanation}</span>
                      <button
                        onClick={() => handleCopy(cmd.command, cmd.command)}
                        className="hover:text-white transition flex items-center gap-1"
                      >
                        {copiedCmd === cmd.command ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCmd === cmd.command ? 'Copié' : 'Copier'}</span>
                      </button>
                    </div>
                    <code className="text-emerald-300 block select-all">{cmd.command}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Troubleshooting / QuickFix */}
            <div className="space-y-2">
              <h3 className={`text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5`}>
                <Wrench className="w-3.5 h-3.5 text-rose-400" />
                <span>Diagnostic & Réparation d'anomalies :</span>
              </h3>
              <div className="space-y-2 text-xs">
                {selectedStepModal.troubleshooting.map((tb, i) => (
                  <div key={i} className={`p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1`}>
                    <div className="font-bold text-rose-400">Problème : {tb.problem}</div>
                    <div className="text-slate-300 font-mono text-[11px]">➔ Solution : {tb.fix}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700/20">
              {selectedStepModal.step === 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStepModal(null);
                    onGoToStep1();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition"
                >
                  <span>Accéder au guide complet Étape 1</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStepModal(null);
                    setActiveTab('matrix');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Inspecter les Middlewares de cette étape dans la Matrice</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedStepModal(null)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold ${subBg} ${textPrimary}`}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
