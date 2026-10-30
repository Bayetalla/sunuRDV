import React, { useState, useEffect } from 'react';
import { MedicalService, Practitioner } from '../../types';
import { X, Clock, Banknote, ShieldAlert, Check, Plus, Trash2, Users, FileText, Tag } from 'lucide-react';
import { getThemeTokens } from '../../utils/themeTokens';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (serviceData: Omit<MedicalService, 'id'> & { id?: string }) => void;
  serviceToEdit?: MedicalService | null;
  practitioners: Practitioner[];
  tenantId: string;
  isDark: boolean;
  preselectedPractitionerId?: string;
}

const COMMON_CATEGORIES = [
  'Médecine Générale',
  'Pédiatrie',
  'Cardiologie',
  'Gynécologie & Obstétrique',
  'Chirurgie & Urgences',
  'Dermatologie',
  'Ophtalmologie',
  'Hygiène & Soins Dentaires',
  'Imagerie & Échographie',
  'Laboratoire & Analyses',
  'Kinésithérapie'
];

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  serviceToEdit,
  practitioners,
  tenantId,
  isDark,
  preselectedPractitionerId,
}) => {
  const theme = getThemeTokens(isDark);

  const [name, setName] = useState('');
  const [category, setCategory] = useState(COMMON_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [priceXOF, setPriceXOF] = useState(15000);
  const [depositRequired, setDepositRequired] = useState(true);
  const [depositAmountXOF, setDepositAmountXOF] = useState(5000);
  const [selectedPractitionerIds, setSelectedPractitionerIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name);
      setCategory(serviceToEdit.category || COMMON_CATEGORIES[0]);
      setDescription(serviceToEdit.description || '');
      setDurationMinutes(serviceToEdit.durationMinutes || 30);
      setPriceXOF(serviceToEdit.priceXOF || 0);
      setDepositRequired(Boolean(serviceToEdit.depositRequired));
      setDepositAmountXOF(serviceToEdit.depositAmountXOF || 0);
      setSelectedPractitionerIds(serviceToEdit.practitionerIds || []);
    } else {
      setName('');
      setCategory(COMMON_CATEGORIES[0]);
      setDescription('');
      setDurationMinutes(30);
      setPriceXOF(15000);
      setDepositRequired(true);
      setDepositAmountXOF(5000);
      setSelectedPractitionerIds(
        preselectedPractitionerId ? [preselectedPractitionerId] : practitioners.map(p => p.id)
      );
    }
    setErrors({});
  }, [serviceToEdit, isOpen, preselectedPractitionerId, practitioners]);

  if (!isOpen) return null;

  const togglePractitioner = (pId: string) => {
    setSelectedPractitionerIds(prev => 
      prev.includes(pId) ? prev.filter(id => id !== pId) : [...prev, pId]
    );
  };

  const handleSelectAllPractitioners = () => {
    if (selectedPractitionerIds.length === practitioners.length) {
      setSelectedPractitionerIds([]);
    } else {
      setSelectedPractitionerIds(practitioners.map(p => p.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Le nom du service est requis.';
    }
    if (durationMinutes < 5) {
      newErrors.durationMinutes = 'La durée minimale est de 5 minutes.';
    }
    if (priceXOF < 0) {
      newErrors.priceXOF = 'Le prix ne peut pas être négatif.';
    }
    if (depositRequired && depositAmountXOF > priceXOF) {
      newErrors.depositAmountXOF = "L'acompte ne peut pas excéder le tarif total.";
    }
    if (selectedPractitionerIds.length === 0) {
      newErrors.practitioners = 'Veuillez assigner au moins un praticien à cet acte.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: serviceToEdit ? serviceToEdit.id : undefined,
      tenantId,
      name: name.trim(),
      category,
      description: description.trim(),
      durationMinutes: Number(durationMinutes),
      priceXOF: Number(priceXOF),
      depositRequired,
      depositAmountXOF: depositRequired ? Number(depositAmountXOF) : 0,
      practitionerIds: selectedPractitionerIds,
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden my-auto ${
          isDark 
            ? 'bg-slate-900 border-slate-700/80 text-slate-100' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`px-5 sm:px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Tag className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base sm:text-lg font-bold">
                {serviceToEdit ? 'Modifier la prestation médicale' : 'Créer un nouveau service'}
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Tarifs en FCFA, durée et affectation multi-praticiens (Relation Many-to-Many)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            aria-label="Fermer la fenêtre modale"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Service Name */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">
              Intitulé de la consultation ou de l'acte <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Consultation Pédiatrique & Suivi Nourrisson"
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.name 
                  ? 'border-rose-500 ring-1 ring-rose-500' 
                  : isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Category & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Spécialité / Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                {COMMON_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 flex items-center justify-between">
                <span>Durée du créneau (minutes) <span className="text-rose-500">*</span></span>
                <span className="font-mono text-emerald-500 font-bold">{durationMinutes} min</span>
              </label>
              <div className="flex gap-2">
                {[15, 20, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl border transition ${
                      durationMinutes === mins
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
              {errors.durationMinutes && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.durationMinutes}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">
              Description de l'acte (visible par le patient lors de la réservation)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Examen clinique approfondi, ordonnance, conseils de santé préventive et suivi personnalisé."
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {/* Pricing & Deposit (FCFA) */}
          <div className={`p-4 rounded-xl border space-y-4 ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Banknote className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                Tarification en Francs CFA (XOF)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Honoraires / Tarif Total (FCFA) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="500"
                    min="0"
                    value={priceXOF}
                    onChange={(e) => setPriceXOF(Number(e.target.value))}
                    className={`w-full pl-3.5 pr-14 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold border transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.priceXOF 
                        ? 'border-rose-500 ring-1 ring-rose-500' 
                        : isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                    FCFA
                  </span>
                </div>
                {errors.priceXOF && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.priceXOF}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold">
                    Acompte en ligne (Wave / OM)
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={depositRequired}
                      onChange={(e) => setDepositRequired(e.target.checked)}
                      className="rounded accent-emerald-500 cursor-pointer h-4 w-4"
                    />
                    <span className="text-[11px] font-medium text-emerald-500">Exiger</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="500"
                    min="0"
                    disabled={!depositRequired}
                    value={depositRequired ? depositAmountXOF : 0}
                    onChange={(e) => setDepositAmountXOF(Number(e.target.value))}
                    className={`w-full pl-3.5 pr-14 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold border transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      !depositRequired
                        ? 'opacity-40 cursor-not-allowed bg-slate-800 border-slate-700'
                        : errors.depositAmountXOF
                          ? 'border-rose-500 ring-1 ring-rose-500'
                          : isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                    FCFA
                  </span>
                </div>
                {errors.depositAmountXOF && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.depositAmountXOF}</p>
                )}
              </div>
            </div>
          </div>

          {/* Practitioners Assignment (Many-to-Many Relationship) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-500" />
                <span>Praticiens habilités à dispenser cet acte (Relation Many-to-Many) <span className="text-rose-500">*</span></span>
              </label>
              <button
                type="button"
                onClick={handleSelectAllPractitioners}
                className="text-[11px] font-semibold text-emerald-500 hover:underline"
              >
                {selectedPractitionerIds.length === practitioners.length ? 'Tout décocher' : 'Tout sélectionner'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-1">
              {practitioners.map((prat) => {
                const isSelected = selectedPractitionerIds.includes(prat.id);
                return (
                  <div
                    key={prat.id}
                    onClick={() => togglePractitioner(prat.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? isDark
                          ? 'bg-sky-950/50 border-sky-500 ring-1 ring-sky-500/30'
                          : 'bg-sky-50 border-sky-400 ring-1 ring-sky-400/30'
                        : isDark
                          ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={prat.avatar}
                        alt={prat.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{prat.title} {prat.name}</p>
                        <p className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {prat.specialty}
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition ${
                      isSelected
                        ? 'bg-sky-600 border-sky-500 text-white'
                        : isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.practitioners && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.practitioners}</p>
            )}
          </div>

          {/* Modal Actions */}
          <div className={`pt-4 border-t flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
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
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition"
            >
              <Check className="w-4 h-4" />
              <span>{serviceToEdit ? 'Mettre à jour la prestation' : 'Enregistrer la prestation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
