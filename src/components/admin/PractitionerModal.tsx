import React, { useState, useEffect } from 'react';
import { Practitioner } from '../../types';
import { X, UserPlus, Phone, Building2, Calendar, Check, Stethoscope } from 'lucide-react';
import { getThemeTokens } from '../../utils/themeTokens';

interface PractitionerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Practitioner, 'id'> & { id?: string }) => void;
  practitionerToEdit?: Practitioner | null;
  tenantId: string;
  isDark: boolean;
}

const COMMON_SPECIALTIES = [
  'Médecine Générale & Diabétologie',
  'Pédiatrie & Santé Néonatale',
  'Cardiologie & Hypertension',
  'Gynécologie & Obstétrique',
  'Chirurgie-Dentiste & Implantologie',
  'Ophtalmologie',
  'Dermatologie & Vénérologie',
  'Kinésithérapie & Rééducation',
  'Radiologie & Échographie'
];

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1594824813589-9831a3d90f84?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'
];

const DAYS_OF_WEEK = [
  { id: 1, label: 'Lun' },
  { id: 2, label: 'Mar' },
  { id: 3, label: 'Mer' },
  { id: 4, label: 'Jeu' },
  { id: 5, label: 'Ven' },
  { id: 6, label: 'Sam' },
  { id: 7, label: 'Dim' }
];

export const PractitionerModal: React.FC<PractitionerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  practitionerToEdit,
  tenantId,
  isDark,
}) => {
  const theme = getThemeTokens(isDark);

  const [title, setTitle] = useState('Dr.');
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState(COMMON_SPECIALTIES[0]);
  const [phone, setPhone] = useState('+221 77 000 00 00');
  const [email, setEmail] = useState('');
  const [room, setRoom] = useState('Bureau 101');
  const [avatar, setAvatar] = useState(DEFAULT_AVATARS[0]);
  const [availableDays, setAvailableDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (practitionerToEdit) {
      setTitle(practitionerToEdit.title || 'Dr.');
      setName(practitionerToEdit.name || '');
      setSpecialty(practitionerToEdit.specialty || COMMON_SPECIALTIES[0]);
      setPhone(practitionerToEdit.phone || '+221 77 000 00 00');
      setEmail(practitionerToEdit.email || '');
      setRoom(practitionerToEdit.room || 'Bureau 101');
      setAvatar(practitionerToEdit.avatar || DEFAULT_AVATARS[0]);
      setAvailableDays(practitionerToEdit.availableDays || [1, 2, 3, 4, 5]);
    } else {
      setTitle('Dr.');
      setName('');
      setSpecialty(COMMON_SPECIALTIES[0]);
      setPhone('+221 77 450 12 34');
      setEmail('');
      setRoom('Bureau 101 - RDC');
      setAvatar(DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)]);
      setAvailableDays([1, 2, 3, 4, 5]);
    }
    setErrors({});
  }, [practitionerToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleDay = (dayId: number) => {
    setAvailableDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId].sort()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Le nom du praticien est requis.';
    }
    if (!room.trim()) {
      newErrors.room = 'Le bureau ou salle de consultation est requis.';
    }
    if (availableDays.length === 0) {
      newErrors.days = 'Veuillez sélectionner au moins un jour de consultation.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: practitionerToEdit ? practitionerToEdit.id : undefined,
      tenantId,
      title,
      name: name.trim(),
      specialty,
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@sunurdv.sn`,
      room: room.trim(),
      avatar,
      availableDays,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden my-auto ${
          isDark ? 'bg-slate-900 border-slate-700/80 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 sm:px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/30 flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {practitionerToEdit ? 'Modifier la fiche praticien' : 'Ajouter un nouveau médecin / praticien'}
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Planning des vacations, bureau et spécialité médicale
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold mb-1">Titre</label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="Dr.">Dr.</option>
                <option value="Pr.">Pr.</option>
                <option value="Docteur">Docteur</option>
                <option value="Sage-femme">Sage-femme</option>
                <option value="Infirmier">Infirmier</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold mb-1">
                Nom complet <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Cheikh Oumar Sylla"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.name
                    ? 'border-rose-500'
                    : isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>
          </div>

          {/* Specialty */}
          <div>
            <label className="block text-xs font-semibold mb-1">Spécialité médicale</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              {COMMON_SPECIALTIES.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Phone & Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Téléphone direct (+221)</label>
              <input
                type="text"
                placeholder="+221 77 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm border font-mono transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Bureau / Salle <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Bureau 204 - 2ème étage"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.room
                    ? 'border-rose-500'
                    : isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              {errors.room && <p className="text-[11px] text-rose-500 mt-1">{errors.room}</p>}
            </div>
          </div>

          {/* Consultation Days */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 flex items-center justify-between">
              <span>Jours de vacation / consultation disponibles</span>
              <span className="text-[10px] text-indigo-500 font-bold">{availableDays.length} jours actifs</span>
            </label>
            <div className="flex gap-1.5">
              {DAYS_OF_WEEK.map((d) => {
                const isActive = availableDays.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDay(d.id)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : isDark ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
            {errors.days && <p className="text-[11px] text-rose-500 mt-1">{errors.days}</p>}
          </div>

          {/* Avatar choice */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">Photo de profil / Avatar</label>
            <div className="flex items-center gap-3">
              {DEFAULT_AVATARS.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Avatar option ${idx + 1}`}
                  onClick={() => setAvatar(imgUrl)}
                  className={`w-11 h-11 rounded-xl object-cover cursor-pointer border-2 transition ${
                    avatar === imgUrl ? 'border-indigo-500 ring-2 ring-indigo-500/40 scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div
            className={`pt-4 border-t flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/40 flex items-center justify-center gap-2 transition"
            >
              <Check className="w-4 h-4" />
              <span>{practitionerToEdit ? 'Mettre à jour' : 'Ajouter le praticien'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
