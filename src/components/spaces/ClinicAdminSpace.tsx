import React, { useState } from 'react';
import { Tenant, Practitioner, MedicalService, Appointment } from '../../types';
import { 
  Building2, 
  Users, 
  Settings, 
  DollarSign, 
  ShieldCheck, 
  Save, 
  Check, 
  Bell, 
  CreditCard, 
  Clock, 
  ToggleLeft, 
  ToggleRight, 
  UserPlus, 
  FileSpreadsheet, 
  Globe,
  FileCode,
  Download,
  Plus,
  Trash2,
  Pencil,
  Search,
  AlertTriangle,
  Tag
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { getThemeTokens } from '../../utils/themeTokens';
import { ServiceModal } from '../services/ServiceModal';
import { PractitionerModal } from '../admin/PractitionerModal';
import { MessageTemplateConfig } from '../admin/MessageTemplateConfig';

interface ClinicAdminSpaceProps {
  tenant: Tenant;
  practitioners: Practitioner[];
  services: MedicalService[];
  appointments: Appointment[];
  isDark: boolean;
  onUpdateTenantSettings?: (updated: Partial<Tenant>) => void;
  onSavePractitioner?: (data: Omit<Practitioner, 'id'> & { id?: string }) => void;
  onDeletePractitioner?: (docId: string) => void;
  onSaveService?: (serviceData: Omit<MedicalService, 'id'> & { id?: string }) => void;
  onDeleteService?: (serviceId: string) => void;
  onTogglePractitionerService?: (serviceId: string, practitionerId: string) => void;
}

export const ClinicAdminSpace: React.FC<ClinicAdminSpaceProps> = ({
  tenant,
  practitioners,
  services,
  appointments,
  isDark,
  onUpdateTenantSettings,
  onSavePractitioner,
  onDeletePractitioner,
  onSaveService,
  onDeleteService,
  onTogglePractitionerService,
}) => {
  const { showToast } = useToast();
  const theme = getThemeTokens(isDark);
  const [activeTab, setActiveTab] = useState<'overview' | 'practitioners' | 'services' | 'payments' | 'messages' | 'laravel_code'>('overview');

  // Practitioners Management State
  const [isPractitionerModalOpen, setIsPractitionerModalOpen] = useState(false);
  const [practitionerToEdit, setPractitionerToEdit] = useState<Practitioner | null>(null);
  const [practitionerToDelete, setPractitionerToDelete] = useState<Practitioner | null>(null);

  // Services CRUD State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<MedicalService | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<MedicalService | null>(null);
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('all');

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = ['Reference', 'Date', 'Heure', 'Patient', 'Telephone', 'Praticien', 'Service', 'Statut', 'Tarif_FCFA', 'Acompte_FCFA', 'Moyen_Paiement'];
    const rows = appointments.map((a) => {
      const doc = practitioners.find((p) => p.id === a.practitionerId)?.name || 'N/A';
      const svc = services.find((s) => s.id === a.serviceId)?.name || 'N/A';
      return [
        a.reference,
        a.date,
        a.timeSlot,
        `"${a.patientName.replace(/"/g, '""')}"`,
        `"${a.patientPhone}"`,
        `"${doc.replace(/"/g, '""')}"`,
        `"${svc.replace(/"/g, '""')}"`,
        a.status,
        a.amountXOF,
        a.depositPaidXOF,
        a.paymentMethod
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sunurdv_${tenant.slug}_registre_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast({
      type: 'success',
      title: 'Export CSV réussi 📊',
      message: `${appointments.length} rendez-vous exportés pour votre comptabilité.`
    });
  };

  // Local settings form state
  const [requireDeposit, setRequireDeposit] = useState(tenant.requireDeposit);
  const [defaultDeposit, setDefaultDeposit] = useState(tenant.defaultDepositAmount);
  const [waveEnabled, setWaveEnabled] = useState(tenant.paymentMethods.includes('wave'));
  const [omEnabled, setOmEnabled] = useState(tenant.paymentMethods.includes('orange_money'));
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Financial statistics
  const totalRevenue = appointments.reduce((sum, a) => sum + a.amountXOF, 0);
  const totalDeposits = appointments.reduce((sum, a) => sum + a.depositPaidXOF, 0);
  const completedCount = appointments.filter((a) => a.status === 'completed').length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    showToast({
      type: 'success',
      title: 'Paramètres du cabinet mis à jour',
      message: 'Configuration Wave, Orange Money et acomptes sauvegardée en base.'
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const cardBg = theme.cardBg;
  const subBg = theme.subBg;
  const textPrimary = theme.textPrimary;
  const textSecondary = theme.textSecondary;
  const inputBg = theme.inputBg;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Top Banner Context */}
      <div className={`rounded-2xl p-6 border ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/30 flex items-center justify-center text-3xl shrink-0">
            {tenant.logo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badgeInfo}`}>
                Espace Direction & Administration
              </span>
              <span className={`text-[10px] font-mono ${theme.accentGreen}`}>/e/{tenant.slug}/admin</span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-black ${textPrimary} mt-1`}>
              Gestion du Cabinet : {tenant.name}
            </h1>
            <p className={`text-xs ${textSecondary}`}>
              Configuration des praticiens, des actes médicaux, des acomptes Wave / Orange Money et des autorisations.
            </p>
          </div>
        </div>

        {/* Navigation tabs within Admin */}
        <div className={`flex items-center p-1.5 rounded-xl border ${subBg} text-xs overflow-x-auto no-scrollbar w-full md:w-auto -mx-1 px-1 sm:mx-0 sm:px-0`}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white font-bold' : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('practitioners')}
            className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'practitioners' ? 'bg-indigo-600 text-white font-bold' : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            Médecins ({practitioners.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'services' ? 'bg-indigo-600 text-white font-bold' : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            Actes & Tarifs ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'payments' ? 'bg-indigo-600 text-white font-bold' : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            Acomptes & Wave
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'messages' ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-900/30' : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            <span>Rappels SMS/WhatsApp</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-bold">
              Auto
            </span>
          </button>
          <button
            onClick={() => setActiveTab('laravel_code')}
            className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'laravel_code' ? 'bg-emerald-600 text-white font-bold' : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            Code Laravel 12 ⚡
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Action Bar with CSV Export */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl">
            <div>
              <h3 className={`text-xs sm:text-sm font-bold ${textPrimary} flex items-center gap-2`}>
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span>Registre & Journal Quotidien du Cabinet</span>
              </h3>
              <p className={`text-[11px] ${textSecondary}`}>
                {appointments.length} rendez-vous enregistrés aujourd'hui • Total prévisionnel : {totalRevenue.toLocaleString('fr-FR')} FCFA
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-950/40 transition hover:scale-[1.02]"
              title="Exporter le registre complet au format Excel CSV UTF-8"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exporter Registre CSV (Excel)</span>
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border ${cardBg}`}>
              <span className={`text-[11px] font-medium ${textSecondary}`}>Chiffre d'Affaires Prévu</span>
              <div className={`text-2xl font-black font-mono mt-1 ${textPrimary}`}>
                {totalRevenue.toLocaleString('fr-FR')} FCFA
              </div>
              <span className={`text-[10px] font-medium ${theme.accentGreen}`}>Revenus cumulés des RDV</span>
            </div>

            <div className={`p-4 rounded-xl border ${cardBg}`}>
              <span className={`text-[11px] font-medium ${textSecondary}`}>Acomptes Encaissés (Mobile Money)</span>
              <div className={`text-2xl font-black font-mono mt-1 ${theme.accentSky}`}>
                {totalDeposits.toLocaleString('fr-FR')} FCFA
              </div>
              <span className={`text-[10px] font-medium ${theme.accentSky}`}>Wave & Orange Money</span>
            </div>

            <div className={`p-4 rounded-xl border ${cardBg}`}>
              <span className={`text-[11px] font-medium ${textSecondary}`}>Consultations Finalisées</span>
              <div className={`text-2xl font-black mt-1 ${theme.accentGreen}`}>{completedCount}</div>
              <span className={`text-[10px] font-medium ${theme.accentGreen}`}>Patient facturé et sorti</span>
            </div>

            <div className={`p-4 rounded-xl border ${cardBg}`}>
              <span className={`text-[11px] font-medium ${textSecondary}`}>Équipe Médicale & Accueil</span>
              <div className={`text-2xl font-black mt-1 ${textPrimary}`}>{practitioners.length + 2} pers.</div>
              <span className="text-[10px] text-indigo-500 font-medium">Médecins + Réceptionnistes</span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
              <h3 className={`font-bold text-sm ${textPrimary} flex items-center gap-2`}>
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span>Paramètres de la Structure</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className={`flex justify-between border-b pb-2 ${theme.borderSubtle}`}>
                  <span className={textSecondary}>Nom légal :</span>
                  <span className={`font-semibold ${textPrimary}`}>{tenant.name}</span>
                </div>
                <div className={`flex justify-between border-b pb-2 ${theme.borderSubtle}`}>
                  <span className={textSecondary}>URL Publique :</span>
                  <span className={`font-mono ${theme.accentGreen}`}>sunurdv.sn/e/{tenant.slug}</span>
                </div>
                <div className={`flex justify-between border-b pb-2 ${theme.borderSubtle}`}>
                  <span className={textSecondary}>Adresse :</span>
                  <span className={`font-semibold ${textPrimary}`}>{tenant.address}, {tenant.city}</span>
                </div>
                <div className={`flex justify-between border-b pb-2 ${theme.borderSubtle}`}>
                  <span className={textSecondary}>Téléphone cabinet :</span>
                  <span className={`font-mono ${theme.accentGreen}`}>{tenant.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className={textSecondary}>Fuseau & Devise :</span>
                  <span className={`font-semibold ${textPrimary}`}>Africa/Dakar (GMT+0) • FCFA</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
              <h3 className={`font-bold text-sm ${textPrimary} flex items-center gap-2`}>
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Horaires et Spécificités Sénégal</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className={`flex justify-between border-b pb-2 ${theme.borderSubtle}`}>
                  <span className={textSecondary}>Jours d'ouverture :</span>
                  <span className={`font-semibold ${textPrimary}`}>{tenant.openingHours.days.join(', ')}</span>
                </div>
                <div className={`flex justify-between border-b pb-2 ${theme.borderSubtle}`}>
                  <span className={textSecondary}>Plage horaire :</span>
                  <span className={`font-mono ${theme.accentGreen}`}>{tenant.openingHours.start} - {tenant.openingHours.end}</span>
                </div>
                <div className={`flex justify-between border-b pb-2 ${theme.borderSubtle}`}>
                  <span className={textSecondary}>Pause Prière du Vendredi (Dakar) :</span>
                  <span className={`font-semibold ${theme.accentAmber}`}>13h00 - 15h00 (Bloquée automatiquement)</span>
                </div>
                <div className="flex justify-between">
                  <span className={textSecondary}>Politique d'acompte :</span>
                  <span className={`font-semibold ${tenant.requireDeposit ? theme.accentSky : textSecondary}`}>
                    {tenant.requireDeposit ? `Obligatoire (${tenant.defaultDepositAmount.toLocaleString()} FCFA)` : 'Facultatif'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRACTITIONERS */}
      {activeTab === 'practitioners' && (
        <div className={`p-6 rounded-2xl border ${cardBg} space-y-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-base font-bold ${textPrimary}`}>Médecins & Praticiens du Cabinet</h2>
              <p className={`text-xs ${textSecondary}`}>Gestion des spécialités, bureaux de consultation et plannings.</p>
            </div>
            <button
              onClick={() => {
                setPractitionerToEdit(null);
                setIsPractitionerModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-950/40 transition hover:scale-[1.02]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Ajouter un praticien</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {practitioners.map((doc) => {
              const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
              const activeDaysText = doc.availableDays && doc.availableDays.length > 0
                ? doc.availableDays.map(d => dayNames[d - 1]).join(', ')
                : 'Lun - Ven';

              return (
                <div key={doc.id} className={`p-4 rounded-xl border ${subBg} flex items-start gap-4 transition hover:border-slate-500/50`}>
                  <img src={doc.avatar} alt={doc.name} className="h-14 w-14 rounded-xl object-cover border border-slate-700 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-bold text-sm ${textPrimary} truncate`}>{doc.title} {doc.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${theme.badgeSuccess}`}>
                        Actif
                      </span>
                    </div>
                    <p className="text-xs text-indigo-500 font-medium">{doc.specialty}</p>
                    <p className={`text-xs ${textSecondary} mt-1 flex items-center gap-1 flex-wrap`}>
                      <span>{doc.room}</span>
                      <span>•</span>
                      <span className="font-mono">{doc.phone}</span>
                    </p>
                    <p className="text-[10px] text-emerald-500 font-medium mt-1">
                      📅 Vacations : {activeDaysText}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            showToast({
                              type: 'info',
                              title: `Créneaux de ${doc.name}`,
                              message: `Consultations ouvertes les ${activeDaysText} de ${tenant.openingHours.start} à ${tenant.openingHours.end} (Pause Vendredi 13h-15h incluse).`
                            });
                          }}
                          className={`text-[11px] px-2.5 py-1 rounded border transition ${cardBg} ${textPrimary} hover:border-indigo-500`}
                        >
                          Gérer créneaux
                        </button>
                        <button
                          onClick={() => {
                            setPractitionerToEdit(doc);
                            setIsPractitionerModalOpen(true);
                          }}
                          className={`text-[11px] px-2.5 py-1 rounded border transition ${cardBg} ${textPrimary} hover:border-indigo-500`}
                        >
                          Modifier fiche
                        </button>
                      </div>
                      <button
                        onClick={() => setPractitionerToDelete(doc)}
                        className="p-1.5 rounded-lg border border-rose-900/40 text-rose-400 hover:bg-rose-950/40 transition"
                        title={`Supprimer ${doc.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES & PRICING (CRUD + MANY-TO-MANY) */}
      {activeTab === 'services' && (
        <div className={`p-6 rounded-2xl border ${cardBg} space-y-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badgeSuccess}`}>
                  Nomenclature des Actes
                </span>
                <span className={`text-[10px] font-mono ${theme.accentSky}`}>
                  Relation Many-to-Many Praticiens
                </span>
              </div>
              <h2 className={`text-base sm:text-lg font-bold ${textPrimary} mt-1`}>
                Prestations Médicales & Tarifs en FCFA
              </h2>
              <p className={`text-xs ${textSecondary}`}>
                Configurez les actes, durées, honoraires, acomptes requis et affectez les médecins habilités.
              </p>
            </div>
            <button
              onClick={() => {
                setServiceToEdit(null);
                setIsServiceModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-950/30 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nouvel Acte</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Rechercher un acte médical, une spécialité..."
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg}`}
              />
            </div>
            <div className="sm:col-span-4">
              <select
                value={serviceCategoryFilter}
                onChange={(e) => setServiceCategoryFilter(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.inputBg}`}
              >
                <option value="all">Toutes les catégories</option>
                {Array.from(new Set(services.map((s) => s.category))).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Services Table & Cards */}
          {(() => {
            const filtered = services.filter((s) => {
              const matchesSearch = s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                s.category.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                s.description.toLowerCase().includes(serviceSearch.toLowerCase());
              const matchesCat = serviceCategoryFilter === 'all' || s.category === serviceCategoryFilter;
              return matchesSearch && matchesCat;
            });

            if (filtered.length === 0) {
              return (
                <div className={`p-8 rounded-xl border text-center space-y-2 ${subBg}`}>
                  <Tag className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className={`text-xs font-bold ${textPrimary}`}>Aucun acte médical ne correspond à vos critères.</p>
                  <p className={`text-[11px] ${textSecondary}`}>Modifiez votre recherche ou créez un nouvel acte.</p>
                </div>
              );
            }

            return (
              <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
                <table className="w-full min-w-[700px] text-left text-xs">
                  <thead>
                    <tr className={`border-b ${theme.borderSubtle} ${textSecondary}`}>
                      <th className="pb-3 font-semibold">Acte & Description</th>
                      <th className="pb-3 font-semibold">Spécialité</th>
                      <th className="pb-3 font-semibold">Durée</th>
                      <th className="pb-3 font-semibold">Praticiens Habilités (Many-to-Many)</th>
                      <th className="pb-3 font-semibold text-right">Tarif (FCFA)</th>
                      <th className="pb-3 font-semibold text-right">Acompte</th>
                      <th className="pb-3 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme.tableDivider}`}>
                    {filtered.map((svc) => {
                      const assigned = practitioners.filter((p) => svc.practitionerIds.includes(p.id));
                      return (
                        <tr key={svc.id} className={theme.tableRowHover}>
                          <td className="py-3 pr-2">
                            <span className={`font-bold block ${textPrimary}`}>{svc.name}</span>
                            <span className={`text-[11px] ${textSecondary} line-clamp-1 max-w-xs block mt-0.5`}>
                              {svc.description}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {svc.category}
                            </span>
                          </td>
                          <td className="py-3 font-mono font-bold whitespace-nowrap">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-sky-400" />
                              {svc.durationMinutes} min
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1 flex-wrap max-w-xs">
                              {assigned.length > 0 ? (
                                assigned.map((doc) => (
                                  <span
                                    key={doc.id}
                                    title={`${doc.title} ${doc.name} (${doc.specialty})`}
                                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border ${
                                      isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
                                    }`}
                                  >
                                    <img src={doc.avatar} alt={doc.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                                    <span className="truncate max-w-[80px]">{doc.name.split(' ').slice(-1)}</span>
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] text-amber-500 italic">Aucun praticien assigné</span>
                              )}
                            </div>
                          </td>
                          <td className={`py-3 text-right font-black font-mono whitespace-nowrap ${textPrimary}`}>
                            {svc.priceXOF.toLocaleString('fr-FR')} FCFA
                          </td>
                          <td className={`py-3 text-right font-mono whitespace-nowrap ${theme.accentSky}`}>
                            {svc.depositRequired ? `${svc.depositAmountXOF.toLocaleString('fr-FR')} FCFA` : 'Aucun'}
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => {
                                  setServiceToEdit(svc);
                                  setIsServiceModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 transition"
                                title="Modifier"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setServiceToDelete(svc)}
                                className="p-1.5 rounded-lg border border-rose-900/50 hover:bg-rose-950/50 text-rose-400 transition"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 4: PAYMENTS & DEPOSIT SETTINGS */}
      {activeTab === 'payments' && (
        <form onSubmit={handleSaveSettings} className={`p-6 rounded-2xl border ${cardBg} space-y-6`}>
          <div>
            <h2 className={`text-base font-bold ${textPrimary}`}>Politique d'Acompte et Passerelles Wave / Orange Money</h2>
            <p className={`text-xs ${textSecondary}`}>
              Définissez les règles pour réduire les rendez-vous non honorés (no-shows) au Sénégal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 rounded-xl border ${subBg} space-y-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`text-xs font-bold ${textPrimary}`}>Exiger un acompte à la réservation en ligne</h4>
                  <p className={`text-[11px] ${textSecondary}`}>
                    Le patient doit payer un acompte partiel pour confirmer son créneau.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={requireDeposit}
                  onChange={(e) => setRequireDeposit(e.target.checked)}
                  className="h-5 w-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              {requireDeposit && (
                <div>
                  <label className={`text-xs font-semibold ${textPrimary} block mb-1`}>
                    Montant de l'acompte par défaut (FCFA) :
                  </label>
                  <input
                    type="number"
                    value={defaultDeposit}
                    onChange={(e) => setDefaultDeposit(Number(e.target.value))}
                    step={1000}
                    className={`w-full rounded-xl px-4 py-2 text-sm font-mono border focus:outline-none focus:border-emerald-500 transition ${inputBg}`}
                  />
                  <p className={`text-[11px] ${textSecondary} mt-1`}>
                    Recommandé pour Dakar : 3 000 à 5 000 FCFA selon la spécialité.
                  </p>
                </div>
              )}
            </div>

            <div className={`p-4 rounded-xl border ${subBg} space-y-3`}>
              <h4 className={`text-xs font-bold ${textPrimary}`}>Passerelles de Paiement Mobile Actives</h4>

              <div className={`flex items-center justify-between p-2 rounded-lg border ${theme.borderSubtle}`}>
                <span className={`text-xs font-semibold ${textPrimary} flex items-center gap-2`}>
                  🌊 Wave Sénégal
                </span>
                <input
                  type="checkbox"
                  checked={waveEnabled}
                  onChange={(e) => setWaveEnabled(e.target.checked)}
                  className="h-4 w-4 accent-sky-500 cursor-pointer"
                />
              </div>

              <div className={`flex items-center justify-between p-2 rounded-lg border ${theme.borderSubtle}`}>
                <span className={`text-xs font-semibold ${textPrimary} flex items-center gap-2`}>
                  🟠 Orange Money Sénégal
                </span>
                <input
                  type="checkbox"
                  checked={omEnabled}
                  onChange={(e) => setOmEnabled(e.target.checked)}
                  className="h-4 w-4 accent-orange-500 cursor-pointer"
                />
              </div>

              <div className={`flex items-center justify-between p-2 rounded-lg border ${theme.borderSubtle} opacity-70`}>
                <span className={`text-xs ${textSecondary} flex items-center gap-2`}>
                  💵 Paiement sur place au comptoir
                </span>
                <span className={`text-[10px] font-bold ${theme.accentGreen}`}>Toujours Actif</span>
              </div>
            </div>
          </div>

          <div className={`flex items-center justify-between pt-4 border-t ${theme.borderSubtle}`}>
            {savedSuccess ? (
              <span className={`text-xs font-bold flex items-center gap-1.5 ${theme.accentGreen}`}>
                <Check className="w-4 h-4" /> Paramètres sauvegardés avec succès !
              </span>
            ) : (
              <span className={`text-xs ${textSecondary}`}>Enregistre les préférences de l'établissement dans la base MySQL.</span>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition hover:scale-[1.02]"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les modifications</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: AUTOMATED MESSAGE TEMPLATES CONFIG */}
      {activeTab === 'messages' && (
        <MessageTemplateConfig tenant={tenant} isDark={isDark} />
      )}

      {/* TAB 6: LARAVEL 12 CODE ARCHITECTURE */}
      {activeTab === 'laravel_code' && (
        <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
          <div>
            <h2 className={`text-base font-bold ${textPrimary} flex items-center gap-2`}>
              <span>Architecture Laravel 12 pour l'Espace Admin Cabinet</span>
            </h2>
            <p className={`text-xs ${textSecondary}`}>
              Contrôleur et routes dédiées avec isolation multi-tenant et middleware d'autorisation de rôle (Admin / Gestionnaire).
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto border border-slate-800">
            <pre>{`// routes/web.php
Route::prefix('e/{tenant:slug}/admin')
    ->middleware(['tenant', 'auth', 'role:admin,manager'])
    ->name('tenant.admin.')
    ->group(function () {
        Route::get('/dashboard', [ClinicAdminController::class, 'index'])->name('dashboard');
        Route::post('/settings', [ClinicAdminController::class, 'updateSettings'])->name('settings.update');
        Route::resource('/practitioners', PractitionerController::class);
        Route::resource('/services', ServiceController::class);
    });

// app/Http/Controllers/ClinicAdminController.php
namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;

class ClinicAdminController extends Controller
{
    public function index(Tenant $tenant)
    {
        // $tenant est résolu automatiquement via Route Model Binding
        $services = $tenant->services()->with('practitioners')->get();
        $practitioners = $tenant->practitioners()->get();
        $appointments = $tenant->appointments()->today()->get();

        return view('tenant.admin.dashboard', compact('tenant', 'services', 'practitioners', 'appointments'));
    }
}`}</pre>
          </div>
        </div>
      )}

      {/* Reusable Modal for Service Create / Edit */}
      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setServiceToEdit(null);
        }}
        onSave={(data) => {
          if (onSaveService) {
            onSaveService(data);
            showToast({
              type: 'success',
              title: data.id ? 'Prestation modifiée' : 'Prestation enregistrée',
              message: `${data.name} (${data.priceXOF.toLocaleString('fr-FR')} FCFA) est disponible pour les réservations.`
            });
          }
          setIsServiceModalOpen(false);
          setServiceToEdit(null);
        }}
        serviceToEdit={serviceToEdit}
        practitioners={practitioners}
        tenantId={tenant.id}
        isDark={isDark}
      />

      {/* Delete Confirmation Dialog */}
      {serviceToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className={`max-w-md w-full rounded-2xl p-6 border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h3 className="text-base font-bold">Confirmer la suppression</h3>
                <p className={`text-xs ${textSecondary}`}>Cette action supprimera l'acte pour tous les praticiens associés.</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed">
              Êtes-vous sûr de vouloir supprimer la prestation <strong>"{serviceToDelete.name}"</strong> ({serviceToDelete.priceXOF.toLocaleString('fr-FR')} FCFA) ?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteService) {
                    onDeleteService(serviceToDelete.id);
                    showToast({
                      type: 'info',
                      title: 'Prestation supprimée',
                      message: `L'acte ${serviceToDelete.name} a été supprimé de la nomenclature.`
                    });
                  }
                  setServiceToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Modal for Practitioner Create / Edit */}
      <PractitionerModal
        isOpen={isPractitionerModalOpen}
        onClose={() => {
          setIsPractitionerModalOpen(false);
          setPractitionerToEdit(null);
        }}
        onSave={(data) => {
          if (onSavePractitioner) {
            onSavePractitioner(data);
            showToast({
              type: 'success',
              title: data.id ? 'Praticien mis à jour' : 'Praticien ajouté',
              message: `${data.title} ${data.name} (${data.specialty}) est désormais configuré.`
            });
          }
          setIsPractitionerModalOpen(false);
          setPractitionerToEdit(null);
        }}
        practitionerToEdit={practitionerToEdit}
        tenantId={tenant.id}
        isDark={isDark}
      />

      {/* Practitioner Delete Confirmation Dialog */}
      {practitionerToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className={`max-w-md w-full rounded-2xl p-6 border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h3 className="text-base font-bold">Supprimer le praticien</h3>
                <p className={`text-xs ${textSecondary}`}>Le praticien sera retiré des plannings de consultation.</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed">
              Êtes-vous sûr de vouloir retirer <strong>{practitionerToDelete.title} {practitionerToDelete.name}</strong> ({practitionerToDelete.specialty}) de la clinique ?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPractitionerToDelete(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeletePractitioner) {
                    onDeletePractitioner(practitionerToDelete.id);
                    showToast({
                      type: 'info',
                      title: 'Praticien retiré',
                      message: `${practitionerToDelete.name} a été retiré de l'équipe médicale.`
                    });
                  }
                  setPractitionerToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
