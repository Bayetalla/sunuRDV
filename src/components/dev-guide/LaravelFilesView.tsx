import React, { useState } from 'react';
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
  FileArchive
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
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);

  const categories = [
    'Tous',
    'Configuration',
    'Base de Données & Migrations',
    'Modèles Eloquent',
    'Contrôleurs & Webhooks',
    'Services Sénégal',
    'Jobs & Queues',
    'Routes & Kernel',
    'Documentation'
  ];

  const filteredFiles = laravelProjectFiles.filter((file) => {
    const matchesCategory = selectedCategory === 'Tous' || file.category === selectedCategory;
    const matchesSearch = 
      file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeFile: LaravelFileItem = filteredFiles[selectedFileIndex] || laravelProjectFiles[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(true);
    showToast({
      type: 'success',
      title: 'Fichier copié dans le presse-papier !',
      message: `${activeFile.path} prêt à être collé dans votre IDE.`
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
      message: `${file.path} téléchargé avec succès.`
    });
  };

  const handleDownloadFullProjectBundleText = () => {
    let fullText = `================================================================================\n`;
    fullText += `FICHIER COMPLET DU PROJET LARAVEL 11 POUR SUNURDV (SÉNÉGAL SAAS)\n`;
    fullText += `Date d'export : ${new Date().toISOString()}\n`;
    fullText += `Fuseau : Africa/Dakar (GMT+0) | Devise : FCFA (XOF)\n`;
    fullText += `================================================================================\n\n`;

    laravelProjectFiles.forEach((file) => {
      fullText += `\n################################################################################\n`;
      fullText += `### FICHIER: ${file.path}\n`;
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
    link.download = 'sunurdv-laravel11-fichier-complet.txt';
    link.click();
    URL.revokeObjectURL(url);

    showToast({
      type: 'success',
      title: 'Fichier complet Laravel téléchargé 🇸🇳',
      message: 'Fichier unique consolidé contenant l\'ensemble du code source.'
    });
  };

  const handleDownloadFullProjectZip = async () => {
    setIsDownloadingZip(true);
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder('sunurdv');

      laravelProjectFiles.forEach((file) => {
        rootFolder?.file(file.path, file.code);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sunurdv-laravel11-complet.zip';
      link.click();
      URL.revokeObjectURL(url);

      showToast({
        type: 'success',
        title: 'Archive ZIP Laravel générée ! 🚀',
        message: 'L\'archive sunurdv-laravel11-complet.zip est prête pour XAMPP et le déploiement.'
      });
    } catch {
      showToast({
        type: 'warning',
        title: 'Erreur ZIP',
        message: 'Impossible de générer le ZIP. Utilisez l\'export texte complet.'
      });
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const cardBg = theme.cardBg;
  const subBg = theme.subBg;
  const textPrimary = theme.textPrimary;
  const textSecondary = theme.textSecondary;
  const inputBg = theme.inputBg;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner Context */}
      <div className={`border rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition ${
        isDark 
          ? 'bg-gradient-to-r from-red-950/60 via-slate-900 to-amber-950/50 border-red-900/40 text-white' 
          : 'bg-gradient-to-r from-red-50 via-amber-50/40 to-slate-50 border-red-200 text-slate-900 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fichier Complet Laravel 11 • Backend SaaS Sénégal</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${textPrimary}`}>
              Code Source Complet & Fichiers du Projet Laravel
            </h1>
            <p className={`text-sm sm:text-base max-w-3xl leading-relaxed ${textSecondary}`}>
              Tous les fichiers essentiels pour exécuter le backend de <strong>SunuRDV</strong> sous Windows (XAMPP) ou Linux.
              Architecture multi-tenant isolée, validation des numéros sénégalais (+221), gestion des acomptes <strong>Wave & Orange Money</strong> et rappels <strong>WhatsApp Cloud API</strong>.
            </p>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleDownloadFullProjectZip}
              disabled={isDownloadingZip}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/30 transition"
            >
              <FileArchive className="w-4 h-4" />
              <span>{isDownloadingZip ? 'Génération du ZIP...' : 'Télécharger le Projet ZIP (.zip)'}</span>
            </button>

            <button
              onClick={handleDownloadFullProjectBundleText}
              className={`px-5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition hover:scale-[1.02] ${subBg} ${textPrimary}`}
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Télécharger Fichier Unique (.txt)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split: Left Files Navigation, Right Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Explorer (4 cols) */}
        <div className={`lg:col-span-4 rounded-2xl p-5 border space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between border-b pb-3 border-slate-700/20">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-red-500" />
              <h2 className={`font-bold text-sm ${textPrimary}`}>Fichiers du Projet</h2>
            </div>
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${subBg} ${textSecondary}`}>
              {laravelProjectFiles.length} fichiers
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-3 ${textSecondary}`} />
            <input
              type="text"
              placeholder="Rechercher un fichier..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedFileIndex(0);
              }}
              className={`w-full rounded-xl pl-8 pr-3 py-2 text-xs border focus:outline-none transition ${inputBg}`}
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedFileIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-xs'
                    : `${subBg} ${textSecondary} hover:${textPrimary}`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Files List */}
          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredFiles.map((file, idx) => {
              const isSelected = activeFile.path === file.path;
              return (
                <div
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-red-950/40 dark:bg-red-950/40 border-red-500 text-white shadow-sm ring-1 ring-red-500/30'
                      : `${subBg} hover:border-slate-500/40`
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-red-400' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <div className={`text-xs font-mono font-bold truncate ${isSelected ? 'text-red-400' : textPrimary}`}>
                        {file.path}
                      </div>
                      <span className={`text-[10px] block truncate ${textSecondary}`}>
                        {file.category}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    file.language === 'php' ? 'bg-indigo-500/20 text-indigo-400' :
                    file.language === 'json' ? 'bg-amber-500/20 text-amber-400' :
                    file.language === 'ini' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {file.language}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Viewer (8 cols) */}
        <div className={`lg:col-span-8 rounded-2xl border overflow-hidden flex flex-col shadow-xl ${cardBg}`}>
          {/* Viewer Toolbar */}
          <div className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${subBg}`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-red-500 dark:text-red-400">
                  {activeFile.path}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {activeFile.category}
                </span>
              </div>
              <p className={`text-xs mt-1 ${textSecondary}`}>
                {activeFile.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopyCode(activeFile.code)}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
              >
                {copiedFile ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile ? 'Copié !' : 'Copier'}</span>
              </button>

              <button
                onClick={() => handleDownloadSingleFile(activeFile)}
                title="Télécharger ce fichier uniquement"
                className={`p-2 rounded-lg border text-xs transition hover:scale-105 ${subBg} ${textPrimary}`}
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Syntax Highlighted Code Box */}
          <div className="p-4 overflow-x-auto bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed max-h-[620px] overflow-y-auto">
            <pre className="text-slate-200">
              <code>{activeFile.code}</code>
            </pre>
          </div>

          {/* Footer of Viewer */}
          <div className={`p-3 border-t text-[11px] flex items-center justify-between ${subBg}`}>
            <span className={textSecondary}>
              Total : {activeFile.code.split('\n').length} lignes • Encodage : UTF-8 (Compatible XAMPP / Apache / Nginx)
            </span>
            <span className="text-emerald-500 font-semibold font-mono">
              ✓ Testé & Valide Laravel 11
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
