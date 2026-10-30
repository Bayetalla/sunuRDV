import React, { useState } from 'react';
import { Practitioner, MedicalService, Appointment, AppointmentStatus } from '../../types';
import { 
  Stethoscope, 
  Clock, 
  Calendar, 
  FileText, 
  User, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  Check, 
  Play, 
  Pencil, 
  Search,
  MessageSquare,
  Plus,
  Trash2,
  Tag,
  Users,
  Banknote,
  Sparkles,
  Layers,
  AlertTriangle,
  X,
  Printer,
  Share2,
  Download
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { getThemeTokens } from '../../utils/themeTokens';
import { ServiceModal } from '../services/ServiceModal';

interface DoctorSpaceProps {
  doctor: Practitioner;
  allPractitioners?: Practitioner[];
  appointments: Appointment[];
  services: MedicalService[];
  isDark: boolean;
  onUpdateStatus: (aptId: string, newStatus: AppointmentStatus) => void;
  onSaveService?: (serviceData: Omit<MedicalService, 'id'> & { id?: string }) => void;
  onDeleteService?: (serviceId: string) => void;
  onTogglePractitionerService?: (serviceId: string, practitionerId: string) => void;
}

export const DoctorSpace: React.FC<DoctorSpaceProps> = ({
  doctor,
  allPractitioners = [],
  appointments,
  services,
  isDark,
  onUpdateStatus,
  onSaveService,
  onDeleteService,
  onTogglePractitionerService,
}) => {
  const { showToast } = useToast();
  const theme = getThemeTokens(isDark);

  // Sub-tab: 'consultations' or 'services'
  const [activeTab, setActiveTab] = useState<'consultations' | 'services'>('consultations');

  // Consultation state per-appointment (isolates notes and prescriptions)
  const myAppointments = appointments.filter((a) => a.practitionerId === doctor.id);
  const [selectedAptId, setSelectedAptId] = useState<string>(myAppointments[0]?.id || appointments[0]?.id || '');
  const [prescriptionItem, setPrescriptionItem] = useState<string>('');
  const [noteSaved, setNoteSaved] = useState<boolean>(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState<boolean>(false);

  // Per-appointment records dictionary
  const [consultationRecords, setConsultationRecords] = useState<Record<string, { note: string; prescriptions: string[] }>>({
    'default': {
      note: 'Constantes stables. Examen clinique sans signe d’alerte.',
      prescriptions: [
        'Paracétamol 1g : 1 cp toutes les 8h si fièvre ou douleur',
        'Amoxicilline 500mg : 1 gélule matin et soir pendant 6 jours'
      ]
    }
  });

  // Services CRUD state
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [serviceFilter, setServiceFilter] = useState<'my_services' | 'all'>('my_services');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [serviceToEdit, setServiceToEdit] = useState<MedicalService | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<MedicalService | null>(null);

  const effectivePractitioners = allPractitioners.length > 0 ? allPractitioners : [doctor];
  const currentApt = appointments.find((a) => a.id === selectedAptId) || myAppointments[0];
  const currentService = services.find((s) => s.id === currentApt?.serviceId);

  // Get current active notes and prescriptions for the selected appointment
  const currentRecord = (currentApt && consultationRecords[currentApt.id]) || {
    note: currentApt?.notes ? `Motif initial : ${currentApt.notes}` : '',
    prescriptions: [
      'Paracétamol 1g : 1 cp toutes les 8h en cas de douleur',
      'Repos et hydratation abondante recommandée'
    ]
  };

  const handleUpdateRecordNote = (newNote: string) => {
    if (!currentApt) return;
    setConsultationRecords(prev => ({
      ...prev,
      [currentApt.id]: {
        ...currentRecord,
        note: newNote
      }
    }));
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescriptionItem.trim() || !currentApt) return;
    const updatedPrescriptions = [...currentRecord.prescriptions, prescriptionItem.trim()];
    setConsultationRecords(prev => ({
      ...prev,
      [currentApt.id]: {
        ...currentRecord,
        prescriptions: updatedPrescriptions
      }
    }));
    showToast({
      type: 'info',
      title: 'Médicament prescrit',
      message: `${prescriptionItem.trim()} consigné sur l'ordonnance de ${currentApt.patientName}.`
    });
    setPrescriptionItem('');
  };

  const handleRemoveMedication = (idxToRemove: number) => {
    if (!currentApt) return;
    const updated = currentRecord.prescriptions.filter((_, idx) => idx !== idxToRemove);
    setConsultationRecords(prev => ({
      ...prev,
      [currentApt.id]: {
        ...currentRecord,
        prescriptions: updated
      }
    }));
  };

  const handleSaveMedicalNote = () => {
    setNoteSaved(true);
    showToast({
      type: 'success',
      title: 'Dossier médical sauvegardé',
      message: `Observations de ${currentApt?.patientName} archivées dans le DMP.`
    });
    setTimeout(() => setNoteSaved(false), 2500);
  };

  // Filtered services
  const myServicesCount = services.filter((s) => s.practitionerIds.includes(doctor.id)).length;

  const filteredServices = services.filter((s) => {
    const matchesDoctor = serviceFilter === 'all' || s.practitionerIds.includes(doctor.id);
    const matchesSearch = s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(serviceSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesDoctor && matchesSearch && matchesCategory;
  });

  const uniqueCategories = Array.from(new Set(services.map((s) => s.category)));

  const cardBg = theme.cardBg;
  const subBg = theme.subBg;
  const textPrimary = theme.textPrimary;
  const textSecondary = theme.textSecondary;

  const handleOpenCreateModal = () => {
    setServiceToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: MedicalService) => {
    setServiceToEdit(service);
    setIsModalOpen(true);
  };

  const handleSaveServiceSubmit = (serviceData: Omit<MedicalService, 'id'> & { id?: string }) => {
    if (onSaveService) {
      onSaveService(serviceData);
      showToast({
        type: 'success',
        title: serviceData.id ? 'Prestation mise à jour' : 'Nouvelle prestation créée',
        message: `${serviceData.name} est disponible pour les réservations (Tarif: ${serviceData.priceXOF.toLocaleString('fr-FR')} FCFA).`
      });
    }
    setIsModalOpen(false);
    setServiceToEdit(null);
  };

  const handleConfirmDelete = () => {
    if (serviceToDelete && onDeleteService) {
      onDeleteService(serviceToDelete.id);
      showToast({
        type: 'info',
        title: 'Prestation supprimée',
        message: `L'acte ${serviceToDelete.name} a été retiré de la clinique.`
      });
    }
    setServiceToDelete(null);
  };

  const handleToggleMyService = (service: MedicalService) => {
    if (onTogglePractitionerService) {
      onTogglePractitionerService(service.id, doctor.id);
      const isCurrentlyAssigned = service.practitionerIds.includes(doctor.id);
      showToast({
        type: isCurrentlyAssigned ? 'info' : 'success',
        title: isCurrentlyAssigned ? 'Acte retiré de vos prestations' : 'Acte ajouté à vos prestations',
        message: isCurrentlyAssigned
          ? `Vous n'êtes plus assigné(e) à : ${service.name}`
          : `Les patients peuvent désormais réserver "${service.name}" avec vous.`
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Doctor Header Banner with Sub-Tab Switcher */}
      <div className={`rounded-2xl p-5 sm:p-6 border ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="flex items-center gap-4 min-w-0">
          <img 
            src={doctor.avatar} 
            alt={doctor.name} 
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-cover border-2 border-sky-500/40 shadow-lg shrink-0" 
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badgeInfo}`}>
                Espace Praticien
              </span>
              <span className={`text-[10px] font-mono ${theme.accentGreen}`}>Salle : {doctor.room}</span>
              <span className={`text-[10px] font-mono ${theme.accentSky}`}>{doctor.phone}</span>
            </div>
            <h1 className={`text-lg sm:text-2xl font-black ${textPrimary} mt-1 truncate`}>
              {doctor.title} {doctor.name}
            </h1>
            <p className={`text-xs ${textSecondary} truncate`}>
              {doctor.specialty} • Dakar (GMT+0)
            </p>
          </div>
        </div>

        {/* View Switcher Buttons */}
        <div className={`flex items-center p-1 rounded-xl border ${subBg} text-xs shrink-0 self-start md:self-auto`}>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'consultations'
                ? 'bg-sky-600 text-white shadow'
                : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Consultations ({myAppointments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'services'
                ? 'bg-emerald-600 text-white shadow'
                : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Mes Prestations & Tarifs ({myServicesCount})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CONSULTATIONS & PATIENT FILE */}
      {/* ========================================================================= */}
      {activeTab === 'consultations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Patient List (5 cols) */}
          <div className={`lg:col-span-5 min-w-0 p-4 sm:p-5 rounded-2xl border ${cardBg} space-y-4`}>
            <div className={`flex items-center justify-between border-b pb-3 ${theme.borderSubtle}`}>
              <h2 className={`font-bold text-sm ${textPrimary} flex items-center gap-2`}>
                <Calendar className="w-4 h-4 text-sky-500" />
                <span>File d'attente & Rendez-vous du jour</span>
              </h2>
              <span className={`text-xs font-medium ${theme.accentSky}`}>{myAppointments.length} prévus</span>
            </div>

            <div className="space-y-2.5 max-h-[550px] overflow-y-auto">
              {myAppointments.length > 0 ? (
                myAppointments.map((apt) => {
                  const svc = services.find((s) => s.id === apt.serviceId);
                  const isSelected = apt.id === currentApt?.id;

                  return (
                    <div
                      key={apt.id}
                      onClick={() => setSelectedAptId(apt.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? isDark
                            ? 'bg-sky-950/60 border-sky-500 shadow-md ring-1 ring-sky-500/30'
                            : 'bg-sky-50/90 border-sky-400 shadow-md ring-1 ring-sky-400/30'
                          : `${subBg} hover:border-slate-400/50`
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="text-center font-mono shrink-0">
                          <span className={`text-xs font-black block ${theme.accentSky}`}>{apt.timeSlot}</span>
                          <span className={`text-[10px] ${textSecondary}`}>GMT</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className={`text-xs font-bold ${textPrimary} truncate`}>{apt.patientName}</h3>
                          <p className={`text-[11px] ${textSecondary} truncate`}>{svc?.name}</p>
                          <span className={`text-[10px] font-mono ${theme.accentGreen}`}>{apt.patientPhone}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          apt.status === 'in_progress'
                            ? theme.badgeInfo
                            : apt.status === 'arrived'
                              ? theme.badgeWarning
                              : apt.status === 'completed'
                                ? theme.badgeSuccess
                                : theme.badgeNeutral
                        }`}>
                          {apt.status === 'in_progress' ? 'En cours' : apt.status === 'arrived' ? 'En salle' : apt.status === 'completed' ? 'Fini' : 'Confirmé'}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={`p-8 text-center text-xs ${textSecondary} space-y-2`}>
                  <p>Aucun rendez-vous planifié aujourd'hui pour ce praticien.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Active Consultation Sheet (7 cols) */}
          {currentApt ? (
            <div className={`lg:col-span-7 min-w-0 p-4 sm:p-6 rounded-2xl border ${cardBg} space-y-6`}>
              {/* Header of Active Patient */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${theme.borderSubtle}`}>
                <div>
                  <span className={`text-[10px] uppercase font-bold ${theme.accentSky}`}>Dossier de consultation actif</span>
                  <h3 className={`text-lg font-black ${textPrimary} mt-0.5`}>
                    {currentApt.patientName}
                  </h3>
                  <div className={`text-xs ${textSecondary} flex flex-wrap items-center gap-2 sm:gap-3 mt-1`}>
                    <span className="flex items-center gap-1">
                      <Phone className={`w-3 h-3 ${theme.accentGreen}`} /> {currentApt.patientPhone}
                    </span>
                    <span>•</span>
                    <span>Réf : {currentApt.reference}</span>
                    <span>•</span>
                    <span className={theme.accentSky}>{currentService?.name}</span>
                  </div>
                </div>

                {/* Quick Status Progression */}
                <div className="flex items-center gap-2">
                  {currentApt.status !== 'in_progress' && currentApt.status !== 'completed' && (
                    <button
                      onClick={() => onUpdateStatus(currentApt.id, 'in_progress')}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Faire entrer</span>
                    </button>
                  )}
                  {currentApt.status === 'in_progress' && (
                    <button
                      onClick={() => onUpdateStatus(currentApt.id, 'completed')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Terminer la consultation</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Consultation Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${subBg}`}>
                  <span className={textSecondary}>Créneau réservé</span>
                  <p className={`font-mono font-bold ${textPrimary} mt-0.5`}>{currentApt.timeSlot} ({currentService?.durationMinutes || 30} min)</p>
                </div>
                <div className={`p-3 rounded-xl border ${subBg}`}>
                  <span className={textSecondary}>Honoraires acte</span>
                  <p className={`font-mono font-bold ${theme.accentGreen} mt-0.5`}>{currentApt.amountXOF.toLocaleString('fr-FR')} FCFA</p>
                </div>
                <div className={`p-3 rounded-xl border ${subBg}`}>
                  <span className={textSecondary}>Paiement Acompte</span>
                  <p className={`font-bold mt-0.5 ${currentApt.depositPaidXOF > 0 ? theme.accentGreen : theme.accentAmber}`}>
                    {currentApt.depositPaidXOF > 0 ? `${currentApt.depositPaidXOF.toLocaleString('fr-FR')} FCFA (${currentApt.paymentMethod.toUpperCase()})` : 'Sur place au guichet'}
                  </p>
                </div>
              </div>

              {/* Clinical Notes Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold ${textPrimary} flex items-center gap-1.5`}>
                    <FileText className="w-4 h-4 text-sky-500" />
                    <span>Observations Cliniques & Diagnostic</span>
                  </label>
                  {noteSaved && (
                    <span className={`text-[11px] font-bold ${theme.accentGreen} flex items-center gap-1`}>
                      <Check className="w-3 h-3" /> Enregistré
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={currentRecord.note}
                  onChange={(e) => handleUpdateRecordNote(e.target.value)}
                  placeholder="Antécédents, constantes (TA, pouls, glycémie), symptômes rapportés et diagnostic retenu..."
                  className={`w-full p-3 rounded-xl text-xs border transition focus:outline-none focus:ring-2 focus:ring-sky-500 ${theme.inputBg}`}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveMedicalNote}
                    className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                  >
                    <span>Consigner au dossier patient</span>
                  </button>
                </div>
              </div>

              {/* Prescription Generator */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-bold ${textPrimary} flex items-center gap-1.5`}>
                    <Pencil className="w-4 h-4 text-emerald-500" />
                    <span>Prescription / Ordonnance numérique ({currentRecord.prescriptions.length} lignes)</span>
                  </h4>
                  {currentRecord.prescriptions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPrescriptionModal(true)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimer l'Ordonnance Officielle</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleAddMedication} className="flex gap-2">
                  <input
                    type="text"
                    value={prescriptionItem}
                    onChange={(e) => setPrescriptionItem(e.target.value)}
                    placeholder="ex: Ciprofloxacine 500mg : 1 cp matin et soir pendant 5 jours..."
                    className={`flex-1 p-2.5 rounded-xl text-xs border transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${theme.inputBg}`}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 transition"
                  >
                    Ajouter
                  </button>
                </form>

                <div className="space-y-1.5 max-h-44 overflow-y-auto">
                  {currentRecord.prescriptions.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${subBg}`}
                    >
                      <span className={textPrimary}>• {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(idx)}
                        className="text-rose-500 hover:text-rose-400 p-1"
                        aria-label="Supprimer médicament"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={`lg:col-span-7 p-12 rounded-2xl border ${cardBg} text-center space-y-3`}>
              <Stethoscope className="w-12 h-12 text-sky-500 mx-auto opacity-50" />
              <p className={`text-sm font-semibold ${textPrimary}`}>Sélectionnez un patient dans la file pour ouvrir son dossier.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SERVICES & TARIFFS MANAGEMENT (CRUD & MANY-TO-MANY) */}
      {/* ========================================================================= */}
      {activeTab === 'services' && (
        <div className={`p-5 sm:p-6 rounded-2xl border ${cardBg} space-y-6`}>
          {/* Top Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badgeSuccess}`}>
                  Catalogue des Actes
                </span>
                <span className={`text-[10px] font-mono ${theme.accentSky}`}>
                  Relation Praticiens ↔ Services (Many-to-Many)
                </span>
              </div>
              <h2 className={`text-lg sm:text-xl font-black ${textPrimary} mt-1`}>
                Gestion des Prestations & Tarifs
              </h2>
              <p className={`text-xs ${textSecondary}`}>
                Chaque acte comprend son nom, sa description, sa durée en minutes, son tarif en FCFA, et les praticiens habilités.
              </p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Proposer un nouvel acte</span>
            </button>
          </div>

          {/* Search, Filter Tabs & Category Filter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Rechercher par acte, mot-clé ou description..."
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs border transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${theme.inputBg}`}
              />
            </div>

            {/* Scope Toggle: My Services vs All Clinic Services */}
            <div className={`md:col-span-4 flex items-center p-1 rounded-xl border ${subBg} text-xs`}>
              <button
                type="button"
                onClick={() => setServiceFilter('my_services')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition text-center ${
                  serviceFilter === 'my_services'
                    ? 'bg-emerald-600 text-white shadow'
                    : `${textSecondary} hover:${textPrimary}`
                }`}
              >
                Mes Prestations ({myServicesCount})
              </button>
              <button
                type="button"
                onClick={() => setServiceFilter('all')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition text-center ${
                  serviceFilter === 'all'
                    ? 'bg-emerald-600 text-white shadow'
                    : `${textSecondary} hover:${textPrimary}`
                }`}
              >
                Tout le Cabinet ({services.length})
              </button>
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs border transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${theme.inputBg}`}
              >
                <option value="all">Toutes les spécialités</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Services List / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => {
                const isOfferedByMe = service.practitionerIds.includes(doctor.id);
                const assignedPractitioners = effectivePractitioners.filter((p) =>
                  service.practitionerIds.includes(p.id)
                );

                return (
                  <div
                    key={service.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition space-y-3 flex flex-col justify-between ${
                      isOfferedByMe
                        ? isDark
                          ? 'bg-slate-900/90 border-slate-700/80 shadow-md'
                          : 'bg-white border-slate-200 shadow-sm'
                        : isDark
                          ? 'bg-slate-950/40 border-slate-800/80 opacity-80'
                          : 'bg-slate-50 border-slate-200 opacity-90'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badgeInfo}`}>
                          {service.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-sky-400" />
                            <strong>{service.durationMinutes} min</strong>
                          </span>
                        </div>
                      </div>

                      {/* Service Name & Description */}
                      <h3 className={`font-black text-sm sm:text-base ${textPrimary}`}>
                        {service.name}
                      </h3>
                      <p className={`text-xs ${textSecondary} mt-1 line-clamp-2 leading-relaxed`}>
                        {service.description || 'Consultation clinique avec examen approfondi et conseils adaptés.'}
                      </p>

                      {/* Pricing Tag in FCFA */}
                      <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between ${subBg}`}>
                        <div>
                          <span className={`text-[10px] uppercase font-bold block ${textSecondary}`}>
                            Tarif Consultation
                          </span>
                          <span className={`text-base font-black font-mono ${theme.accentGreen}`}>
                            {service.priceXOF.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] uppercase font-bold block ${textSecondary}`}>
                            Acompte Wave/OM
                          </span>
                          <span className={`text-xs font-mono font-bold ${service.depositRequired ? theme.accentSky : textSecondary}`}>
                            {service.depositRequired ? `${service.depositAmountXOF.toLocaleString('fr-FR')} FCFA` : 'Facultatif'}
                          </span>
                        </div>
                      </div>

                      {/* Many-to-Many Assigned Practitioners */}
                      <div className="mt-3 pt-3 border-t border-slate-800/40">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[11px] font-bold ${textSecondary} flex items-center gap-1`}>
                            <Users className="w-3.5 h-3.5 text-sky-400" />
                            <span>Praticiens habilités ({assignedPractitioners.length})</span>
                          </span>
                          {isOfferedByMe ? (
                            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                              <Check className="w-3 h-3 stroke-[3]" /> Actif dans mon offre
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">Non proposé par moi</span>
                          )}
                        </div>

                        {/* Avatars of assigned practitioners */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {assignedPractitioners.map((prat) => (
                            <div
                              key={prat.id}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] border ${
                                prat.id === doctor.id
                                  ? isDark ? 'bg-sky-950/80 border-sky-500 text-sky-200' : 'bg-sky-100 border-sky-400 text-sky-800'
                                  : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-200 border-slate-300 text-slate-700'
                              }`}
                            >
                              <img src={prat.avatar} alt={prat.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                              <span className="font-semibold truncate max-w-[110px]">{prat.title} {prat.name.split(' ').slice(-1)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleMyService(service)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          isOfferedByMe
                            ? isDark
                              ? 'bg-rose-950/40 text-rose-300 border border-rose-800/60 hover:bg-rose-900/60'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            : isDark
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900/80'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {isOfferedByMe ? (
                          <>
                            <X className="w-3.5 h-3.5" />
                            <span>Retirer de mon offre</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Ajouter à mon offre</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(service)}
                          className={`p-2 rounded-xl border transition ${
                            isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                          }`}
                          aria-label={`Modifier ${service.name}`}
                          title="Modifier les détails de la prestation"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setServiceToDelete(service)}
                          className={`p-2 rounded-xl border transition ${
                            isDark ? 'border-rose-900/50 hover:bg-rose-950/50 text-rose-400' : 'border-rose-200 hover:bg-rose-50 text-rose-600'
                          }`}
                          aria-label={`Supprimer ${service.name}`}
                          title="Supprimer la prestation de la clinique"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`col-span-full p-10 rounded-2xl border text-center space-y-3 ${subBg}`}>
                <Tag className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className={`text-sm font-bold ${textPrimary}`}>Aucun acte correspondant trouvé</h3>
                <p className={`text-xs ${textSecondary}`}>
                  {serviceSearch || categoryFilter !== 'all' 
                    ? 'Essayez de modifier votre recherche ou filtre.' 
                    : 'Vous pouvez commencer par créer votre premier acte médical ci-dessus.'}
                </p>
                <button
                  onClick={handleOpenCreateModal}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Créer une prestation</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reusable Modal for Service Create / Edit */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setServiceToEdit(null);
        }}
        onSave={handleSaveServiceSubmit}
        serviceToEdit={serviceToEdit}
        practitioners={effectivePractitioners}
        tenantId={doctor.tenantId}
        isDark={isDark}
        preselectedPractitionerId={doctor.id}
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
                <p className={`text-xs ${textSecondary}`}>Cette action est irréversible en base de données.</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed">
              Êtes-vous sûr de vouloir supprimer la prestation <strong>"{serviceToDelete.name}"</strong> ({serviceToDelete.priceXOF.toLocaleString('fr-FR')} FCFA) ? Les patients ne pourront plus réserver cet acte en ligne.
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
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer définitivement</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Printable Prescription Modal */}
      {showPrescriptionModal && currentApt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white text-slate-900 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 my-auto">
            {/* Header with clinic & doctor credentials */}
            <div className="border-b-2 border-emerald-600 pb-4 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  RÉPUBLIQUE DU SÉNÉGAL • ORDRE NATIONAL DES MÉDECINS
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {doctor.title} {doctor.name}
                </h2>
                <p className="text-xs font-semibold text-emerald-800">{doctor.specialty}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Cabinet médical • Salle : {doctor.room} • Tél : {doctor.phone}
                </p>
              </div>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition print:hidden"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient & Date Meta */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between text-xs gap-2">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Patient(e) :</span>
                <span className="font-bold text-slate-900 text-sm">{currentApt.patientName}</span>
                <span className="text-slate-600 font-mono block text-[11px]">{currentApt.patientPhone}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Date de consultation :</span>
                <span className="font-bold text-slate-900">{currentApt.date}</span>
                <span className="text-slate-500 block text-[11px]">Dakar (GMT+0) • Réf: {currentApt.reference}</span>
              </div>
            </div>

            {/* Prescription Body (Rx) */}
            <div className="space-y-3 min-h-[140px]">
              <div className="flex items-center gap-2 text-emerald-800 font-serif font-black text-xl italic border-b pb-1">
                <span>℞ Ordonnance Médicale</span>
              </div>
              <div className="space-y-3 pl-2">
                {currentRecord.prescriptions.map((med, index) => (
                  <div key={index} className="text-xs text-slate-800">
                    <p className="font-bold text-slate-900">{index + 1}. {med}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Signature & Stamp */}
            <div className="border-t pt-4 flex items-end justify-between">
              <div className="text-[10px] text-slate-400">
                <p>Ordonnance délivrée en bonne et due forme.</p>
                <p>Valable dans toutes les pharmacies du Sénégal.</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-16 border border-dashed border-emerald-600/40 rounded-xl flex flex-col items-center justify-center p-1 bg-emerald-50/50">
                  <span className="text-[9px] font-bold text-emerald-800 uppercase">Cachet & Signature</span>
                  <span className="text-[10px] font-serif italic text-emerald-900 mt-1">{doctor.name}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t flex flex-wrap items-center justify-end gap-2.5 print:hidden">
              <button
                type="button"
                onClick={() => {
                  showToast({
                    type: 'whatsapp',
                    title: 'Ordonnance transmise sur WhatsApp',
                    message: `L'ordonnance officielle a été envoyée au patient (${currentApt.patientPhone}).`
                  });
                }}
                className="px-3.5 py-2 rounded-xl border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Envoyer par WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  showToast({
                    type: 'success',
                    title: 'Impression lancée',
                    message: `Ordonnance de ${currentApt.patientName} envoyée vers l'imprimante.`
                  });
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer l'ordonnance</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
