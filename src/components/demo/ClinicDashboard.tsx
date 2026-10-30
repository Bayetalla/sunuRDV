import React, { useState, useMemo, useEffect } from 'react';
import { Tenant, Practitioner, MedicalService, Appointment, AppointmentStatus, Holiday } from '../../types';
import { 
  Calendar, 
  Clock, 
  Users, 
  PhoneCall, 
  CheckCircle, 
  AlertCircle, 
  UserCheck, 
  DollarSign, 
  Plus, 
  MessageSquare, 
  Send,
  CalendarCheck,
  Search,
  Filter,
  Check,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Phone,
  ShieldCheck,
  ArrowUpRight,
  Bell,
  X,
  Radio,
  CheckCircle2,
  CalendarCheck2
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { getThemeTokens } from '../../utils/themeTokens';

interface ClinicDashboardProps {
  tenant: Tenant;
  practitioners: Practitioner[];
  services: MedicalService[];
  appointments: Appointment[];
  holidays: Holiday[];
  onUpdateStatus: (aptId: string, newStatus: AppointmentStatus) => void;
  onAddQuickAppointment: (apt: Appointment) => void;
  isDark?: boolean;
}

export interface RealtimeAptNotification {
  id: string;
  appointment: Appointment;
  practitionerName: string;
  serviceName: string;
  timestamp: string;
}

export const ClinicDashboard: React.FC<ClinicDashboardProps> = ({
  tenant,
  practitioners,
  services,
  appointments,
  holidays,
  onUpdateStatus,
  onAddQuickAppointment,
  isDark = true,
}) => {
  const { showToast } = useToast();
  const theme = getThemeTokens(isDark);
  const [activeSubTab, setActiveSubTab] = useState<'agenda' | 'receptionist' | 'queue' | 'notifications' | 'holidays'>('agenda');

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');

  // Real-time appointment notification toast state inside ClinicDashboard
  const [activeRealtimeAlert, setActiveRealtimeAlert] = useState<RealtimeAptNotification | null>(null);
  const [alertProgress, setAlertProgress] = useState<number>(100);

  // Quick Receptionist Modal / Form State
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('77 450 12 34');
  const [selectedDocId, setSelectedDocId] = useState(practitioners[0]?.id || '');
  const [selectedSvcId, setSelectedSvcId] = useState(services[0]?.id || '');
  const [selectedSlot, setSelectedSlot] = useState('11:00');
  const [source, setSource] = useState<'receptionist_phone' | 'receptionist_walkin'>('receptionist_phone');
  const [notes, setNotes] = useState('');

  // WhatsApp language selector
  const [whatsappLang, setWhatsappLang] = useState<'fr' | 'wo'>('fr');

  // Theme styling tokens
  const cardBg = theme.cardBg;
  const subBg = theme.subBg;
  const textPrimary = theme.textPrimary;
  const textSecondary = theme.textSecondary;
  const inputBg = theme.inputBg;

  // Real-time notification timer progress bar & auto dismiss
  useEffect(() => {
    if (!activeRealtimeAlert) return;

    setAlertProgress(100);
    const startTime = Date.now();
    const duration = 8000; // 8 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / duration) * 100);
      setAlertProgress(remainingPct);

      if (remainingPct <= 0) {
        clearInterval(interval);
        setActiveRealtimeAlert(null);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeRealtimeAlert]);

  // Financial calculations
  const totalAmountToday = appointments.reduce((sum, a) => sum + a.amountXOF, 0);
  const totalDepositsToday = appointments.reduce((sum, a) => sum + a.depositPaidXOF, 0);
  const arrivedCount = appointments.filter((a) => ['arrived', 'in_progress', 'completed'].includes(a.status)).length;
  const presenceRate = appointments.length > 0 ? Math.round((arrivedCount / appointments.length) * 100) : 0;
  const inQueueCount = appointments.filter((a) => a.status === 'arrived').length;

  // Filtered appointments with enhanced Senegal phone & multi-field matching
  const filteredAppointments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const queryDigits = searchQuery.replace(/\D/g, '');

    return appointments.filter((apt) => {
      let matchesSearch = true;
      if (query) {
        const nameMatch = apt.patientName.toLowerCase().includes(query);
        const refMatch = apt.reference.toLowerCase().includes(query);
        const rawPhoneMatch = apt.patientPhone.toLowerCase().includes(query);
        const phoneDigits = apt.patientPhone.replace(/\D/g, '');
        const digitsMatch = queryDigits.length >= 2 && phoneDigits.includes(queryDigits);
        
        const doc = practitioners.find((p) => p.id === apt.practitionerId);
        const docMatch = doc ? (doc.name.toLowerCase().includes(query) || doc.specialty.toLowerCase().includes(query)) : false;
        const svc = services.find((s) => s.id === apt.serviceId);
        const svcMatch = svc ? svc.name.toLowerCase().includes(query) : false;

        matchesSearch = nameMatch || refMatch || rawPhoneMatch || digitsMatch || docMatch || svcMatch;
      }
      
      const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchQuery, statusFilter, practitioners, services]);

  const totalMatchesForQuery = useMemo(() => {
    if (!searchQuery.trim()) return appointments.length;
    const query = searchQuery.trim().toLowerCase();
    const queryDigits = searchQuery.replace(/\D/g, '');
    return appointments.filter((apt) => {
      const nameMatch = apt.patientName.toLowerCase().includes(query);
      const refMatch = apt.reference.toLowerCase().includes(query);
      const rawPhoneMatch = apt.patientPhone.toLowerCase().includes(query);
      const phoneDigits = apt.patientPhone.replace(/\D/g, '');
      const digitsMatch = queryDigits.length >= 2 && phoneDigits.includes(queryDigits);
      const doc = practitioners.find((p) => p.id === apt.practitionerId);
      const docMatch = doc ? (doc.name.toLowerCase().includes(query) || doc.specialty.toLowerCase().includes(query)) : false;
      const svc = services.find((s) => s.id === apt.serviceId);
      const svcMatch = svc ? svc.name.toLowerCase().includes(query) : false;
      return nameMatch || refMatch || rawPhoneMatch || digitsMatch || docMatch || svcMatch;
    }).length;
  }, [appointments, searchQuery, practitioners, services]);

  // Trigger realtime confirmation notification inside ClinicDashboard
  const triggerRealtimeConfirmation = (apt: Appointment) => {
    const doc = practitioners.find((p) => p.id === apt.practitionerId) || practitioners[0];
    const svc = services.find((s) => s.id === apt.serviceId) || services[0];

    const notificationData: RealtimeAptNotification = {
      id: `alert-${Date.now()}`,
      appointment: apt,
      practitionerName: `${doc.title} ${doc.name}`,
      serviceName: svc.name,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setActiveRealtimeAlert(notificationData);

    // Also trigger global toast notification
    showToast({
      type: 'appointment',
      title: 'Nouveau Rendez-vous Confirmé ! 🇸🇳',
      message: `${apt.patientName} • ${apt.timeSlot} avec ${doc.title} ${doc.name}. Acompte : ${apt.depositPaidXOF.toLocaleString('fr-FR')} FCFA (${apt.paymentMethod.toUpperCase()}).`,
      duration: 6000,
      action: {
        label: 'Voir dans l\'agenda',
        onClick: () => {
          setActiveSubTab('agenda');
          setSearchQuery(apt.patientName);
        }
      }
    });
  };

  // Simulate online incoming appointment from patient portal
  const handleSimulateIncomingBooking = () => {
    const demoNames = [
      'Aminata Ndiaye',
      'Mamadou Lamine Sow',
      'Fatou Bintou Diop',
      'Cheikh Oumar Ba',
      'Aïssatou Sylla',
      'Ibrahima Sarr'
    ];
    const randomName = demoNames[Math.floor(Math.random() * demoNames.length)];
    const randomDoc = practitioners[Math.floor(Math.random() * practitioners.length)] || practitioners[0];
    const randomSvc = services[Math.floor(Math.random() * services.length)] || services[0];
    const slots = ['10:00', '11:30', '14:00', '15:30', '16:45'];
    const randomSlot = slots[Math.floor(Math.random() * slots.length)];
    const randomPhone = `77 ${Math.floor(100 + Math.random() * 899)} ${Math.floor(10 + Math.random() * 89)} ${Math.floor(10 + Math.random() * 89)}`;

    const newApt: Appointment = {
      id: `apt-online-${Date.now()}`,
      reference: `SN-RDV-${Math.floor(1000 + Math.random() * 9000)}`,
      tenantId: tenant.id,
      practitionerId: randomDoc.id,
      serviceId: randomSvc.id,
      patientName: randomName,
      patientPhone: `+221 ${randomPhone}`,
      date: '2026-09-30',
      timeSlot: randomSlot,
      status: 'confirmed',
      paymentMethod: 'wave',
      paymentStatus: 'deposit_paid',
      amountXOF: randomSvc.priceXOF,
      depositPaidXOF: randomSvc.depositAmountXOF || 5000,
      source: 'online',
      notes: 'Réservation en ligne validée par Wave Sénégal (+221)',
      reminderSent: true,
      createdAt: '2026-09-30 ' + randomSlot,
    };

    onAddQuickAppointment(newApt);
    triggerRealtimeConfirmation(newApt);
  };

  const handleCreateQuickAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const svc = services.find((s) => s.id === selectedSvcId) || services[0];
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      reference: `SN-REC-${Math.floor(1000 + Math.random() * 9000)}`,
      tenantId: tenant.id,
      practitionerId: selectedDocId,
      serviceId: selectedSvcId,
      patientName: patientName.trim(),
      patientPhone: patientPhone.startsWith('+221') ? patientPhone : `+221 ${patientPhone}`,
      date: '2026-09-30',
      timeSlot: selectedSlot,
      status: 'confirmed',
      paymentMethod: 'on_site',
      paymentStatus: 'pending',
      amountXOF: svc.priceXOF,
      depositPaidXOF: 0,
      source,
      notes,
      reminderSent: true,
      createdAt: '2026-09-30 09:30',
    };

    onAddQuickAppointment(newApt);
    triggerRealtimeConfirmation(newApt);

    setPatientName('');
    setNotes('');
    setActiveSubTab('agenda');
  };

  const triggerManualWhatsAppReminder = (apt: Appointment) => {
    showToast({
      type: 'whatsapp',
      title: 'Rappel WhatsApp 🇸🇳 envoyé',
      message: `Message transmis à ${apt.patientName} (${apt.patientPhone}). Taux de lecture estimé à 98%.`
    });
  };

  const handleAdvanceStatus = (aptId: string, currentStatus: AppointmentStatus) => {
    let nextStatus: AppointmentStatus = 'arrived';
    let label = '';
    if (currentStatus === 'confirmed') {
      nextStatus = 'arrived';
      label = "Arrivé en salle d'attente";
    } else if (currentStatus === 'arrived') {
      nextStatus = 'in_progress';
      label = 'Appelé en consultation';
    } else if (currentStatus === 'in_progress') {
      nextStatus = 'completed';
      label = 'Consultation finalisée';
    }

    onUpdateStatus(aptId, nextStatus);
    showToast({
      type: 'info',
      title: 'Statut patient mis à jour',
      message: `Le patient est désormais : ${label}`
    });
  };

  // High contrast & fluid badge component compatible with Dark and Light mode
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'arrived':
        return (
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${theme.badgeWarning}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Salle d'attente
          </span>
        );
      case 'in_progress':
        return (
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${theme.badgeInfo}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            En consultation
          </span>
        );
      case 'completed':
        return (
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${theme.badgeSuccess}`}>
            <Check className="w-3 h-3" />
            Terminé
          </span>
        );
      case 'confirmed':
        return (
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${theme.badgeSuccess}`}>
            <CheckCircle2 className="w-3 h-3" />
            Confirmé
          </span>
        );
      case 'no_show':
        return (
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${theme.badgeRose}`}>
            <AlertCircle className="w-3 h-3" />
            Absent (No-show)
          </span>
        );
      default:
        return (
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${theme.badgeNeutral}`}>
            En attente
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* ============================================================== */}
      {/* REAL-TIME TOAST NOTIFICATION COMPONENT IN CLINIC DASHBOARD     */}
      {/* ============================================================== */}
      {activeRealtimeAlert && (
        <div 
          role="alert"
          aria-live="assertive"
          className="rounded-2xl p-4 sm:p-5 border shadow-2xl relative overflow-hidden transition-all duration-300 animate-slideUp bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-900/80 text-white border-emerald-500/80 ring-2 ring-emerald-500/40"
        >
          {/* Progress bar countdown */}
          <div 
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-100 ease-linear"
            style={{ width: `${alertProgress}%` }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 shrink-0 animate-bounce">
                <Bell className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-400 text-slate-950 tracking-wider">
                    🇸🇳 Confirmation en temps réel
                  </span>
                  <span className="text-xs font-mono text-emerald-300">
                    Réf : {activeRealtimeAlert.appointment.reference}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    • Reçu à {activeRealtimeAlert.timestamp}
                  </span>
                </div>

                <div className="text-sm sm:text-base font-extrabold text-white flex flex-wrap items-center gap-2">
                  <span>{activeRealtimeAlert.appointment.patientName}</span>
                  <span className="text-emerald-400 font-mono text-xs">({activeRealtimeAlert.appointment.patientPhone})</span>
                  <span className="text-slate-400 font-normal text-xs">•</span>
                  <span className="text-emerald-300 font-mono text-xs">Heure : {activeRealtimeAlert.appointment.timeSlot}</span>
                </div>

                <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2">
                  <span>Acte : <strong>{activeRealtimeAlert.serviceName}</strong></span>
                  <span>•</span>
                  <span>Praticien : <strong>{activeRealtimeAlert.practitionerName}</strong></span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">
                    {activeRealtimeAlert.appointment.depositPaidXOF > 0 
                      ? `Acompte Wave validé : ${activeRealtimeAlert.appointment.depositPaidXOF.toLocaleString('fr-FR')} FCFA` 
                      : 'Règlement au comptoir'}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Actions inside Real-time Toast */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => {
                  triggerManualWhatsAppReminder(activeRealtimeAlert.appointment);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  setActiveSubTab('agenda');
                  setSearchQuery(activeRealtimeAlert.appointment.patientName);
                  setActiveRealtimeAlert(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition"
              >
                Voir Agenda
              </button>

              <button
                onClick={() => setActiveRealtimeAlert(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Fermer la notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Clinic Context Header */}
      <div className={`rounded-2xl p-6 border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${cardBg}`}>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shrink-0">
            {tenant.logo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badgeWarning}`}>
                Espace Réception & Guichet
              </span>
              <span className={`text-[10px] font-mono ${theme.accentGreen}`}>Dakar (GMT+0) • FCFA</span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-black ${textPrimary} mt-1`}>
              {tenant.name}
            </h1>
            <p className={`text-xs ${textSecondary}`}>
              Gestion des flux physiques & téléphoniques +221, file d'attente et relances WhatsApp
            </p>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className={`flex items-center p-1.5 rounded-xl border text-xs gap-1 overflow-x-auto no-scrollbar w-full md:w-auto -mx-1 px-1 sm:mx-0 sm:px-0 ${subBg}`}>
          <button
            onClick={() => setActiveSubTab('agenda')}
            className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'agenda' 
                ? 'bg-amber-600 text-white font-bold shadow-sm' 
                : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Agenda ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('receptionist')}
            className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'receptionist' 
                ? 'bg-amber-600 text-white font-bold shadow-sm' 
                : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Guichet & Appel</span>
          </button>

          <button
            onClick={() => setActiveSubTab('queue')}
            className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'queue' 
                ? 'bg-sky-600 text-white font-bold shadow-sm' 
                : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Salle d'attente ({inQueueCount})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'notifications' 
                ? 'bg-emerald-600 text-white font-bold shadow-sm' 
                : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp / SMS</span>
          </button>

          <button
            onClick={() => setActiveSubTab('holidays')}
            className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'holidays' 
                ? 'bg-purple-600 text-white font-bold shadow-sm' 
                : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Fêtes & Jours fériés</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BARRE DE RECHERCHE GLOBALE RÉCEPTIONNISTE (NOM & TÉLÉPHONE)    */}
      {/* ============================================================== */}
      <section 
        aria-label="Barre de recherche globale de patients"
        className={`rounded-2xl p-4 sm:p-5 border shadow-lg transition-all duration-200 ${cardBg} ${
          searchQuery.trim() ? 'ring-2 ring-amber-500/50' : ''
        }`}
      >
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Search className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-sm sm:text-base font-bold ${textPrimary}`}>
                    Recherche Globale de Patients
                  </h2>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    searchQuery.trim() 
                      ? 'bg-amber-500 text-white' 
                      : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {searchQuery.trim() ? `${filteredAppointments.length} résultat(s)` : `${appointments.length} patients`}
                  </span>
                </div>
                <p className={`text-[11px] ${textSecondary}`}>
                  Filtrage instantané par nom, prénom, numéro de téléphone (+221, 77, 78, 76...) ou référence RDV.
                </p>
              </div>
            </div>

            {/* Quick status filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              {(['all', 'confirmed', 'arrived', 'in_progress', 'completed'] as const).map((st) => (
                <button
                  key={`global-filter-${st}`}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                    statusFilter === st
                      ? 'bg-amber-600 text-white shadow-xs'
                      : `${subBg} ${textSecondary} hover:${textPrimary}`
                  }`}
                >
                  {st === 'all' && 'Tous statuts'}
                  {st === 'confirmed' && 'Confirmés'}
                  {st === 'arrived' && "Salle d'attente"}
                  {st === 'in_progress' && 'En consultation'}
                  {st === 'completed' && 'Terminés'}
                </button>
              ))}
            </div>
          </div>

          {/* Large search input with live clear & quick suggestions */}
          <div className="relative flex items-center">
            <Search className={`w-5 h-5 absolute left-3.5 ${searchQuery.trim() ? 'text-amber-500' : textSecondary} transition-colors pointer-events-none`} />
            <input
              type="text"
              aria-label="Rechercher un patient par nom ou numéro de téléphone"
              placeholder="Tapez un nom (ex: Aminata, Mamadou...) ou un numéro (ex: 77 450, 78..., 76...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl pl-11 pr-24 py-3 text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-amber-500 transition shadow-inner ${inputBg}`}
            />
            
            <div className="absolute right-2.5 flex items-center gap-1.5">
              {searchQuery.trim() ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold transition flex items-center gap-1 shadow-xs"
                  title="Effacer la recherche"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Effacer</span>
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 px-2 py-1 rounded border border-slate-700/30">
                  <span>Recherche en direct</span>
                </div>
              )}
            </div>
          </div>

          {/* Immediate Live Results Tray when user is searching */}
          {searchQuery.trim().length > 0 && (
            <div className={`mt-1 p-4 rounded-xl border ${subBg} space-y-3 animate-fadeIn`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2 border-slate-700/20">
                <span className={`text-xs font-bold ${textPrimary} flex items-center gap-2`}>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Résultats instantanés pour « {searchQuery} » ({filteredAppointments.length})</span>
                </span>
                {statusFilter !== 'all' && totalMatchesForQuery > filteredAppointments.length && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className="text-xs text-amber-500 hover:underline font-semibold"
                  >
                    Afficher aussi {totalMatchesForQuery - filteredAppointments.length} résultat(s) sous d'autres statuts
                  </button>
                )}
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="p-6 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${textPrimary}`}>
                      Aucun patient trouvé pour « <span className="text-amber-500">{searchQuery}</span> »
                    </p>
                    <p className={`text-[11px] mt-0.5 ${textSecondary}`}>
                      Vérifiez l'orthographe du nom ou le numéro de téléphone saisi (+221).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const isDigits = /^\+?\d+$/.test(searchQuery.replace(/[\s-]/g, ''));
                      if (isDigits) {
                        setPatientPhone(searchQuery);
                        setPatientName('');
                      } else {
                        setPatientName(searchQuery);
                      }
                      setActiveSubTab('receptionist');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Créer un RDV guichet pour ce patient</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredAppointments.map((apt) => {
                    const doc = practitioners.find((p) => p.id === apt.practitionerId);
                    const svc = services.find((s) => s.id === apt.serviceId);
                    return (
                      <div 
                        key={`quick-match-${apt.id}`}
                        className={`p-3.5 rounded-xl border transition-all hover:shadow-md space-y-2.5 ${cardBg} ${
                          apt.status === 'arrived' ? 'ring-1 ring-amber-500/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className={`text-xs font-bold truncate ${textPrimary} flex items-center gap-1.5`}>
                              <span className="truncate">{apt.patientName}</span>
                              {apt.source === 'online' && (
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-normal shrink-0 border ${theme.badgeSuccess}`}>
                                  En ligne
                                </span>
                              )}
                            </h4>
                            <a 
                              href={`tel:${apt.patientPhone.replace(/\s+/g, '')}`}
                              className="text-[11px] font-mono text-amber-500 hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <Phone className="w-3 h-3 shrink-0" />
                              <span>{apt.patientPhone}</span>
                            </a>
                          </div>
                          <div className="shrink-0">
                            {getStatusBadge(apt.status)}
                          </div>
                        </div>

                        <div className={`text-[11px] p-2 rounded-lg ${subBg} space-y-1`}>
                          <div className="flex items-center justify-between">
                            <span className={textSecondary}>Heure : <strong className={`font-mono ${theme.accentGreen}`}>{apt.timeSlot}</strong></span>
                            <span className="font-mono text-[10px] text-slate-400">{apt.reference}</span>
                          </div>
                          <div className="truncate">
                            <span className={textSecondary}>Acte : </span>
                            <strong className={textPrimary}>{svc?.name}</strong>
                          </div>
                          <div className="truncate text-slate-400">
                            Dr. {doc?.name} ({doc?.room || 'Cabinet'})
                          </div>
                        </div>

                        {/* Quick action buttons per matched patient */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {apt.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateStatus(apt.id, 'arrived');
                                showToast({
                                  type: 'success',
                                  title: 'Patient pointé à l\'accueil',
                                  message: `${apt.patientName} est placé en salle d'attente.`
                                });
                              }}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] transition flex items-center justify-center gap-1 shadow-xs"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Pointer Arrivé</span>
                            </button>
                          )}

                          {apt.status === 'arrived' && (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateStatus(apt.id, 'in_progress');
                                showToast({
                                  type: 'info',
                                  title: 'Appel consultation',
                                  message: `${apt.patientName} est appelé en consultation.`
                                });
                              }}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] transition flex items-center justify-center gap-1 shadow-xs"
                            >
                              <Bell className="w-3 h-3" />
                              <span>Appeler consultation</span>
                            </button>
                          )}

                          {apt.status === 'in_progress' && (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateStatus(apt.id, 'completed');
                                showToast({
                                  type: 'success',
                                  title: 'Consultation terminée',
                                  message: `Dossier de ${apt.patientName} clôturé.`
                                });
                              }}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition flex items-center justify-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Finaliser</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => triggerManualWhatsAppReminder(apt)}
                            className="p-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 border border-emerald-500/20 transition"
                            title="Envoyer un rappel WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveSubTab('agenda');
                            }}
                            className="p-1.5 rounded-lg bg-slate-700/20 hover:bg-slate-700/40 text-slate-300 border border-slate-700/30 transition text-[11px] font-semibold"
                            title="Voir dans la vue agenda complète"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* KPI Stats Cards with soft hover feedback */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border transition hover:-translate-y-0.5 hover:shadow-md ${cardBg}`}>
          <span className={`text-[11px] font-medium ${textSecondary}`}>RDV Aujourd'hui</span>
          <div className={`text-2xl font-black mt-1 ${textPrimary}`}>{appointments.length}</div>
          <span className={`text-[10px] font-medium ${theme.accentGreen}`}>Planning du 30 Septembre</span>
        </div>

        <div className={`p-4 rounded-xl border transition hover:-translate-y-0.5 hover:shadow-md ${cardBg}`}>
          <span className={`text-[11px] font-medium ${textSecondary}`}>Taux de présence</span>
          <div className={`text-2xl font-black mt-1 ${theme.accentGreen}`}>{presenceRate}%</div>
          <span className={`text-[10px] ${textSecondary}`}>Rappels WhatsApp actifs</span>
        </div>

        <div className={`p-4 rounded-xl border transition hover:-translate-y-0.5 hover:shadow-md ${cardBg}`}>
          <span className={`text-[11px] font-medium ${textSecondary}`}>Total Facturation</span>
          <div className={`text-xl font-black font-mono mt-1 ${textPrimary}`}>
            {totalAmountToday.toLocaleString('fr-FR')} FCFA
          </div>
          <span className={`text-[10px] ${textSecondary}`}>Honoraires des actes</span>
        </div>

        <div className={`p-4 rounded-xl border transition hover:-translate-y-0.5 hover:shadow-md ${cardBg}`}>
          <span className={`text-[11px] font-medium ${textSecondary}`}>Acomptes Wave & OM</span>
          <div className={`text-xl font-black font-mono mt-1 ${theme.accentSky}`}>
            {totalDepositsToday.toLocaleString('fr-FR')} FCFA
          </div>
          <span className={`text-[10px] font-medium ${theme.accentSky}`}>Sécurisés en amont</span>
        </div>
      </div>

      {/* TAB 1: AGENDA DU JOUR */}
      {activeSubTab === 'agenda' && (
        <div className={`rounded-2xl p-6 border shadow-xl space-y-5 transition ${cardBg}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className={`text-lg font-bold ${textPrimary}`}>Agenda & Planning du Jour</h2>
              <p className={`text-xs ${textSecondary}`}>
                Fuseau horaire Africa/Dakar • Cliquez sur les actions rapides ou testez l'alerte temps réel
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Button to simulate incoming real-time appointment */}
              <button
                onClick={handleSimulateIncomingBooking}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-emerald-950/20"
                title="Simuler un patient confirmant un rendez-vous sur le portail public avec acompte Wave"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-200" />
                <span>⚡ Simuler RDV en ligne entrant (Temps Réel)</span>
              </button>

              {/* Search bar inside agenda */}
              <div className="relative flex-1 sm:w-56">
                <Search className={`w-3.5 h-3.5 absolute left-3 top-3 ${textSecondary}`} />
                <input
                  type="text"
                  placeholder="Rechercher patient, tél..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full rounded-xl pl-8 pr-7 py-2 text-xs border focus:outline-none transition ${inputBg}`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-100"
                    title="Effacer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setActiveSubTab('receptionist')}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm hover:scale-[1.02]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouveau RDV</span>
              </button>
            </div>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className={`text-[11px] font-medium mr-1 ${textSecondary}`}>Filtrer :</span>
            {(['all', 'confirmed', 'arrived', 'in_progress', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === st
                    ? 'bg-amber-600 text-white shadow-xs'
                    : `${subBg} ${textSecondary} hover:${textPrimary}`
                }`}
              >
                {st === 'all' && 'Tous'}
                {st === 'confirmed' && 'Confirmés'}
                {st === 'arrived' && "En salle d'attente"}
                {st === 'in_progress' && 'En consultation'}
                {st === 'completed' && 'Terminés'}
              </button>
            ))}
          </div>

          {/* Appointments Table / Cards */}
          <div className={`divide-y border rounded-xl overflow-hidden ${theme.tableDivider} ${subBg}`}>
            {filteredAppointments.length === 0 ? (
              <div className={`p-8 text-center text-xs ${textSecondary}`}>
                Aucun rendez-vous trouvé pour ces critères de recherche.
              </div>
            ) : (
              filteredAppointments.map((apt) => {
                const doc = practitioners.find((p) => p.id === apt.practitionerId);
                const svc = services.find((s) => s.id === apt.serviceId);

                return (
                  <div
                    key={apt.id}
                    className={`p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 transition ${theme.tableRowHover}`}
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className={`rounded-xl p-2 sm:p-2.5 text-center min-w-[64px] sm:min-w-[72px] shrink-0 border ${subBg}`}>
                        <span className={`text-sm font-black font-mono block ${theme.accentGreen}`}>
                          {apt.timeSlot}
                        </span>
                        <span className={`text-[10px] ${textSecondary}`}>Dakar</span>
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <h4 className={`text-sm font-bold truncate ${textPrimary}`}>{apt.patientName}</h4>
                          <span className={`text-xs font-mono shrink-0 ${textSecondary}`}>{apt.patientPhone}</span>
                          {apt.source === 'online' && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${theme.badgeSuccess}`}>
                              🌐 En ligne Wave
                            </span>
                          )}
                          {apt.source === 'receptionist_phone' && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${theme.badgeWarning}`}>
                              📞 Appel
                            </span>
                          )}
                          {apt.source === 'receptionist_walkin' && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${theme.badgePurple}`}>
                              🏢 Guichet
                            </span>
                          )}
                        </div>

                        <div className="text-xs flex flex-wrap items-center gap-2">
                          <span className={`font-semibold ${theme.accentGreen}`}>{svc?.name}</span>
                          <span className={textSecondary}>•</span>
                          <span className={textSecondary}>{doc?.title} {doc?.name} ({doc?.room})</span>
                        </div>

                        {apt.notes && (
                          <p className={`text-[11px] italic break-words ${textSecondary}`}>Note: {apt.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-between md:justify-end w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-700/30">
                      <div className="text-left sm:text-right">
                        <div className={`text-xs font-mono font-bold ${textPrimary}`}>
                          {apt.amountXOF.toLocaleString('fr-FR')} FCFA
                        </div>
                        <div className={`text-[10px] ${textSecondary}`}>
                          {apt.depositPaidXOF > 0 ? (
                            <span className={theme.accentSky}>
                              Acompte {apt.paymentMethod.toUpperCase()}: {apt.depositPaidXOF.toLocaleString('fr-FR')} FCFA
                            </span>
                          ) : (
                            'Comptoir'
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        {getStatusBadge(apt.status)}

                        {/* Status Progression Pills */}
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => handleAdvanceStatus(apt.id, apt.status)}
                            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold transition shadow-xs hover:scale-[1.02]"
                          >
                            Marquer Arrivé
                          </button>
                        )}

                        {apt.status === 'arrived' && (
                          <button
                            onClick={() => handleAdvanceStatus(apt.id, apt.status)}
                            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-semibold transition shadow-xs hover:scale-[1.02]"
                          >
                            Faire Entrer
                          </button>
                        )}

                        {apt.status === 'in_progress' && (
                          <button
                            onClick={() => handleAdvanceStatus(apt.id, apt.status)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition shadow-xs hover:scale-[1.02]"
                          >
                            Terminer
                          </button>
                        )}

                        <button
                          onClick={() => triggerManualWhatsAppReminder(apt)}
                          title="Envoyer rappel WhatsApp"
                          className={`p-2 rounded-lg border transition hover:scale-105 ${subBg} ${theme.accentGreen}`}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: RECEPTIONISTE & GUICHET */}
      {activeSubTab === 'receptionist' && (
        <div className={`rounded-2xl p-6 sm:p-7 border shadow-xl space-y-6 transition ${cardBg}`}>
          <div className="border-b pb-4 border-slate-700/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${textPrimary}`}>
                <PhoneCall className="w-5 h-5 text-amber-500" />
                <span>Module Réceptionniste : Enregistrement Téléphone ou Guichet</span>
              </h2>
              <p className={`text-xs mt-1 ${textSecondary}`}>
                Indispensable au Sénégal pour digitaliser immédiatement les patients se présentant physiquement ou appelant par téléphone.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSimulateIncomingBooking}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto shadow-xs"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
              <span>Tester Alerte Temps Réel</span>
            </button>
          </div>

          <form onSubmit={handleCreateQuickAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className={`font-semibold block ${textPrimary}`}>Canal d'origine :</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSource('receptionist_phone')}
                  className={`flex-1 py-2.5 rounded-xl font-bold border transition ${
                    source === 'receptionist_phone'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                      : `${subBg} ${textSecondary}`
                  }`}
                >
                  📞 Appel téléphonique
                </button>
                <button
                  type="button"
                  onClick={() => setSource('receptionist_walkin')}
                  className={`flex-1 py-2.5 rounded-xl font-bold border transition ${
                    source === 'receptionist_walkin'
                      ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                      : `${subBg} ${textSecondary}`
                  }`}
                >
                  🏢 Guichet / Sur place
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`font-semibold block ${textPrimary}`}>Nom complet du patient :</label>
              <input
                type="text"
                required
                placeholder="Ex: Cheikh Tidiane Diallo"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none transition ${inputBg}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`font-semibold block ${textPrimary}`}>Numéro de mobile (+221) :</label>
              <input
                type="text"
                required
                placeholder="77 450 12 34"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className={`w-full rounded-xl px-3.5 py-2.5 font-mono border focus:outline-none transition ${inputBg}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`font-semibold block ${textPrimary}`}>Praticien / Spécialiste :</label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none transition ${inputBg}`}
              >
                {practitioners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} {p.name} ({p.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={`font-semibold block ${textPrimary}`}>Acte médical :</label>
              <select
                value={selectedSvcId}
                onChange={(e) => setSelectedSvcId(e.target.value)}
                className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none transition ${inputBg}`}
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.priceXOF.toLocaleString('fr-FR')} FCFA
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={`font-semibold block ${textPrimary}`}>Créneau souhaité :</label>
              <input
                type="time"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className={`w-full rounded-xl px-3.5 py-2.5 font-mono border focus:outline-none transition ${inputBg}`}
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className={`font-semibold block ${textPrimary}`}>Remarques accueil :</label>
              <input
                type="text"
                placeholder="Ex: Patient souffrant, déjà orienté vers le Dr. Ndiaye..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none transition ${inputBg}`}
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-900/30 transition hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Enregistrer & Confirmer le RDV Guichet</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: SALLE D'ATTENTE & QUEUE */}
      {activeSubTab === 'queue' && (
        <div className={`rounded-2xl p-6 sm:p-7 border shadow-xl space-y-5 transition ${cardBg}`}>
          <div>
            <h2 className={`text-lg font-bold flex items-center gap-2 ${textPrimary}`}>
              <Users className="w-5 h-5 text-sky-500" />
              <span>Gestion de la File d'attente en temps réel</span>
            </h2>
            <p className={`text-xs mt-1 ${textSecondary}`}>
              Organisation sans cohue physique : suivi transparent des patients présents sur place.
            </p>
          </div>

          {searchQuery.trim() && (
            <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 font-semibold">
              <span>File filtrée pour la recherche « {searchQuery} » ({filteredAppointments.length} résultat(s))</span>
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="hover:underline flex items-center gap-1 font-bold text-slate-300"
              >
                <X className="w-3 h-3" />
                <span>Réinitialiser la file</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Colonne 1: Salle d'attente */}
            <div className={`rounded-xl p-4 border space-y-3 ${subBg}`}>
              <div className="flex items-center justify-between border-b pb-2 border-slate-700/20">
                <span className="font-bold text-xs text-amber-500 uppercase">En salle d'attente</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badgeWarning}`}>
                  {(searchQuery.trim() ? filteredAppointments : appointments).filter((a) => a.status === 'arrived').length}
                </span>
              </div>

              <div className="space-y-2">
                {(searchQuery.trim() ? filteredAppointments : appointments)
                  .filter((a) => a.status === 'arrived')
                  .map((a) => (
                    <div key={a.id} className={`p-3 rounded-xl border space-y-2 ${cardBg}`}>
                      <div className="flex justify-between items-start">
                        <span className={`font-bold text-xs ${textPrimary}`}>{a.patientName}</span>
                        <span className={`font-mono text-xs font-bold ${theme.accentGreen}`}>{a.timeSlot}</span>
                      </div>
                      <p className={`text-[11px] ${textSecondary}`}>{a.notes || 'Arrivé à l’accueil'}</p>
                      <button
                        onClick={() => handleAdvanceStatus(a.id, a.status)}
                        className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold transition shadow-xs"
                      >
                        Appeler en consultation 🔔
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Colonne 2: En cours de consultation */}
            <div className={`rounded-xl p-4 border space-y-3 ${subBg}`}>
              <div className="flex items-center justify-between border-b pb-2 border-slate-700/20">
                <span className="font-bold text-xs text-sky-500 uppercase">En Consultation</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badgeInfo}`}>
                  {(searchQuery.trim() ? filteredAppointments : appointments).filter((a) => a.status === 'in_progress').length}
                </span>
              </div>

              <div className="space-y-2">
                {(searchQuery.trim() ? filteredAppointments : appointments)
                  .filter((a) => a.status === 'in_progress')
                  .map((a) => (
                    <div key={a.id} className={`p-3 rounded-xl border border-sky-500/40 space-y-2 ${cardBg}`}>
                      <div className="flex justify-between items-start">
                        <span className={`font-bold text-xs ${textPrimary}`}>{a.patientName}</span>
                        <span className={`font-mono text-xs animate-pulse ${theme.accentSky}`}>En cours</span>
                      </div>
                      <button
                        onClick={() => handleAdvanceStatus(a.id, a.status)}
                        className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition shadow-xs"
                      >
                        Finaliser la consultation ✓
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Colonne 3: Terminés aujourd'hui */}
            <div className={`rounded-xl p-4 border space-y-3 ${subBg}`}>
              <div className="flex items-center justify-between border-b pb-2 border-slate-700/20">
                <span className="font-bold text-xs text-emerald-500 uppercase">Terminés</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badgeSuccess}`}>
                  {(searchQuery.trim() ? filteredAppointments : appointments).filter((a) => a.status === 'completed').length}
                </span>
              </div>

              <div className="space-y-2">
                {(searchQuery.trim() ? filteredAppointments : appointments)
                  .filter((a) => a.status === 'completed')
                  .map((a) => (
                    <div key={a.id} className={`p-3 rounded-xl border space-y-1 ${cardBg}`}>
                      <div className="flex justify-between items-start">
                        <span className={`font-medium text-xs ${textPrimary}`}>{a.patientName}</span>
                        <span className={`text-[10px] font-bold ${theme.accentGreen}`}>✓ Payé</span>
                      </div>
                      <p className={`text-[10px] ${textSecondary}`}>{a.amountXOF.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS WHATSAPP & SMS SENEGAL */}
      {activeSubTab === 'notifications' && (
        <div className={`rounded-2xl p-6 sm:p-7 border shadow-xl space-y-5 transition ${cardBg}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${textPrimary}`}>
                <MessageSquare className="w-5 h-5 text-emerald-500" />
                <span>Simulateur de Notifications WhatsApp & SMS (Adaptation Sénégal)</span>
              </h2>
              <p className={`text-xs mt-1 ${textSecondary}`}>
                Templates bilingues Français et Wolof avec bascule en 1 clic
              </p>
            </div>

            {/* Language toggle */}
            <div className={`flex items-center p-1 rounded-xl border text-xs ${subBg}`}>
              <button
                onClick={() => setWhatsappLang('fr')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  whatsappLang === 'fr' ? 'bg-emerald-600 text-white shadow-xs' : textSecondary
                }`}
              >
                Français
              </button>
              <button
                onClick={() => setWhatsappLang('wo')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  whatsappLang === 'wo' ? 'bg-emerald-600 text-white shadow-xs' : textSecondary
                }`}
              >
                Wolof 🇸🇳
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className={`rounded-xl p-5 border space-y-3 ${subBg}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${theme.accentGreen}`}>Rappel J-1 (WhatsApp Cloud API)</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${theme.badgeSuccess}`}>
                  {whatsappLang === 'fr' ? 'Version FR' : 'Version Wolof'}
                </span>
              </div>
              <p className={`text-xs p-3.5 rounded-xl font-mono leading-relaxed border ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                {whatsappLang === 'fr' ? (
                  `« Bonjour Moussa Diop, rappel de votre RDV demain à 10:00 avec Dr. Ndiaye à ${tenant.name}. En cas d'empêchement, merci d'appeler le ${tenant.phone}. »`
                ) : (
                  `« Dalal ak jamm Moussa Diop, fàttali la sa rendez-vous ëllëg ci 10:00 ak Dr. Ndiaye ci ${tenant.name}. Bu amee lu la xawa téye, wooteel ci ${tenant.phone}. »`
                )}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className={`text-[11px] ${textSecondary}`}>Taux d'ouverture : &gt; 96%</span>
                <button
                  onClick={() => {
                    showToast({
                      type: 'whatsapp',
                      title: 'Rappel WhatsApp test simulé !',
                      message: `Notification envoyée en ${whatsappLang === 'fr' ? 'Français' : 'Wolof'}.`
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Tester l'envoi</span>
                </button>
              </div>
            </div>

            <div className={`rounded-xl p-5 border space-y-3 ${subBg}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${theme.accentSky}`}>Reçu Acompte Wave / Orange Money (SMS)</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${theme.badgeInfo}`}>
                  Direct API SMS
                </span>
              </div>
              <p className={`text-xs p-3.5 rounded-xl font-mono leading-relaxed border ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                « {tenant.name} : RDV confirmé pour le 30/09 à 10:00. Acompte Wave de 5 000 FCFA reçu avec succès. Réf: SN-RDV-4829. »
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className={`text-[11px] ${textSecondary}`}>Fallback SMS instantané</span>
                <button
                  onClick={() => {
                    showToast({
                      type: 'info',
                      title: 'SMS Wave transmis',
                      message: 'Reçu bancaire mobile envoyé au patient.'
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Tester l'envoi SMS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: JOURS FERIES SENEGAL */}
      {activeSubTab === 'holidays' && (
        <div className={`rounded-2xl p-6 sm:p-7 border shadow-xl space-y-5 transition ${cardBg}`}>
          <div>
            <h2 className={`text-lg font-bold flex items-center gap-2 ${textPrimary}`}>
              <CalendarCheck className="w-5 h-5 text-purple-500" />
              <span>Calendrier des Jours Fériés et Fermetures au Sénégal</span>
            </h2>
            <p className={`text-xs mt-1 ${textSecondary}`}>
              Configuration des fêtes musulmanes, chrétiennes et civiles sénégalaises. Bloque automatiquement les réservations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-2">
            {holidays.map((h) => (
              <div key={h.id} className={`rounded-xl p-4 border space-y-2.5 transition hover:-translate-y-0.5 ${subBg}`}>
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                    h.type === 'religious_muslim' 
                      ? theme.badgeSuccess
                      : h.type === 'religious_christian'
                        ? theme.badgeInfo
                        : theme.badgeWarning
                  }`}>
                    {h.type === 'religious_muslim' ? 'Fête Musulmane' : h.type === 'religious_christian' ? 'Fête Chrétienne' : 'Fête Civile'}
                  </span>
                  <span className={`font-mono text-xs ${textSecondary}`}>{h.date}</span>
                </div>

                <div>
                  <h4 className={`text-xs font-bold ${textPrimary}`}>{h.name}</h4>
                  {h.nameWolof && <p className={`text-[11px] italic ${textSecondary}`}>Wolof : {h.nameWolof}</p>}
                </div>

                <div className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                  <span>🔒 Cabinet fermé aux réservations</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
