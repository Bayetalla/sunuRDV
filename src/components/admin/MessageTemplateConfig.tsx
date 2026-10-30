import React, { useState, useRef } from 'react';
import { 
  Tenant, 
  MessageTemplate, 
  MessageChannel, 
  MessageTriggerType 
} from '../../types';
import { initialMessageTemplates } from '../../data/mockData';
import { 
  MessageSquare, 
  MessageCircle, 
  Send, 
  Smartphone, 
  Clock, 
  Sparkles, 
  Check, 
  CheckCheck, 
  Copy, 
  RefreshCw, 
  AlertCircle, 
  Phone, 
  Calendar, 
  User, 
  MapPin, 
  ExternalLink, 
  Settings2, 
  ChevronRight, 
  Zap, 
  Globe, 
  CheckCircle2,
  FileText,
  Sliders,
  Share2
} from 'lucide-react';
import { getThemeTokens } from '../../utils/themeTokens';
import { useToast } from '../ui/Toast';

interface MessageTemplateConfigProps {
  tenant: Tenant;
  isDark: boolean;
}

interface MergeVariable {
  tag: string;
  label: string;
  sample: string;
  category: 'patient' | 'rdv' | 'clinique' | 'liens';
}

const MERGE_VARIABLES: MergeVariable[] = [
  { tag: '{patient_prenom}', label: 'Prénom Patient', sample: 'Aminata', category: 'patient' },
  { tag: '{patient_nom}', label: 'Nom Patient', sample: 'Diop', category: 'patient' },
  { tag: '{nom_medecin}', label: 'Nom du Médecin', sample: 'Dr. Cheikh Tidiane Sy', category: 'rdv' },
  { tag: '{specialite}', label: 'Spécialité', sample: 'Cardiologie', category: 'rdv' },
  { tag: '{date_rdv}', label: 'Date du RDV', sample: 'Mardi 28 Octobre 2026', category: 'rdv' },
  { tag: '{heure_rdv}', label: 'Heure du RDV', sample: '10h30', category: 'rdv' },
  { tag: '{nom_clinique}', label: 'Nom du Cabinet', sample: 'Clinique Keur Madior', category: 'clinique' },
  { tag: '{adresse_clinique}', label: 'Adresse Clinique', sample: 'Route des Almadies, Dakar', category: 'clinique' },
  { tag: '{contact_clinique}', label: 'Téléphone Clinique', sample: '+221 33 820 12 34', category: 'clinique' },
  { tag: '{montant_acompte}', label: 'Acompte Payé', sample: '5 000 FCFA', category: 'rdv' },
  { tag: '{lien_billet}', label: 'Lien Pass Digital', sample: 'https://sunu.sn/t/K9X2', category: 'liens' },
  { tag: '{lien_annulation}', label: 'Lien Annulation', sample: 'https://sunu.sn/c/K9X2', category: 'liens' },
];

export const MessageTemplateConfig: React.FC<MessageTemplateConfigProps> = ({
  tenant,
  isDark,
}) => {
  const { showToast } = useToast();
  const theme = getThemeTokens(isDark);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Templates state
  const [templates, setTemplates] = useState<MessageTemplate[]>(() => {
    return initialMessageTemplates.map(t => ({
      ...t,
      tenantId: tenant.id
    }));
  });

  const [activeChannel, setActiveChannel] = useState<MessageChannel>('whatsapp');
  const [activeTrigger, setActiveTrigger] = useState<MessageTriggerType>('confirmation');
  const [activeLangTab, setActiveLangTab] = useState<'fr' | 'wo'>('fr');

  // Test send state
  const [testPhoneNumber, setTestPhoneNumber] = useState<string>('+221 77 450 12 34');
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [lastTestedAt, setLastTestedAt] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Active template being edited
  const currentTemplate = templates.find(
    (t) => t.channel === activeChannel && t.trigger === activeTrigger
  ) || templates[0];

  // Helper to update active template
  const updateCurrentTemplate = (updates: Partial<MessageTemplate>) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === currentTemplate.id ? { ...t, ...updates, updatedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) } : t))
    );
  };

  // Variable insertion at cursor
  const handleInsertVariable = (tag: string) => {
    const textarea = textareaRef.current;
    const currentBody = activeLangTab === 'fr' ? currentTemplate.bodyFr : (currentTemplate.bodyWolof || '');
    
    if (textarea) {
      const start = textarea.selectionStart || currentBody.length;
      const end = textarea.selectionEnd || currentBody.length;
      const newText = currentBody.substring(0, start) + tag + currentBody.substring(end);
      
      if (activeLangTab === 'fr') {
        updateCurrentTemplate({ bodyFr: newText });
      } else {
        updateCurrentTemplate({ bodyWolof: newText });
      }

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + tag.length, start + tag.length);
      }, 50);
    } else {
      const newText = currentBody + ' ' + tag;
      if (activeLangTab === 'fr') {
        updateCurrentTemplate({ bodyFr: newText });
      } else {
        updateCurrentTemplate({ bodyWolof: newText });
      }
    }
  };

  // Dynamic preview generator replacing variables with real clinic context
  const generatePreviewText = (text: string): string => {
    let result = text;
    result = result.replace(/{patient_prenom}/g, 'Aminata');
    result = result.replace(/{patient_nom}/g, 'Diop');
    result = result.replace(/{nom_medecin}/g, 'Dr. Cheikh Tidiane Sy');
    result = result.replace(/{specialite}/g, 'Cardiologie');
    result = result.replace(/{date_rdv}/g, 'Mardi 28 Octobre 2026');
    result = result.replace(/{heure_rdv}/g, '10h30');
    result = result.replace(/{nom_clinique}/g, tenant.name);
    result = result.replace(/{adresse_clinique}/g, `${tenant.address}, ${tenant.city}`);
    result = result.replace(/{contact_clinique}/g, tenant.phone);
    result = result.replace(/{montant_acompte}/g, `${(tenant.defaultDepositAmount || 5000).toLocaleString('fr-FR')} FCFA`);
    result = result.replace(/{lien_billet}/g, `https://sunu.sn/t/K9X2`);
    result = result.replace(/{lien_annulation}/g, `https://sunu.sn/c/K9X2`);
    result = result.replace(/{tenant_slug}/g, tenant.slug);
    return result;
  };

  const previewBody = generatePreviewText(
    activeLangTab === 'fr' 
      ? currentTemplate.bodyFr 
      : (currentTemplate.bodyWolof || currentTemplate.bodyFr)
  );

  // SMS metrics calculator (GSM-7: 160 chars for 1st, 153 for multi-part)
  const currentBodyRaw = activeLangTab === 'fr' ? currentTemplate.bodyFr : (currentTemplate.bodyWolof || '');
  const charCount = currentBodyRaw.length;
  const smsSegments = charCount === 0 ? 1 : Math.ceil(charCount / 160);
  const estimatedCostXOF = smsSegments * 15; // 15 FCFA par SMS au Sénégal via Orange API

  const handleSaveAll = () => {
    setSaveSuccess(true);
    showToast({
      type: 'success',
      title: 'Modèles de rappel sauvegardés ! 🇸🇳',
      message: `La configuration des rappels automatiques pour ${tenant.name} est active en base.`
    });
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestSend = () => {
    if (!testPhoneNumber) {
      showToast({
        type: 'warning',
        title: 'Numéro requis',
        message: 'Veuillez saisir un numéro de téléphone sénégalais (+221).'
      });
      return;
    }

    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      setLastTestedAt(new Date().toLocaleTimeString('fr-FR'));
      showToast({
        type: 'success',
        title: `Message test ${activeChannel.toUpperCase()} envoyé ! 🚀`,
        message: `Envoyé avec succès vers ${testPhoneNumber} via la passerelle ${activeChannel === 'whatsapp' ? 'WhatsApp Cloud API' : 'Orange SMS Sénégal'}.`
      });
    }, 1200);
  };

  // Triggers meta
  const triggersList: { id: MessageTriggerType; label: string; timing: string; icon: any }[] = [
    { id: 'confirmation', label: 'Confirmation Immédiate', timing: 'Dès la réservation', icon: CheckCircle2 },
    { id: 'reminder_24h', label: 'Rappel J-1 (24h avant)', timing: 'La veille à 18h00', icon: Calendar },
    { id: 'reminder_2h', label: 'Rappel Flash H-2 (2h avant)', timing: 'Jour J, 2h avant le créneau', icon: Clock },
    { id: 'cancellation', label: "Avis d'Annulation", timing: 'En cas de libération de créneau', icon: AlertCircle },
    { id: 'followup', label: 'Suivi Post-Consultation', timing: 'J+1 après la visite', icon: Sparkles },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Bar with Channel Selector and Carrier Status */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${theme.cardBg}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badgePurple}`}>
                Module Automatisé • Sénégal
              </span>
              <span className={`text-xs ${theme.textSecondary}`}>
                Délivrabilité certifiée Orange, Free & Expresso
              </span>
            </div>
            <h2 className={`text-lg sm:text-xl font-black ${theme.textPrimary} mt-1 flex items-center gap-2`}>
              <Smartphone className="w-5 h-5 text-indigo-500" />
              <span>Modèles de Rappels de Rendez-vous (SMS & WhatsApp)</span>
            </h2>
            <p className={`text-xs ${theme.textSecondary}`}>
              Personnalisez les messages envoyés automatiquement aux patients pour réduire drastiquement le taux de non-présentation (no-shows).
            </p>
          </div>

          {/* Channel selector pill toggle */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl border bg-slate-900/40 border-slate-700/60 self-start lg:self-center shadow-inner">
            <button
              onClick={() => setActiveChannel('whatsapp')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeChannel === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 scale-100'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>WhatsApp Cloud API</span>
              <span className="text-[10px] bg-emerald-700/60 px-1.5 py-0.2 rounded text-emerald-200 font-mono">
                Recommandé
              </span>
            </button>

            <button
              onClick={() => setActiveChannel('sms')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeChannel === 'sms'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 scale-100'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-300" />
              <span>SMS National Sénégal</span>
              <span className="text-[10px] bg-indigo-700/60 px-1.5 py-0.2 rounded text-indigo-200 font-mono">
                GSM-7
              </span>
            </button>
          </div>
        </div>

        {/* Carrier indicator bar */}
        <div className={`mt-4 pt-3 border-t ${theme.borderSubtle} flex flex-wrap items-center justify-between text-[11px] gap-2`}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Passerelle active : <strong className={theme.textPrimary}>{activeChannel === 'whatsapp' ? 'WhatsApp Business Meta (Dakar Endpoint)' : 'Orange SMS API + Infobip fallback'}</strong>
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="text-slate-400 hidden sm:inline">
              Expéditeur SMS agréé : <strong className="font-mono text-indigo-400 uppercase">KEUR-MADIOR</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span>Coût estimé / rappel :</span>
            <span className="font-bold font-mono text-emerald-400">
              {activeChannel === 'whatsapp' ? '2.5 FCFA (Conversation Utilité)' : `${estimatedCostXOF} FCFA / envoi`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left editor & Right live phone simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: TRIGGER SELECTOR & TEMPLATE EDITOR (7 Cols) */}
        <div className="lg:col-span-7 min-w-0 space-y-6">
          
          {/* Trigger event pills */}
          <div className={`p-4 rounded-2xl border ${theme.cardBg} space-y-3`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${theme.textPrimary} flex items-center gap-1.5`}>
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sélectionner l'événement déclencheur :</span>
              </span>
              <span className={`text-[10px] ${theme.textSecondary}`}>
                5 scénarios pré-configurés
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {triggersList.map((trig) => {
                const Icon = trig.icon;
                const isSelected = activeTrigger === trig.id;
                const matchedTemplate = templates.find(t => t.channel === activeChannel && t.trigger === trig.id);
                const isActive = matchedTemplate?.isActive ?? true;

                return (
                  <button
                    key={trig.id}
                    onClick={() => setActiveTrigger(trig.id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 relative overflow-hidden group ${
                      isSelected
                        ? activeChannel === 'whatsapp'
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-md ring-1 ring-emerald-500/30'
                          : 'border-indigo-500 bg-indigo-500/10 shadow-md ring-1 ring-indigo-500/30'
                        : `${theme.subBg} hover:border-slate-600`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`p-1.5 rounded-lg shrink-0 ${
                          isSelected 
                            ? activeChannel === 'whatsapp' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${isSelected ? theme.textPrimary : theme.textSecondary}`}>
                            {trig.label}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">{trig.timing}</p>
                        </div>
                      </div>

                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                        isActive ? theme.badgeSuccess : theme.badgeNeutral
                      }`}>
                        {isActive ? 'Actif' : 'Désactivé'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor Container */}
          <div className={`p-4 sm:p-5 rounded-2xl border ${theme.cardBg} space-y-4`}>
            
            {/* Template Header & Active Switch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/50">
              <div>
                <h3 className={`text-sm font-bold ${theme.textPrimary} flex items-center gap-2`}>
                  <span>{currentTemplate.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                    activeChannel === 'whatsapp' ? theme.badgeSuccess : theme.badgeInfo
                  }`}>
                    {activeChannel.toUpperCase()}
                  </span>
                </h3>
                <p className={`text-xs ${theme.textSecondary} mt-0.5`}>
                  {currentTemplate.description}
                </p>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className={`text-xs font-medium ${theme.textSecondary}`}>Envoi automatique :</span>
                <button
                  type="button"
                  onClick={() => updateCurrentTemplate({ isActive: !currentTemplate.isActive })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                    currentTemplate.isActive ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      currentTemplate.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Language tab selector (French vs Wolof) */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900/50 border border-slate-800 text-xs w-full xs:w-auto overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('fr')}
                  className={`px-3 py-1 rounded-md font-medium transition shrink-0 ${
                    activeLangTab === 'fr' 
                      ? 'bg-slate-800 text-white shadow font-bold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇫🇷 Français (Officiel)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('wo')}
                  className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1 shrink-0 ${
                    activeLangTab === 'wo' 
                      ? 'bg-slate-800 text-emerald-400 shadow font-bold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇸🇳 Wolof</span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-1 rounded">
                    Populaire
                  </span>
                </button>
              </div>

              <span className={`text-[11px] ${theme.textSecondary}`}>
                Modifié : <span className="font-mono">{currentTemplate.updatedAt}</span>
              </span>
            </div>

            {/* Merge tags toolbar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold ${theme.textSecondary} flex items-center gap-1`}>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Variables dynamiques (cliquer pour insérer dans le texte) :</span>
                </span>
                <span className="text-[10px] text-slate-500">Auto-remplacé lors de l'envoi</span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 rounded-xl bg-slate-950/50 border border-slate-800/80">
                {MERGE_VARIABLES.map((v) => (
                  <button
                    key={v.tag}
                    type="button"
                    onClick={() => handleInsertVariable(v.tag)}
                    className="px-2 py-1 rounded-md text-[11px] font-mono bg-slate-800/80 hover:bg-indigo-600 hover:text-white text-slate-300 border border-slate-700 hover:border-indigo-500 transition-all active:scale-95 flex items-center gap-1"
                    title={`Exemple : ${v.sample}`}
                  >
                    <span>{v.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea Editor */}
            <div className="space-y-2">
              <label className={`text-xs font-semibold ${theme.textPrimary} flex items-center justify-between`}>
                <span>Contenu du message ({activeLangTab === 'fr' ? 'Français' : 'Wolof'}) :</span>
                {activeChannel === 'whatsapp' && (
                  <span className="text-[10px] text-slate-400 font-normal">
                    Formatage WhatsApp supporté : *gras*, _italique_, ~barré~
                  </span>
                )}
              </label>

              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={activeLangTab === 'fr' ? currentTemplate.bodyFr : (currentTemplate.bodyWolof || '')}
                  onChange={(e) => {
                    if (activeLangTab === 'fr') {
                      updateCurrentTemplate({ bodyFr: e.target.value });
                    } else {
                      updateCurrentTemplate({ bodyWolof: e.target.value });
                    }
                  }}
                  rows={activeChannel === 'whatsapp' ? 8 : 4}
                  className={`w-full rounded-xl p-3.5 text-xs sm:text-sm font-sans border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${theme.inputBg}`}
                  placeholder={
                    activeLangTab === 'fr' 
                      ? 'Rédigez le modèle en français...' 
                      : 'Bindal modélu fàttali bi ci wolof...'
                  }
                />
              </div>

              {/* Character and Segment counter (especially vital for SMS) */}
              <div className="flex flex-wrap items-center justify-between text-xs pt-1 px-1 text-slate-400">
                <div className="flex items-center gap-3">
                  <span>
                    Longueur : <strong className={theme.textPrimary}>{charCount}</strong> caractères
                  </span>
                  {activeChannel === 'sms' && (
                    <>
                      <span>•</span>
                      <span>
                        Segments SMS :{' '}
                        <strong className={smsSegments > 1 ? 'text-amber-400' : 'text-emerald-400'}>
                          {smsSegments} SMS ({charCount <= 160 ? `${160 - charCount} restants` : `${smsSegments * 153 - charCount} restants sur segment ${smsSegments}`})
                        </strong>
                      </span>
                    </>
                  )}
                </div>

                <div className="text-[11px] text-slate-500">
                  Norme GSM-7 standard • Compatibilité 100% téléphones simples (Nokia/Itel)
                </div>
              </div>
            </div>

            {/* Smart Links & Option Toggles */}
            <div className="p-3.5 rounded-xl border border-slate-700/60 bg-slate-950/40 space-y-3">
              <span className={`text-xs font-bold ${theme.textPrimary} block`}>
                Options & Liens Automatiques Inclus :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={currentTemplate.includeTicketLink}
                    onChange={(e) => updateCurrentTemplate({ includeTicketLink: e.target.checked })}
                    className="rounded text-emerald-500 accent-emerald-500"
                  />
                  <span>Lien vers Pass / Billet digital ({'{lien_billet}'})</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={currentTemplate.includeCancelLink}
                    onChange={(e) => updateCurrentTemplate({ includeCancelLink: e.target.checked })}
                    className="rounded text-emerald-500 accent-emerald-500"
                  />
                  <span>Lien d'annulation autonome ({'{lien_annulation}'})</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={currentTemplate.includeGpsLink ?? false}
                    onChange={(e) => updateCurrentTemplate({ includeGpsLink: e.target.checked })}
                    className="rounded text-emerald-500 accent-emerald-500"
                  />
                  <span>Localisation Google Maps Dakar</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={currentTemplate.includeWaveDepositLink ?? false}
                    onChange={(e) => updateCurrentTemplate({ includeWaveDepositLink: e.target.checked })}
                    className="rounded text-emerald-500 accent-emerald-500"
                  />
                  <span>Lien direct paiement Wave QR</span>
                </label>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const orig = initialMessageTemplates.find(
                    t => t.channel === activeChannel && t.trigger === activeTrigger
                  );
                  if (orig) {
                    updateCurrentTemplate({
                      bodyFr: orig.bodyFr,
                      bodyWolof: orig.bodyWolof,
                      isActive: orig.isActive,
                    });
                    showToast({
                      type: 'info',
                      title: 'Modèle réinitialisé',
                      message: 'Le texte officiel par défaut a été restauré.'
                    });
                  }
                }}
                className={`text-xs px-3.5 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition ${theme.subBg}`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Rétablir modèle d'origine</span>
              </button>

              <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fadeIn mr-auto sm:mr-0">
                    <Check className="w-4 h-4" /> Enregistré !
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition hover:scale-[1.02] active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Sauvegarder ce modèle</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE SMARTPHONE PREVIEW & TEST SANDBOX (5 Cols) */}
        <div className="lg:col-span-5 min-w-0 space-y-4">
          
          {/* Smartphone Simulator */}
          <div className="mx-auto w-full max-w-[320px] xs:max-w-sm rounded-[2rem] sm:rounded-[2.5rem] p-2.5 sm:p-3.5 bg-slate-900 border-4 border-slate-800 shadow-2xl shadow-black/80 relative box-border">
            
            {/* Speaker & camera notch */}
            <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 h-3.5 sm:h-4 w-24 sm:w-28 bg-slate-950 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 z-20">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
              <div className="h-1.5 sm:h-2 w-6 sm:w-8 rounded-full bg-slate-800/80" />
            </div>

            {/* Phone Screen Container */}
            <div className={`rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden flex flex-col h-[480px] sm:h-[520px] transition-colors duration-300 relative ${
              activeChannel === 'whatsapp' ? 'bg-[#0b141a]' : 'bg-slate-900'
            }`}>
              
              {/* Phone Status bar */}
              <div className="px-5 pt-3 pb-2 flex items-center justify-between text-[10px] text-slate-400 font-medium z-10">
                <span className="font-mono">10:30</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono">Orange SN</span>
                  <span className="font-bold">4G</span>
                  <div className="w-4 h-2 border border-slate-400 rounded-xs p-0.5 flex items-center">
                    <div className="h-full w-2.5 bg-slate-300 rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* HEADER: Dynamic depending on channel */}
              {activeChannel === 'whatsapp' ? (
                /* WhatsApp Top Bar */
                <div className="bg-[#1f2c34] px-3.5 py-2.5 border-b border-[#2a3942] flex items-center justify-between text-white shadow-sm z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow">
                        {tenant.logo}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-400 rounded-full border-2 border-[#1f2c34]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold leading-tight truncate max-w-[140px]">
                          {tenant.name}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 shrink-0" />
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium block">
                        Compte Professionnel Vérifié
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5" />
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              ) : (
                /* SMS Top Bar */
                <div className="bg-slate-850 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-white z-10">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                      {tenant.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">KEUR-MADIOR</span>
                      <span className="text-[9px] text-slate-400">SMS Officiel Certifié</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-mono">Orange SN</span>
                </div>
              )}

              {/* MESSAGE CHAT AREA */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 relative">
                {/* Date indicator pill */}
                <div className="flex justify-center">
                  <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-400 font-mono shadow-xs">
                    Aujourd'hui • Dakar GMT+0
                  </span>
                </div>

                {/* Message Bubble Container with smooth slide animation */}
                <div className="animate-slideUp flex flex-col items-start max-w-[92%]">
                  <div className={`p-3 rounded-2xl shadow-md text-xs leading-relaxed whitespace-pre-line relative ${
                    activeChannel === 'whatsapp'
                      ? 'bg-[#005c4b] text-white rounded-tl-xs'
                      : 'bg-indigo-600 text-white rounded-tl-xs shadow-indigo-950/40'
                  }`}>
                    {/* Message Text with bold markdown rendering */}
                    <div className="text-[11.5px] leading-relaxed break-words font-sans">
                      {previewBody.split('\n').map((line, idx) => {
                        // Quick bold parser for preview
                        const parts = line.split(/(\*[^*]+\*)/g);
                        return (
                          <div key={idx} className={line === '' ? 'h-2' : ''}>
                            {parts.map((p, pIdx) => {
                              if (p.startsWith('*') && p.endsWith('*')) {
                                return <strong key={pIdx} className="font-bold">{p.slice(1, -1)}</strong>;
                              }
                              if (p.startsWith('http')) {
                                return <span key={pIdx} className="text-sky-300 underline font-mono text-[10px]">{p}</span>;
                              }
                              return <span key={pIdx}>{p}</span>;
                            })}
                          </div>
                        );
                      })}
                    </div>

                    {/* Meta info & delivery ticks */}
                    <div className="flex items-center justify-end gap-1 mt-1.5 text-[9px] text-emerald-200/80">
                      <span>10:30</span>
                      {activeChannel === 'whatsapp' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-sky-300" />
                      ) : (
                        <Check className="w-3 h-3 text-white/80" />
                      )}
                    </div>
                  </div>

                  {/* WhatsApp Quick Action Reply Buttons simulation */}
                  {activeChannel === 'whatsapp' && (
                    <div className="mt-2 space-y-1 w-full animate-fadeIn">
                      <div className="bg-[#1f2c34] text-emerald-400 text-[10.5px] font-bold py-1.5 px-3 rounded-lg border border-[#2a3942] text-center shadow-xs flex items-center justify-center gap-1.5 hover:bg-[#26353d] transition cursor-pointer">
                        <Check className="w-3 h-3" />
                        <span>Confirmer ma venue</span>
                      </div>
                      <div className="bg-[#1f2c34] text-slate-300 text-[10.5px] font-medium py-1.5 px-3 rounded-lg border border-[#2a3942] text-center shadow-xs flex items-center justify-center gap-1.5 hover:bg-[#26353d] transition cursor-pointer">
                        <Phone className="w-3 h-3" />
                        <span>Appeler la clinique (+221)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Mock Input Bar */}
              <div className={`p-2.5 border-t flex items-center gap-2 text-xs ${
                activeChannel === 'whatsapp' ? 'bg-[#1f2c34] border-[#2a3942]' : 'bg-slate-850 border-slate-800'
              }`}>
                <div className="flex-1 bg-slate-900/80 rounded-full px-3 py-1.5 text-[11px] text-slate-400 border border-slate-700/60 truncate">
                  {activeChannel === 'whatsapp' ? 'Tapez un message...' : 'Message texte (SMS)'}
                </div>
                <div className="h-7 w-7 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Test Sandbox Panel */}
          <div className={`p-4 rounded-2xl border ${theme.cardBg} space-y-3`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${theme.textPrimary} flex items-center gap-1.5`}>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulateur d'envoi en direct (Test Sandbox) :</span>
              </span>
              <span className={`text-[10px] font-mono ${theme.accentGreen}`}>
                Mode Sandbox Gratuit
              </span>
            </div>

            <div className="flex flex-col xs:flex-row gap-2">
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  value={testPhoneNumber}
                  onChange={(e) => setTestPhoneNumber(e.target.value)}
                  placeholder="+221 77 000 00 00"
                  className={`w-full rounded-xl px-3 py-2 text-xs font-mono border focus:outline-none focus:border-indigo-500 transition ${theme.inputBg}`}
                />
              </div>

              <button
                type="button"
                onClick={handleTestSend}
                disabled={isSendingTest}
                className="w-full xs:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition active:scale-95 shadow"
              >
                {isSendingTest ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Envoi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer test</span>
                  </>
                )}
              </button>
            </div>

            {lastTestedAt && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Dernier test exécuté avec succès à {lastTestedAt}
              </p>
            )}

            <div className={`text-[11px] p-2.5 rounded-xl border ${theme.subBg} text-slate-400 flex items-start gap-2`}>
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Les messages tests simulent l'API réelle sans impacter le forfait SMS Orange de l'établissement.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
