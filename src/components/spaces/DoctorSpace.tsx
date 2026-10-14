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
  MessageSquare
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { getThemeTokens } from '../../utils/themeTokens';

interface DoctorSpaceProps {
  doctor: Practitioner;
  appointments: Appointment[];
  services: MedicalService[];
  isDark: boolean;
  onUpdateStatus: (aptId: string, newStatus: AppointmentStatus) => void;
}

export const DoctorSpace: React.FC<DoctorSpaceProps> = ({
  doctor,
  appointments,
  services,
  isDark,
  onUpdateStatus,
}) => {
  const { showToast } = useToast();
  const theme = getThemeTokens(isDark);
  const [selectedAptId, setSelectedAptId] = useState<string>(appointments[0]?.id || '');
  const [medicalNote, setMedicalNote] = useState<string>('');
  const [prescriptionItem, setPrescriptionItem] = useState<string>('');
  const [prescriptionList, setPrescriptionList] = useState<string[]>([
    'Paracétamol 1g : 1 cp toutes les 8h si fièvre ou douleur',
    'Amoxicilline 500mg : 1 gélule matin et soir pendant 6 jours'
  ]);
  const [noteSaved, setNoteSaved] = useState<boolean>(false);

  const myAppointments = appointments.filter((a) => a.practitionerId === doctor.id);
  const currentApt = appointments.find((a) => a.id === selectedAptId) || myAppointments[0];
  const currentService = services.find((s) => s.id === currentApt?.serviceId);

  const cardBg = theme.cardBg;
  const subBg = theme.subBg;
  const textPrimary = theme.textPrimary;
  const textSecondary = theme.textSecondary;

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescriptionItem.trim()) return;
    setPrescriptionList([...prescriptionList, prescriptionItem.trim()]);
    showToast({
      type: 'info',
      title: 'Médicament ajouté',
      message: `${prescriptionItem.trim()} ajouté à la prescription.`
    });
    setPrescriptionItem('');
  };

  const handleSaveMedicalNote = () => {
    setNoteSaved(true);
    showToast({
      type: 'success',
      title: 'Dossier médical sauvegardé',
      message: 'Observations cliniques consignées avec succès.'
    });
    setTimeout(() => setNoteSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Doctor Header Banner */}
      <div className={`rounded-2xl p-6 border ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <img 
            src={doctor.avatar} 
            alt={doctor.name} 
            className="h-16 w-16 rounded-2xl object-cover border-2 border-sky-500/40 shadow-lg shrink-0" 
          />
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badgeInfo}`}>
                Espace Praticien / Consultation
              </span>
              <span className={`text-[10px] font-mono ${theme.accentGreen}`}>Salle : {doctor.room}</span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-black ${textPrimary} mt-1`}>
              {doctor.title} {doctor.name}
            </h1>
            <p className={`text-xs ${textSecondary}`}>
              {doctor.specialty} • File active des patients du jour (Heure de Dakar)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl border ${subBg} text-right text-xs`}>
            <span className={textSecondary}>Mes consultations du jour :</span>
            <div className={`text-xl font-black font-mono ${theme.accentSky}`}>
              {myAppointments.length} patients
            </div>
          </div>
        </div>
      </div>

      {/* Main split: Left side patients list, Right side active consultation & dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patient List (5 cols) */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border ${cardBg} space-y-4`}>
          <div className={`flex items-center justify-between border-b pb-3 ${theme.borderSubtle}`}>
            <h2 className={`font-bold text-sm ${textPrimary} flex items-center gap-2`}>
              <Stethoscope className="w-4 h-4 text-sky-500" />
              <span>Planning de Consultation</span>
            </h2>
            <span className={`text-xs font-medium ${theme.accentSky}`}>30 Septembre</span>
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
                        <h4 className={`text-xs font-bold ${textPrimary} truncate`}>{apt.patientName}</h4>
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
                        {apt.status === 'in_progress' ? 'En cours' : apt.status === 'arrived' ? 'En attente' : apt.status === 'completed' ? 'Fini' : 'Confirmé'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={`text-xs ${textSecondary} text-center py-8`}>
                Aucun rendez-vous planifié aujourd'hui pour ce praticien.
              </p>
            )}
          </div>
        </div>

        {/* Right: Active Consultation Sheet (7 cols) */}
        {currentApt ? (
          <div className={`lg:col-span-7 p-6 rounded-2xl border ${cardBg} space-y-6`}>
            {/* Header of Active Patient */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${theme.borderSubtle}`}>
              <div>
                <span className={`text-[10px] uppercase font-bold ${theme.accentSky}`}>Dossier de consultation actif</span>
                <h3 className={`text-lg font-black ${textPrimary} mt-0.5`}>
                  {currentApt.patientName}
                </h3>
                <div className={`text-xs ${textSecondary} flex items-center gap-3 mt-1`}>
                  <span className="flex items-center gap-1">
                    <Phone className={`w-3 h-3 ${theme.accentGreen}`} /> {currentApt.patientPhone}
                  </span>
                  <span>•</span>
                  <span>Réf : {currentApt.reference}</span>
                  <span>•</span>
                  <span className={theme.accentSky}>{currentService?.name}</span>
                </div>
              </div>

              {/* Status Actions for Doctor */}
              <div className="flex items-center gap-2">
                {currentApt.status !== 'in_progress' && currentApt.status !== 'completed' && (
                  <button
                    onClick={() => onUpdateStatus(currentApt.id, 'in_progress')}
                    className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Commencer</span>
                  </button>
                )}

                {currentApt.status === 'in_progress' && (
                  <button
                    onClick={() => onUpdateStatus(currentApt.id, 'completed')}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Terminer Consultation</span>
                  </button>
                )}
              </div>
            </div>

            {/* Medical Observation Input */}
            <div className="space-y-2">
              <label className={`text-xs font-bold ${textPrimary} flex items-center gap-1.5`}>
                <FileText className="w-3.5 h-3.5 text-sky-500" />
                <span>Observations cliniques & Diagnostic :</span>
              </label>
              <textarea
                rows={3}
                placeholder="Constantes (Tension, Pouls, T°), motif précis, examen clinique, diagnostic posé..."
                value={medicalNote}
                onChange={(e) => setMedicalNote(e.target.value)}
                className={`w-full rounded-xl p-3 text-xs border focus:outline-none focus:border-sky-500 transition ${theme.inputBg}`}
              />
              <div className="flex justify-between items-center text-xs">
                <span className={`text-[11px] ${textSecondary}`}>
                  Données confidentielles protégées par le secret médical (Loi CDP Sénégal).
                </span>
                <button
                  onClick={handleSaveMedicalNote}
                  className={`px-3 py-1 rounded-lg border font-medium transition ${subBg} ${theme.accentSky}`}
                >
                  {noteSaved ? '✓ Enregistré' : 'Sauvegarder notes'}
                </button>
              </div>
            </div>

            {/* Digital Prescription (Ordonnance numérique) */}
            <div className={`p-4 rounded-xl border ${subBg} space-y-3`}>
              <h4 className={`text-xs font-bold ${textPrimary} flex items-center gap-1.5`}>
                <span>💊 Ordonnance & Prescription</span>
                <span className={`text-[10px] ${textSecondary} font-normal`}>(Envoi WhatsApp / Impression)</span>
              </h4>

              <div className="space-y-1.5">
                {prescriptionList.map((item, idx) => (
                  <div key={idx} className={`p-2 rounded-lg text-xs flex justify-between items-center border ${cardBg}`}>
                    <span className={textPrimary}>• {item}</span>
                    <button
                      onClick={() => setPrescriptionList(prescriptionList.filter((_, i) => i !== idx))}
                      className="text-rose-500 hover:text-rose-400 text-[11px] font-bold p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddMedication} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ajouter un médicament, posologie..."
                  value={prescriptionItem}
                  onChange={(e) => setPrescriptionItem(e.target.value)}
                  className={`flex-1 rounded-lg px-3 py-1.5 text-xs border focus:outline-none focus:border-sky-500 transition ${theme.inputBg}`}
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-xs"
                >
                  + Ajouter
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className={`lg:col-span-7 p-12 rounded-2xl border ${cardBg} text-center ${textSecondary} text-xs`}>
            Sélectionnez un rendez-vous dans la liste pour démarrer la consultation.
          </div>
        )}
      </div>
    </div>
  );
};
