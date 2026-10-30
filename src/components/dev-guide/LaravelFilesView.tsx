import React, { useState, useMemo } from 'react';
import { laravelProjectFiles, LaravelFileItem } from '../../data/laravelProjectFiles';
import { 
  FileCode, 
  FolderTree, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Layers, 
  Database, 
  Server, 
  Code2, 
  ShieldCheck, 
  Sparkles,
  FileText,
  FileArchive,
  Globe,
  UserCheck,
  Building2,
  Cpu,
  ArrowRight,
  ExternalLink,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { getThemeTokens } from '../../utils/themeTokens';
import { useToast } from '../ui/Toast';
import JSZip from 'jszip';

interface LaravelFilesViewProps {
  isDark?: boolean;
}

export const LaravelFilesView: React.FC<LaravelFilesViewProps> = ({ isDark = true }) => {
  const { showToast } = useToast();
  const theme = getThemeTokens(isDark);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [selectedSpace, setSelectedSpace] = useState<'all' | 'public' | 'client' | 'admin' | 'shared'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);

  // Espaces applicatifs disponibles
  const spaces = [
    { id: 'all', label: 'Tous les Espaces', icon: Layers, count: laravelProjectFiles.length, badge: 'Global' },
    { id: 'public', label: 'Espace Public (RDV en ligne)', icon: Globe, count: laravelProjectFiles.filter(f => f.space === 'public').length, badge: 'Livewire + React' },
    { id: 'client', label: 'Espace Client (Patient)', icon: UserCheck, count: laravelProjectFiles.filter(f => f.space === 'client').length, badge: 'Live Queue Ticket' },
    { id: 'admin', label: 'Espace Admin (Clinique & SaaS)', icon: ShieldCheck, count: laravelProjectFiles.filter(f => f.space === 'admin').length, badge: 'Realtime Toast' },
    { id: 'shared', label: 'Architecture & Core Config', icon: Cpu, count: laravelProjectFiles.filter(f => f.space === 'shared').length, badge: 'Laravel 12' },
  ];

  const categories = useMemo(() => {
    const list = Array.from(new Set(laravelProjectFiles.map(f => f.category)));
    return ['Tous', ...list];
  }, []);

  const filteredFiles = useMemo(() => {
    return laravelProjectFiles.filter((file) => {
      const matchesSpace = selectedSpace === 'all' || file.space === selectedSpace;
      const matchesCategory = selectedCategory === 'Tous' || file.category === selectedCategory;
      const matchesSearch = 
        file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.spaceLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSpace && matchesCategory && matchesSearch;
    });
  }, [selectedSpace, selectedCategory, searchQuery]);

  const activeFile: LaravelFileItem = filteredFiles[selectedFileIndex] || filteredFiles[0] || laravelProjectFiles[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(true);
    showToast({
      type: 'success',
      title: 'Code copié avec succès ! 🇸🇳',
      message: `${activeFile.path} est prêt à être collé dans votre éditeur.`
    });
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleDownloadSingleFile = (file: LaravelFileItem) => {
    const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.path.split('/').pop() || 'fichier.php';
    link.click();
    URL.revokeObjectURL(url);

    showToast({
      type: 'info',
      title: 'Téléchargement lancé',
      message: `${file.path} téléchargé.`
    });
  };

  const handleDownloadFullProjectBundleText = () => {
    let fullText = `================================================================================\n`;
    fullText += `FICHIER CONSOLIDÉ DU PROJET LARAVEL 12 COMPLET (LIVEWIRE 3 + REACT + TAILWIND)\n`;
    fullText += `PLATEFORME SUNURDV SÉNÉGAL - SÉPARATION DES ESPACES PUBLIC, CLIENT ET ADMIN\n`;
    fullText += `Date d'export : ${new Date().toISOString()}\n`;
    fullText += `Fuseau : Africa/Dakar (GMT+0) | Devise : FCFA (XOF)\n`;
    fullText += `================================================================================\n\n`;

    laravelProjectFiles.forEach((file) => {
      fullText += `\n################################################################################\n`;
      fullText += `### FICHIER: ${file.path}\n`;
      fullText += `### ESPACE: ${file.spaceLabel} (${file.space})\n`;
      fullText += `### CATÉGORIE: ${file.category}\n`;
      fullText += `### DESCRIPTION: ${file.description}\n`;
      fullText += `################################################################################\n\n`;
      fullText += file.code;
      fullText += `\n\n`;
    });

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sunurdv-laravel12-fichier-complet.txt';
    link.click();
    URL.revokeObjectURL(url);

    showToast({
      type: 'success',
      title: 'Fichier complet Laravel 12 téléchargé 🇸🇳',
      message: 'Fichier unique consolidé avec l\'ensemble du code source.'
    });
  };

  const handleDownloadFullProjectZip = async () => {
    setIsDownloadingZip(true);
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder('sunurdv-laravel12');

      laravelProjectFiles.forEach((file) => {
        rootFolder?.file(file.path, file.code);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sunurdv-laravel12-complet.zip';
      link.click();
      URL.revokeObjectURL(url);

      showToast({
        type: 'success',
        title: 'Archive ZIP Laravel 12 générée ! 🚀',
        message: 'L\'archive sunurdv-laravel12-complet.zip est prête avec l\'arborescence complète.'
      });
    } catch {
      showToast({
        type: 'warning',
        title: 'Erreur de génération ZIP',
        message: 'Téléchargement de secours via fichier texte.'
      });
      handleDownloadFullProjectBundleText();
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const cardBg = theme.cardBg;
  const subBg = theme.subBg;
  const textPrimary = theme.textPrimary;
  const textSecondary = theme.textSecondary;
  const inputBg = theme.inputBg;
  const borderCol = theme.borderCol;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner Context */}
      <div className={`border rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition ${
        isDark 
          ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/50 border-emerald-900/40 text-white' 
          : 'bg-gradient-to-r from-emerald-50 via-teal-50/40 to-slate-50 border-emerald-200 text-slate-900 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Architecture Laravel 12 • Livewire 3 • Tailwind CSS • React 18/19</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${textPrimary}`}>
              Fichiers Complets du Projet Laravel 12
            </h1>
            <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${textSecondary}`}>
              Code source backend & frontend complet pour <strong>SunuRDV Sénégal</strong>.
              Séparation stricte en 3 espaces distincts : <strong>Espace Public</strong> (vitrine & réservation instantanée sans compte), 
              <strong>Espace Client / Patient</strong> (compte personnel & ticket file d'attente en temps réel), et 
              <strong>Espace Admin Clinique & SuperAdmin</strong> (agenda temps réel avec notification Toast, gestion de caisse et multi-tenancy).
            </p>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleDownloadFullProjectZip}
              disabled={isDownloadingZip}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 transition cursor-pointer"
            >
              <FileArchive className="w-4 h-4" />
              <span>{isDownloadingZip ? 'Génération de l\'archive ZIP...' : 'Télécharger Projet Complet (.zip)'}</span>
            </button>

            <button
              onClick={handleDownloadFullProjectBundleText}
              className={`px-5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition hover:scale-[1.02] cursor-pointer ${subBg} ${textPrimary}`}
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Télécharger Fichier Unique (.txt)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cartographie Visuelle des 3 Espaces Utilisateurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Espace 1: Public */}
        <div 
          onClick={() => { setSelectedSpace('public'); setSelectedFileIndex(0); }}
          className={`p-5 rounded-2xl border transition cursor-pointer hover:shadow-lg ${
            selectedSpace === 'public'
              ? 'border-emerald-500 ring-2 ring-emerald-500/30 ' + (isDark ? 'bg-emerald-950/30' : 'bg-emerald-50/70')
              : cardBg + ' hover:border-emerald-400/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              routes/public.php
            </span>
          </div>
          <h3 className={`font-bold text-sm mt-3 ${textPrimary}`}>1. Espace Public</h3>
          <p className={`text-xs mt-1 leading-relaxed ${textSecondary}`}>
            Vitrine sans compte, tunnel Livewire multi-étapes et widget React de sélection tactile de créneaux.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Voir les fichiers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Espace 2: Client */}
        <div 
          onClick={() => { setSelectedSpace('client'); setSelectedFileIndex(0); }}
          className={`p-5 rounded-2xl border transition cursor-pointer hover:shadow-lg ${
            selectedSpace === 'client'
              ? 'border-sky-500 ring-2 ring-sky-500/30 ' + (isDark ? 'bg-sky-950/30' : 'bg-sky-50/70')
              : cardBg + ' hover:border-sky-400/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-400 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
              routes/client.php
            </span>
          </div>
          <h3 className={`font-bold text-sm mt-3 ${textPrimary}`}>2. Espace Client (Patient)</h3>
          <p className={`text-xs mt-1 leading-relaxed ${textSecondary}`}>
            Connexion par OTP SMS Sénégal (+221), historique, ticket LiveQueueTicket React avec compte à rebours et QR code.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-sky-600 dark:text-sky-400">
            <span>Voir les fichiers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Espace 3: Admin */}
        <div 
          onClick={() => { setSelectedSpace('admin'); setSelectedFileIndex(0); }}
          className={`p-5 rounded-2xl border transition cursor-pointer hover:shadow-lg ${
            selectedSpace === 'admin'
              ? 'border-purple-500 ring-2 ring-purple-500/30 ' + (isDark ? 'bg-purple-950/30' : 'bg-purple-50/70')
              : cardBg + ' hover:border-purple-400/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
              routes/admin.php
            </span>
          </div>
          <h3 className={`font-bold text-sm mt-3 ${textPrimary}`}>3. Espace Admin & SaaS</h3>
          <p className={`text-xs mt-1 leading-relaxed ${textSecondary}`}>
            Agenda clinique avec Toast notification en temps réel, caisse en FCFA, et SuperAdmin multi-cliniques.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
            <span>Voir les fichiers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Main Split: Left Files Navigation, Right Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Explorer (4 cols) */}
        <div className={`lg:col-span-4 min-w-0 rounded-3xl p-4 sm:p-5 border space-y-4 shadow-sm ${cardBg}`}>
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-emerald-500" />
              <h2 className={`font-bold text-sm ${textPrimary}`}>Explorateur de Code</h2>
            </div>
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${subBg} ${textSecondary}`}>
              {filteredFiles.length} fichiers
            </span>
          </div>

          {/* Filtre par Espace Utilisateur */}
          <div className="space-y-1">
            <label className={`text-[11px] font-bold uppercase tracking-wider block ${textSecondary}`}>
              Filtrer par Espace :
            </label>
            <div className="grid grid-cols-1 gap-1">
              {spaces.map((sp) => {
                const isCurrent = selectedSpace === sp.id;
                const Icon = sp.icon;
                return (
                  <button
                    key={sp.id}
                    onClick={() => {
                      setSelectedSpace(sp.id as any);
                      setSelectedFileIndex(0);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition text-left cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : `${subBg} ${textSecondary} hover:${textPrimary}`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{sp.label}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isCurrent ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {sp.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="relative pt-2">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-5 ${textSecondary}`} />
            <input
              type="text"
              placeholder="Rechercher un fichier ou chemin..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedFileIndex(0);
              }}
              className={`w-full rounded-xl pl-8 pr-3 py-2 text-xs border focus:outline-none transition ${inputBg} ${textPrimary}`}
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedFileIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : `${subBg} ${textSecondary} hover:${textPrimary}`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Files List */}
          <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredFiles.map((file, idx) => {
              const isSelected = activeFile.path === file.path;
              return (
                <div
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-white shadow-sm ring-1 ring-emerald-500/30'
                      : `${subBg} hover:border-slate-400 dark:hover:border-slate-700`
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <div className={`text-xs font-mono font-bold truncate ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : textPrimary}`}>
                        {file.path}
                      </div>
                      <span className={`text-[10px] block truncate ${textSecondary}`}>
                        {file.spaceLabel}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded shrink-0 ${
                    file.language === 'php' ? 'bg-indigo-500/20 text-indigo-500 dark:text-indigo-400' :
                    file.language === 'tsx' || file.language === 'javascript' ? 'bg-sky-500/20 text-sky-500 dark:text-sky-400' :
                    file.language === 'json' ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400' :
                    file.language === 'html' ? 'bg-orange-500/20 text-orange-500 dark:text-orange-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {file.language}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Viewer (8 cols) */}
        <div className={`lg:col-span-8 min-w-0 rounded-3xl border overflow-hidden flex flex-col shadow-xl ${cardBg}`}>
          {/* Viewer Toolbar */}
          <div className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${subBg}`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {activeFile.path}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-slate-800 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700">
                  {activeFile.spaceLabel}
                </span>
              </div>
              <p className={`text-xs mt-1 ${textSecondary}`}>
                {activeFile.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopyCode(activeFile.code)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                {copiedFile ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile ? 'Copié !' : 'Copier'}</span>
              </button>

              <button
                onClick={() => handleDownloadSingleFile(activeFile)}
                title="Télécharger ce fichier uniquement"
                className={`p-2 rounded-xl border text-xs transition hover:scale-105 cursor-pointer ${subBg} ${textPrimary}`}
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Syntax Highlighted Code Box */}
          <div className="p-4 overflow-x-auto bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed max-h-[640px] overflow-y-auto">
            <pre className="text-slate-200">
              <code>{activeFile.code}</code>
            </pre>
          </div>

          {/* Footer of Viewer */}
          <div className={`p-3 border-t text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${subBg}`}>
            <span className={textSecondary}>
              Total : {activeFile.code.split('\n').length} lignes • Encodage : UTF-8 (Compatible Laravel 12 & Sail/Docker)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Livewire 3 + React + Tailwind
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
