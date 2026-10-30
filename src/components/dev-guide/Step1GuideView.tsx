import React, { useState } from 'react';
import { step1Data } from '../../data/step1Doc';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Terminal, 
  FileCode, 
  FolderTree, 
  AlertTriangle, 
  HelpCircle, 
  Lightbulb, 
  ArrowRight,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { getThemeTokens } from '../../utils/themeTokens';

interface Step1GuideViewProps {
  isDark?: boolean;
}

export const Step1GuideView: React.FC<Step1GuideViewProps> = ({ isDark = true }) => {
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [copiedCmdIndex, setCopiedCmdIndex] = useState<number | null>(null);
  
  // Interactive checklist state for the junior dev
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    xampp_started: false,
    db_created: false,
    laravel_installed: false,
    env_configured: false,
    migrations_run: false,
    url_tested: false,
  });

  const [readyConfirmed, setReadyConfirmed] = useState<boolean>(false);

  const theme = getThemeTokens(isDark);
  const activeFile = step1Data.files[activeFileIndex];

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleCopyCommand = (command: string, index: number) => {
    navigator.clipboard.writeText(command);
    setCopiedCmdIndex(index);
    setTimeout(() => setCopiedCmdIndex(null), 2000);
  };

  const toggleCheck = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Banner / Title Header */}
      <div className={`border rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-colors ${
        isDark 
          ? 'bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-blue-800/40 text-white' 
          : 'bg-gradient-to-r from-blue-50 via-indigo-50/50 to-emerald-50 border-blue-200/90 text-slate-900'
      }`}>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDark 
                ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' 
                : 'bg-blue-100 text-blue-800 border-blue-300'
            }`}>
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Étape 1 sur 17 • Architecture & Multi-tenant
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {step1Data.title}
            </h1>
            <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {step1Data.subtitle}. Spécialement calibré pour votre environnement{' '}
              <span className="text-amber-500 font-bold">Windows / XAMPP</span>.
            </p>
          </div>

          <div className={`border p-4 rounded-xl flex flex-col gap-2 w-full md:w-auto md:min-w-[220px] transition-colors ${
            isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`text-xs font-semibold ${theme.textSecondary}`}>Progression Étape 1 :</div>
            <div className="flex items-center justify-between text-sm">
              <span className={`font-bold ${theme.textPrimary}`}>{completedCount} / {totalCount} validés</span>
              <span className="text-xs text-blue-500 font-mono font-bold">{Math.round((completedCount / totalCount) * 100)}%</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 1. Pourquoi ce choix ? */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/30 font-bold">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h2 className={`text-lg font-bold ${theme.textPrimary}`}>1. Pourquoi faisons-nous ces choix techniques ?</h2>
            <p className={`text-xs ${theme.textSecondary}`}>Comprendre les décisions architecturales pour un SaaS robuste</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {step1Data.whyThisChoice.map((reason, idx) => (
            <div 
              key={idx} 
              className={`rounded-2xl p-4.5 border space-y-2 transition hover:-translate-y-0.5 hover:shadow-md ${theme.cardBg}`}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
                <span className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[11px]">
                  {idx + 1}
                </span>
                <span>Principe clé</span>
              </div>
              <p className={`text-xs leading-relaxed ${theme.textSecondary}`}>{reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Arborescence du Projet */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-teal-500/20 text-teal-500 flex items-center justify-center border border-teal-500/30 font-bold">
            <FolderTree className="w-4 h-4" />
          </div>
          <div>
            <h2 className={`text-lg font-bold ${theme.textPrimary}`}>2. Arborescence cible du projet Laravel</h2>
            <p className={`text-xs ${theme.textSecondary}`}>Structure propre inspirée de Laravel 11 pour le SaaS</p>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border font-mono text-xs overflow-x-auto shadow-md ${theme.codeBg}`}>
          <pre>{step1Data.directoryTree}</pre>
        </div>
      </section>

      {/* 3. Code Complet & Prêt à l'emploi */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center border border-blue-500/30 font-bold">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${theme.textPrimary}`}>3. Fichiers complets prêts à l'emploi</h2>
              <p className={`text-xs ${theme.textSecondary}`}>Sélectionnez un fichier pour inspecter et copier son code complet</p>
            </div>
          </div>

          <button
            onClick={() => handleCopyCode(activeFile.code)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition hover:scale-[1.02]"
          >
            {copiedFile ? (
              <>
                <Check className="w-4 h-4" />
                <span>Code Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copier le fichier</span>
              </>
            )}
          </button>
        </div>

        {/* File Tabs & Viewer */}
        <div className={`rounded-2xl border shadow-xl overflow-hidden ${theme.cardBg}`}>
          {/* File selector buttons */}
          <div className={`p-2 border-b flex items-center gap-1.5 overflow-x-auto no-scrollbar sm:flex-wrap ${theme.subBg}`}>
            {step1Data.files.map((file, idx) => (
              <button
                key={file.path}
                onClick={() => setActiveFileIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition shrink-0 ${
                  activeFileIndex === idx
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : `${theme.textSecondary} hover:${theme.textPrimary}`
                }`}
              >
                <span>{file.path}</span>
              </button>
            ))}
          </div>

          {/* File explanation description */}
          <div className={`px-4 py-2.5 border-b flex items-center justify-between text-xs ${theme.subBg}`}>
            <span className={`italic ${theme.textSecondary}`}>{activeFile.description}</span>
            <span className="font-mono text-[11px] text-blue-500 uppercase font-bold">{activeFile.language}</span>
          </div>

          {/* Syntax code area */}
          <div className="p-4 bg-slate-950 font-mono text-xs text-slate-100 overflow-x-auto max-h-[480px]">
            <pre>
              <code>{activeFile.code}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* 4. Commandes Windows / XAMPP */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30 font-bold">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className={`text-lg font-bold ${theme.textPrimary}`}>4. Commandes pas-à-pas (Invite de commandes Windows / XAMPP)</h2>
            <p className={`text-xs ${theme.textSecondary}`}>Exécutez dans l'ordre dans CMD ou PowerShell sous Windows</p>
          </div>
        </div>

        <div className="space-y-3">
          {step1Data.xamppCommands.map((cmd, idx) => (
            <div 
              key={idx}
              className={`rounded-xl p-4 border space-y-2 transition ${theme.cardBg}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[11px]">
                    {idx + 1}
                  </span>
                  {cmd.title}
                </span>
                <button
                  onClick={() => handleCopyCommand(cmd.command, idx)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono transition ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                >
                  {copiedCmdIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                <pre>{cmd.command}</pre>
              </div>

              <p className={`text-xs italic ${theme.textSecondary}`}>💡 {cmd.explanation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Comment tester localement ? */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center border border-purple-500/30 font-bold">
            <Laptop className="w-4 h-4" />
          </div>
          <div>
            <h2 className={`text-lg font-bold ${theme.textPrimary}`}>5. Protocole de test local</h2>
            <p className={`text-xs ${theme.textSecondary}`}>Vérifiez chaque point pour confirmer le bon fonctionnement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {step1Data.testingInstructions.map((instruction: string, idx: number) => (
            <div 
              key={idx} 
              className={`rounded-xl p-4 border space-y-2 ${theme.cardBg}`}
            >
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center text-xs font-bold shrink-0">
                  {idx + 1}
                </span>
                <h4 className={`text-xs font-semibold leading-relaxed ${theme.textPrimary}`}>{instruction}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Erreurs Fréquentes & Dépannage */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center border border-rose-500/30 font-bold">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className={`text-lg font-bold ${theme.textPrimary}`}>6. Erreurs Fréquentes sous Windows / XAMPP & Solutions</h2>
            <p className={`text-xs ${theme.textSecondary}`}>Anticipez les pièges classiques des débutants</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {step1Data.commonErrors.map((err, idx) => (
            <div 
              key={idx} 
              className={`rounded-xl p-4 border space-y-3 ${theme.cardBg}`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Message d'erreur
                </span>
                <p className="font-mono text-xs text-rose-500 font-semibold break-words mt-1">
                  "{err.error}"
                </p>
              </div>

              <div className={`text-xs space-y-1 ${theme.textSecondary}`}>
                <span className={`font-semibold ${theme.textPrimary}`}>Cause :</span> {err.cause}
              </div>

              <div className="text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-emerald-300 space-y-1 font-mono">
                <span className="font-semibold text-emerald-400">Solution :</span> {err.solution}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Checklist d'autodiagnostic & Validation */}
      <section className={`border-2 border-emerald-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl transition-colors ${theme.cardBg}`}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${theme.textPrimary}`}>7. Checklist de validation de l'Étape 1</h2>
            <p className={`text-xs sm:text-sm ${theme.textSecondary}`}>
              Cochez chaque case une fois testée sur votre machine Windows/XAMPP.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <label 
            onClick={() => toggleCheck('xampp_started')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
              checklist.xampp_started 
                ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-600 dark:text-emerald-300 font-semibold' 
                : `${theme.subBg} hover:border-slate-400`
            }`}
          >
            <input 
              type="checkbox" 
              checked={checklist.xampp_started} 
              onChange={() => {}} 
              className="h-4 w-4 rounded accent-emerald-500" 
            />
            <span>XAMPP Apache et MySQL sont démarrés au vert</span>
          </label>

          <label 
            onClick={() => toggleCheck('db_created')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
              checklist.db_created 
                ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-600 dark:text-emerald-300 font-semibold' 
                : `${theme.subBg} hover:border-slate-400`
            }`}
          >
            <input 
              type="checkbox" 
              checked={checklist.db_created} 
              onChange={() => {}} 
              className="h-4 w-4 rounded accent-emerald-500" 
            />
            <span>Base de données <code>sunurdv_db</code> créée en UTF-8</span>
          </label>

          <label 
            onClick={() => toggleCheck('laravel_installed')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
              checklist.laravel_installed 
                ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-600 dark:text-emerald-300 font-semibold' 
                : `${theme.subBg} hover:border-slate-400`
            }`}
          >
            <input 
              type="checkbox" 
              checked={checklist.laravel_installed} 
              onChange={() => {}} 
              className="h-4 w-4 rounded accent-emerald-500" 
            />
            <span>Projet Laravel 11 installé avec Composer</span>
          </label>

          <label 
            onClick={() => toggleCheck('env_configured')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
              checklist.env_configured 
                ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-600 dark:text-emerald-300 font-semibold' 
                : `${theme.subBg} hover:border-slate-400`
            }`}
          >
            <input 
              type="checkbox" 
              checked={checklist.env_configured} 
              onChange={() => {}} 
              className="h-4 w-4 rounded accent-emerald-500" 
            />
            <span><code>.env</code> et <code>config/sunurdv.php</code> configurés (Africa/Dakar)</span>
          </label>

          <label 
            onClick={() => toggleCheck('migrations_run')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
              checklist.migrations_run 
                ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-600 dark:text-emerald-300 font-semibold' 
                : `${theme.subBg} hover:border-slate-400`
            }`}
          >
            <input 
              type="checkbox" 
              checked={checklist.migrations_run} 
              onChange={() => {}} 
              className="h-4 w-4 rounded accent-emerald-500" 
            />
            <span>Migration <code>create_tenants_table</code> exécutée sans erreur</span>
          </label>

          <label 
            onClick={() => toggleCheck('url_tested')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
              checklist.url_tested 
                ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-600 dark:text-emerald-300 font-semibold' 
                : `${theme.subBg} hover:border-slate-400`
            }`}
          >
            <input 
              type="checkbox" 
              checked={checklist.url_tested} 
              onChange={() => {}} 
              className="h-4 w-4 rounded accent-emerald-500" 
            />
            <span>URL <code>/e/clinique-keur-madior</code> testée avec succès</span>
          </label>
        </div>

        {/* Confirmation banner */}
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${theme.subBg}`}>
          <div>
            <div className={`font-semibold text-sm ${theme.textPrimary}`}>
              {completedCount === totalCount ? (
                <span className="text-emerald-500 font-bold">🎉 Tout est en place pour valider l'Étape 1 !</span>
              ) : (
                <span>Complétez les tests pour vous assurer que tout fonctionne en local.</span>
              )}
            </div>
            <p className={`text-xs ${theme.textSecondary}`}>
              Nous n'avançons à l'étape suivante qu'après validation complète.
            </p>
          </div>

          <button
            onClick={() => setReadyConfirmed(true)}
            disabled={completedCount < 4}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              readyConfirmed 
                ? 'bg-emerald-700 text-white cursor-default'
                : completedCount >= 4
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 cursor-pointer hover:scale-[1.02]'
                  : 'bg-slate-700/50 text-slate-400 cursor-not-allowed border border-slate-600/40'
            }`}
          >
            {readyConfirmed ? (
              <>
                <Check className="w-4 h-4" />
                <span>Confirmé ! Prêt pour l'Étape 2</span>
              </>
            ) : (
              <>
                <span>J'ai compris et testé l'Étape 1</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};
