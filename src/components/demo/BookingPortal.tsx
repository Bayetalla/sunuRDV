import React, { useState } from 'react';
import { Tenant, Practitioner, MedicalService, Appointment, PaymentMethod } from '../../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Check, 
  User, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2, 
  QrCode,
  Smartphone,
  Share2,
  CalendarPlus
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { getThemeTokens } from '../../utils/themeTokens';

interface BookingPortalProps {
  tenant: Tenant;
  practitioners: Practitioner[];
  services: MedicalService[];
  onAppointmentCreated: (appointment: Appointment) => void;
  isDark?: boolean;
}

export const BookingPortal: React.FC<BookingPortalProps> = ({
  tenant,
  practitioners,
  services,
  onAppointmentCreated,
  isDark = true,
}) => {
  const { showToast } = useToast();
  const theme = getThemeTokens(isDark);
  // Booking Wizard Step
  const [step, setStep] = useState<number>(1);

  // Dynamic Theme Styling Tokens
  const cardBg = theme.cardBg;
  const subBg = theme.subBg;
  const textPrimary = theme.textPrimary;
  const textSecondary = theme.textSecondary;
  const inputBg = theme.inputBg;

  // Selections
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [selectedPractitionerId, setSelectedPractitionerId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-30');
  const [selectedTime, setSelectedTime] = useState<string>('10:00');
  
  // Patient details (+221 phone)
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('77 450 12 34');
  const [patientNotes, setPatientNotes] = useState<string>('');

  // OTP Verification state
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [simulatedOtpCode, setSimulatedOtpCode] = useState<string>('4829');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('on_site');
  const [paymentDone, setPaymentDone] = useState<boolean>(false);

  // Finished appointment
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Available practitioners for the selected service
  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const eligiblePractitioners = practitioners.filter(
    (p) => currentService?.practitionerIds.includes(p.id)
  );

  // Default practitioner if none selected
  const activePractitioner = practitioners.find((p) => p.id === selectedPractitionerId) || eligiblePractitioners[0];

  // Available time slots (08:30 to 17:30 Dakar time)
  const timeSlots = [
    '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  // Phone validation for Senegal: starts with 77, 78, 76, 70, 75
  const cleanPhone = patientPhone.replace(/\s+/g, '');
  const isValidSenegalPhone = /^(77|78|76|70|75)\d{7}$/.test(cleanPhone);

  const handleSendOtp = () => {
    if (!isValidSenegalPhone) return;
    setOtpSent(true);
    showToast({
      type: 'info',
      title: 'Code OTP SMS envoyé 🇸🇳',
      message: `Code temporaire envoyé au +221 ${patientPhone}. Utilisez le code 4829 pour tester.`
    });
  };

  const handleVerifyOtp = () => {
    if (enteredOtp === simulatedOtpCode || enteredOtp === '4829') {
      setOtpVerified(true);
      showToast({
        type: 'success',
        title: 'Authentification réussie',
        message: 'Votre numéro sénégalais a été vérifié avec succès.'
      });
    } else {
      showToast({
        type: 'warning',
        title: 'Code incorrect',
        message: 'Veuillez saisir le code 4829 envoyé par SMS.'
      });
    }
  };

  const handleConfirmBooking = () => {
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      reference: `SN-RDV-${Math.floor(1000 + Math.random() * 9000)}`,
      tenantId: tenant.id,
      practitionerId: activePractitioner?.id || practitioners[0].id,
      serviceId: currentService.id,
      patientName: patientName || 'Patient Visiteur',
      patientPhone: `+221 ${patientPhone}`,
      date: selectedDate,
      timeSlot: selectedTime,
      status: 'confirmed',
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'on_site' ? 'pending' : 'deposit_paid',
      amountXOF: currentService.priceXOF,
      depositPaidXOF: paymentMethod === 'on_site' ? 0 : currentService.depositAmountXOF,
      source: 'online',
      notes: patientNotes,
      reminderSent: true,
      createdAt: '2026-09-30 10:00',
    };

    setCreatedAppointment(newApt);
    onAppointmentCreated(newApt);
    showToast({
      type: 'whatsapp',
      title: 'Rendez-vous confirmé & Notification WhatsApp envoyée',
      message: `Ticket ${newApt.reference} enregistré. SMS & WhatsApp bilingue (FR/Wolof) transmis.`
    });
    setStep(5);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Route URL Simulator Badge */}
      <div className={`rounded-xl px-4 py-2.5 flex items-center justify-between text-xs transition border ${subBg}`}>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className={`font-mono ${textSecondary}`}>URL résolue par le TenantMiddleware :</span>
          <span className="bg-emerald-500/10 text-emerald-500 font-mono px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
            https://sunurdv.sn/e/{tenant.slug}
          </span>
        </div>
        <span className={`text-[11px] hidden sm:inline ${textSecondary}`}>Routage Multi-tenant par chemin</span>
      </div>

      {/* Clinic Header Profile */}
      <div className={`rounded-2xl p-6 sm:p-7 shadow-xl border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${cardBg}`}>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
            {tenant.logo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-black ${textPrimary}`}>{tenant.name}</h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                Certifié Sénégal 🇸🇳
              </span>
            </div>
            <p className={`text-xs mt-1 max-w-md ${textSecondary}`}>{tenant.tagline}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
              <span className={`flex items-center gap-1 ${textSecondary}`}>
                <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {tenant.address}, {tenant.city}
              </span>
              <span className={`flex items-center gap-1 ${textSecondary}`}>
                <Phone className="w-3.5 h-3.5 text-emerald-500" /> {tenant.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Dakar Opening Hours reminder */}
        <div className={`p-3.5 rounded-xl border text-xs space-y-1 shrink-0 ${subBg}`}>
          <div className={`font-bold flex items-center gap-1.5 ${textPrimary}`}>
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Horaires Dakar :
          </div>
          <div className={textSecondary}>Lun - Sam : {tenant.openingHours.start} - {tenant.openingHours.end}</div>
          <div className="text-[11px] text-amber-500 font-medium italic">Pause Vendredi (Prière) : 13h00 - 15h00</div>
        </div>
      </div>

      {/* Stepper Progress Bar (Fluid & Mobile-Friendly) */}
      {step < 5 && (
        <div className={`rounded-xl p-3 sm:p-4 border shadow-sm transition flex items-center justify-between text-xs overflow-x-auto ${subBg}`}>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs transition ${
              step >= 1 ? 'bg-emerald-600 text-white shadow-sm' : isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500'
            }`}>1</span>
            <span className={step === 1 ? `font-bold ${textPrimary}` : textSecondary}>Service & Médecin</span>
          </div>

          <div className={`h-0.5 w-4 sm:w-12 shrink-0 ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`} />

          <div className="flex items-center gap-2 shrink-0">
            <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs transition ${
              step >= 2 ? 'bg-emerald-600 text-white shadow-sm' : isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500'
            }`}>2</span>
            <span className={step === 2 ? `font-bold ${textPrimary}` : textSecondary}>Date & Heure</span>
          </div>

          <div className={`h-0.5 w-4 sm:w-12 shrink-0 ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`} />

          <div className="flex items-center gap-2 shrink-0">
            <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs transition ${
              step >= 3 ? 'bg-emerald-600 text-white shadow-sm' : isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500'
            }`}>3</span>
            <span className={step === 3 ? `font-bold ${textPrimary}` : textSecondary}>Coordonnées (+221)</span>
          </div>

          <div className={`h-0.5 w-4 sm:w-12 shrink-0 ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`} />

          <div className="flex items-center gap-2 shrink-0">
            <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs transition ${
              step >= 4 ? 'bg-emerald-600 text-white shadow-sm' : isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500'
            }`}>4</span>
            <span className={step === 4 ? `font-bold ${textPrimary}` : textSecondary}>Paiement</span>
          </div>
        </div>
      )}

      {/* Step 1: Select Service & Doctor */}
      {step === 1 && (
        <div className={`rounded-2xl p-6 sm:p-7 border shadow-xl transition space-y-6 ${cardBg}`}>
          <div className="space-y-1">
            <h2 className={`text-lg font-bold ${textPrimary}`}>1. Choisissez un motif de consultation ou acte</h2>
            <p className={`text-xs ${textSecondary}`}>Tarifs officiels réglementés en Francs CFA (XOF)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {services.map((svc) => {
              const isSelected = selectedServiceId === svc.id;
              return (
                <div
                  key={svc.id}
                  onClick={() => {
                    setSelectedServiceId(svc.id);
                    if (!svc.practitionerIds.includes(selectedPractitionerId)) {
                      setSelectedPractitionerId(svc.practitionerIds[0] || '');
                    }
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                      : `${subBg} hover:border-slate-500/50`
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-500">{svc.category}</span>
                      <span className={`text-xs flex items-center gap-1 font-mono ${textSecondary}`}>
                        <Clock className="w-3 h-3" /> {svc.durationMinutes} min
                      </span>
                    </div>
                    <h3 className={`font-bold text-sm mt-1 ${textPrimary}`}>{svc.name}</h3>
                    <p className={`text-xs mt-1 line-clamp-2 ${textSecondary}`}>{svc.description}</p>
                  </div>

                  <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <span className={`text-sm font-black font-mono ${textPrimary}`}>
                      {svc.priceXOF.toLocaleString('fr-FR')} FCFA
                    </span>
                    {svc.depositRequired && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-500 font-medium px-2 py-0.5 rounded border border-amber-500/30">
                        Acompte : {svc.depositAmountXOF.toLocaleString('fr-FR')} FCFA
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Practitioner selection */}
          <div className={`space-y-3 pt-5 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h3 className={`text-sm font-bold ${textPrimary}`}>Médecin disponible pour cet acte :</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {eligiblePractitioners.map((doc) => {
                const isDocActive = activePractitioner?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedPractitionerId(doc.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                      isDocActive
                        ? 'bg-emerald-500/15 border-emerald-500 shadow-sm ring-1 ring-emerald-500/50'
                        : `${subBg} hover:border-slate-500/50`
                    }`}
                  >
                    <img 
                      src={doc.avatar} 
                      alt={doc.name} 
                      className="h-12 w-12 rounded-xl object-cover border border-slate-700 shrink-0" 
                    />
                    <div>
                      <h4 className={`text-xs font-bold ${textPrimary}`}>{doc.title} {doc.name}</h4>
                      <p className={`text-[11px] ${textSecondary}`}>{doc.specialty}</p>
                      <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {doc.room}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Continuer : Date & Heure</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div className={`rounded-2xl p-6 sm:p-7 border shadow-xl transition space-y-6 ${cardBg}`}>
          <div className="space-y-1">
            <h2 className={`text-lg font-bold ${textPrimary}`}>2. Choisissez votre créneau de rendez-vous</h2>
            <p className={`text-xs ${textSecondary}`}>Fuseau horaire officiel : Africa/Dakar (Heure de Dakar)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date selection */}
            <div className="space-y-3">
              <label className={`text-xs font-semibold block ${textPrimary}`}>Date du rendez-vous :</label>
              <input
                type="date"
                value={selectedDate}
                min="2026-09-30"
                max="2026-10-30"
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition border ${inputBg}`}
              />
              <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${subBg}`}>
                <span className="font-semibold text-emerald-500">💡 Calendrier Sénégal :</span>
                <p className={textSecondary}>Les vendredis, la pause prière bloque automatiquement les créneaux entre 13h et 15h. Les jours fériés (Magal, Korité, Tabaski) sont exclus.</p>
              </div>
            </div>

            {/* Time Slot selection */}
            <div className="space-y-3">
              <label className={`text-xs font-semibold block ${textPrimary}`}>Créneaux horaires disponibles :</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((time) => {
                  const isTimeSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-lg text-xs font-mono font-medium border transition ${
                        isTimeSelected
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md font-bold'
                          : `${subBg} hover:border-slate-500/50 ${textSecondary} hover:${textPrimary}`
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              onClick={() => setStep(1)}
              className={`text-xs px-4 py-2 hover:underline transition ${textSecondary}`}
            >
              Retour
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition hover:scale-[1.02]"
            >
              <span>Continuer : Coordonnées</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Contact & OTP Verification */}
      {step === 3 && (
        <div className={`rounded-2xl p-6 sm:p-7 border shadow-xl transition space-y-6 ${cardBg}`}>
          <div className="space-y-1">
            <h2 className={`text-lg font-bold ${textPrimary}`}>3. Coordonnées du patient & Authentification OTP</h2>
            <p className={`text-xs ${textSecondary}`}>
              Connexion par numéro de mobile sénégalais (+221) sans mot de passe fastidieux
            </p>
          </div>

          <div className="space-y-4 max-w-lg">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${textPrimary}`}>
                Nom complet du patient :
              </label>
              <input
                type="text"
                placeholder="Ex: Moussa Diop, Mariama Sow"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className={`w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition border ${inputBg}`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold block mb-1 ${textPrimary}`}>
                Numéro de téléphone mobile au Sénégal :
              </label>
              <div className="flex gap-2">
                <div className={`border rounded-xl px-3 flex items-center text-xs font-mono font-bold text-emerald-500 ${subBg}`}>
                  🇸🇳 +221
                </div>
                <input
                  type="text"
                  placeholder="77 450 12 34"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none transition border ${inputBg}`}
                />
                {!otpVerified && (
                  <button
                    onClick={handleSendOtp}
                    disabled={!isValidSenegalPhone}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs transition whitespace-nowrap shadow-sm hover:scale-[1.02]"
                  >
                    Envoyer code OTP
                  </button>
                )}
              </div>
              <p className={`text-[11px] mt-1 ${textSecondary}`}>
                Opérateurs reconnus : Orange (77/78), Free (76), Expresso (70), Wave Mobile (75).
              </p>
            </div>

            {/* OTP Simulation modal / popup */}
            {otpSent && !otpVerified && (
              <div className={`p-4 rounded-xl border space-y-3 animate-fadeIn ${subBg} border-blue-500/50`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-400 font-semibold flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    SMS / WhatsApp reçu sur le +221 {patientPhone} :
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono text-[11px] font-bold">
                    Code : {simulatedOtpCode}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="4829"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className={`w-32 rounded-xl px-4 py-2 text-center text-lg font-mono tracking-widest focus:outline-none border ${inputBg}`}
                  />
                  <button
                    onClick={handleVerifyOtp}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm hover:scale-[1.02]"
                  >
                    Valider le code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEnteredOtp('4829');
                      setOtpVerified(true);
                      showToast({
                        type: 'success',
                        title: 'Numéro +221 vérifié',
                        message: 'Code 4829 injecté et validé avec succès.'
                      });
                    }}
                    className="px-3 py-2 rounded-xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs font-semibold transition"
                  >
                    ⚡ Remplir automatiquement (4829)
                  </button>
                </div>
              </div>
            )}

            {otpVerified && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-500 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Numéro +221 {patientPhone} vérifié avec succès par OTP.</span>
              </div>
            )}

            <div>
              <label className={`text-xs font-semibold block mb-1 ${textPrimary}`}>
                Précisions médicales ou antécédents (Optionnel) :
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Douleurs abdominales depuis hier, déjà vu Dr. Ndiaye..."
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                className={`w-full rounded-xl px-4 py-2 text-xs focus:outline-none transition border ${inputBg}`}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              onClick={() => setStep(2)}
              className={`text-xs px-4 py-2 hover:underline transition ${textSecondary}`}
            >
              Retour
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!patientName}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition hover:scale-[1.02]"
            >
              <span>Continuer : Mode de Paiement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Payment Choice */}
      {step === 4 && (
        <div className={`rounded-2xl p-6 sm:p-7 border shadow-xl transition space-y-6 ${cardBg}`}>
          <div className="space-y-1">
            <h2 className={`text-lg font-bold ${textPrimary}`}>4. Mode de règlement & Acompte</h2>
            <p className={`text-xs ${textSecondary}`}>
              Paiement flexible adapté au Sénégal : au comptoir ou via Mobile Money
            </p>
          </div>

          {/* Booking summary box */}
          <div className={`p-4 rounded-xl border space-y-2 text-xs ${subBg}`}>
            <div className={`flex justify-between ${textSecondary}`}>
              <span>Acte sélectionné :</span>
              <span className={`font-bold ${textPrimary}`}>{currentService.name}</span>
            </div>
            <div className={`flex justify-between ${textSecondary}`}>
              <span>Praticien :</span>
              <span className={`font-bold ${textPrimary}`}>{activePractitioner?.name}</span>
            </div>
            <div className={`flex justify-between ${textSecondary}`}>
              <span>Créneau :</span>
              <span className="font-bold text-emerald-500 font-mono">
                {selectedDate} à {selectedTime} (Heure Dakar)
              </span>
            </div>
            <div className={`border-t pt-2 flex justify-between text-sm ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`font-bold ${textPrimary}`}>Tarif total :</span>
              <span className={`font-black font-mono ${textPrimary}`}>
                {currentService.priceXOF.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>

          {/* Payment Method Cards */}
          <div className="space-y-3">
            <label className={`text-xs font-semibold block ${textPrimary}`}>Choisissez votre modalité :</label>
            
            {/* 1. Sur place */}
            <div
              onClick={() => setPaymentMethod('on_site')}
              className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                paymentMethod === 'on_site'
                  ? 'bg-emerald-500/15 border-emerald-500 shadow-sm ring-1 ring-emerald-500/40'
                  : `${subBg} hover:border-slate-500/50`
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  💵
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${textPrimary}`}>Règlement au comptoir (Sur place)</h4>
                  <p className={`text-[11px] ${textSecondary}`}>
                    Payez l'intégralité le jour de votre rendez-vous à l'accueil de la clinique.
                  </p>
                </div>
              </div>
              <span className={`text-xs font-mono font-bold ${textSecondary}`}>0 FCFA maintenant</span>
            </div>

            {/* 2. Wave Sénégal */}
            <div
              onClick={() => setPaymentMethod('wave')}
              className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                paymentMethod === 'wave'
                  ? 'bg-sky-500/15 border-sky-500 shadow-sm ring-1 ring-sky-500/40'
                  : `${subBg} hover:border-slate-500/50`
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black text-sm">
                  🌊
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs font-bold ${textPrimary}`}>Wave Sénégal (Acompte sécurisé)</h4>
                    <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.2 rounded font-semibold">
                      Instantané
                    </span>
                  </div>
                  <p className={`text-[11px] ${textSecondary}`}>
                    Acompte de confirmation déduit de la facture finale.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-sky-400">
                {currentService.depositAmountXOF.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            {/* 3. Orange Money */}
            <div
              onClick={() => setPaymentMethod('orange_money')}
              className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                paymentMethod === 'orange_money'
                  ? 'bg-orange-500/15 border-orange-500 shadow-sm ring-1 ring-orange-500/40'
                  : `${subBg} hover:border-slate-500/50`
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                  OM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs font-bold ${textPrimary}`}>Orange Money Sénégal</h4>
                    <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.2 rounded font-semibold">
                      #144#
                    </span>
                  </div>
                  <p className={`text-[11px] ${textSecondary}`}>
                    Validation par code secret ou push mobile Orange Money.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-orange-400">
                {currentService.depositAmountXOF.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>

          <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              onClick={() => setStep(3)}
              className={`text-xs px-4 py-2 hover:underline transition ${textSecondary}`}
            >
              Retour
            </button>
            <button
              onClick={handleConfirmBooking}
              className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-emerald-900/40 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              <span>Confirmer le rendez-vous</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Confirmation Ticket */}
      {step === 5 && createdAppointment && (
        <div className={`rounded-2xl p-6 sm:p-8 space-y-6 text-center animate-fadeIn border shadow-xl ${cardBg}`}>
          <div className="h-16 w-16 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-2xl mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Rendez-vous Confirmé avec Succès
            </span>
            <h2 className={`text-2xl font-black ${textPrimary}`}>Dalal ak Jàmm, votre rendez-vous est réservé !</h2>
            <p className={`text-xs ${textSecondary}`}>
              Référence du dossier : <span className={`font-mono font-bold ${textPrimary}`}>{createdAppointment.reference}</span>
            </p>
          </div>

          {/* Ticket Card */}
          <div className={`max-w-md mx-auto border-2 border-dashed rounded-2xl p-5 text-left space-y-3 relative ${subBg} ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
            <div className={`flex justify-between items-start border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div>
                <span className={`text-[10px] uppercase ${textSecondary}`}>Établissement</span>
                <h4 className={`font-bold text-sm ${textPrimary}`}>{tenant.name}</h4>
                <p className={`text-[11px] ${textSecondary}`}>{tenant.address}, {tenant.city}</p>
              </div>
              <span className="text-2xl">{tenant.logo}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className={`block text-[10px] ${textSecondary}`}>Patient</span>
                <span className={`font-semibold ${textPrimary}`}>{createdAppointment.patientName}</span>
                <div className="text-[11px] font-mono text-emerald-500 font-bold">{createdAppointment.patientPhone}</div>
              </div>

              <div>
                <span className={`block text-[10px] ${textSecondary}`}>Médecin</span>
                <span className={`font-semibold ${textPrimary}`}>{activePractitioner?.name}</span>
                <div className={`text-[11px] ${textSecondary}`}>{activePractitioner?.room}</div>
              </div>

              <div>
                <span className={`block text-[10px] ${textSecondary}`}>Date & Heure</span>
                <span className="font-bold text-emerald-500 font-mono">
                  {createdAppointment.date} à {createdAppointment.timeSlot}
                </span>
              </div>

              <div>
                <span className={`block text-[10px] ${textSecondary}`}>Statut Paiement</span>
                <span className={`font-semibold capitalize ${textPrimary}`}>
                  {createdAppointment.paymentStatus === 'deposit_paid' ? 'Acompte Payé' : 'À régler sur place'}
                </span>
              </div>
            </div>
          </div>

          {/* WhatsApp Notification preview */}
          <div className={`max-w-md mx-auto border rounded-xl p-4 text-left space-y-2 ${
            isDark ? 'bg-emerald-950/40 border-emerald-800/40' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
              <MessageSquare className="w-4 h-4" />
              <span>Notification WhatsApp envoyée automatiquement (Bilingue FR / Wolof) :</span>
            </div>
            <p className={`text-xs italic p-3 rounded-xl border leading-relaxed ${
              isDark ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
            }`}>
              « Bonjour {createdAppointment.patientName}, votre rendez-vous pour {currentService.name} avec {activePractitioner?.name} à {tenant.name} est confirmé pour le {createdAppointment.date} à {createdAppointment.timeSlot}. Réf: {createdAppointment.reference}. Fàttali : bu amee lu la xawa téye, wooteel ci {tenant.phone}. »
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                showToast({
                  type: 'whatsapp',
                  title: 'Partagé sur WhatsApp',
                  message: `Récépissé envoyé au +221 ${createdAppointment.patientPhone}`
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Partager sur WhatsApp</span>
            </button>

            <button
              onClick={() => {
                showToast({
                  type: 'info',
                  title: 'Rendez-vous synchronisé',
                  message: 'Événement ajouté au calendrier mobile (fuseau Dakar).'
                });
              }}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${subBg} ${textPrimary}`}
            >
              <CalendarPlus className="w-3.5 h-3.5 text-emerald-500" />
              <span>Ajouter à mon agenda</span>
            </button>

            <button
              onClick={() => {
                setStep(1);
                setPatientName('');
                setPatientNotes('');
              }}
              className={`px-5 py-2.5 rounded-xl border text-xs font-semibold transition ${subBg} ${textSecondary} hover:${textPrimary}`}
            >
              Prendre un autre rendez-vous
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
