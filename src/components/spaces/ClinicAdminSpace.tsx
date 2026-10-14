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
  Download
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { getThemeTokens } from '../../utils/themeTokens';

interface ClinicAdminSpaceProps {
  tenant: Tenant;
  practitioners: Practitioner[];
  services: MedicalService[];
  appointments: Appointment[];
  isDark: boolean;
  onUpdateTenantSettings?: (updated: Partial<Tenant>) => void;
}

export const ClinicAdminSpace: React.FC<ClinicAdminSpaceProps> = ({
  tenant,
  practitioners,
  services,
  appointments,
  isDark,
}) => {
  const { showToast } = useToast();
  const theme = getThemeTokens(isDark);
  const [activeTab, setActiveTab] = useState<'overview' | 'practitioners' | 'services' | 'payments' | 'laravel_code'>('overview');

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
        <div className={`flex flex-wrap items-center p-1 rounded-xl border ${subBg} text-xs`}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white font-bold' : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('practitioners')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'practitioners' ? 'bg-indigo-600 text-white font-bold' : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            Médecins ({practitioners.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'services' ? 'bg-indigo-600 text-white font-bold' : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            Actes & Tarifs ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'payments' ? 'bg-indigo-600 text-white font-bold' : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            Acomptes & Wave
          </button>
          <button
            onClick={() => setActiveTab('laravel_code')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'laravel_code' ? 'bg-emerald-600 text-white font-bold' : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            Code Laravel 11 ⚡
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
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
            <button className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Ajouter un praticien</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {practitioners.map((doc) => (
              <div key={doc.id} className={`p-4 rounded-xl border ${subBg} flex items-start gap-4`}>
                <img src={doc.avatar} alt={doc.name} className="h-14 w-14 rounded-xl object-cover border border-slate-700" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-bold text-sm ${textPrimary} truncate`}>{doc.title} {doc.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${theme.badgeSuccess}`}>
                      Actif
                    </span>
                  </div>
                  <p className="text-xs text-indigo-500 font-medium">{doc.specialty}</p>
                  <p className={`text-xs ${textSecondary} mt-1 flex items-center gap-1`}>
                    <span>Bureau : {doc.room}</span>
                    <span>•</span>
                    <span className="font-mono">{doc.phone}</span>
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button className={`text-[11px] px-2.5 py-1 rounded border transition ${cardBg} ${textPrimary}`}>
                      Gérer créneaux
                    </button>
                    <button className={`text-[11px] px-2.5 py-1 rounded border transition ${cardBg} ${textPrimary}`}>
                      Modifier fiche
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES & PRICING */}
      {activeTab === 'services' && (
        <div className={`p-6 rounded-2xl border ${cardBg} space-y-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-base font-bold ${textPrimary}`}>Prestations Médicales & Tarifs en FCFA</h2>
              <p className={`text-xs ${textSecondary}`}>Chaque acte dispose de sa durée de consultation et de son acompte dédié.</p>
            </div>
            <button className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition">
              + Nouvel Acte
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${theme.borderSubtle} ${textSecondary}`}>
                  <th className="pb-3 font-semibold">Acte / Consultation</th>
                  <th className="pb-3 font-semibold">Spécialité</th>
                  <th className="pb-3 font-semibold">Durée</th>
                  <th className="pb-3 font-semibold text-right">Tarif Total (FCFA)</th>
                  <th className="pb-3 font-semibold text-right">Acompte Requis (FCFA)</th>
                  <th className="pb-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme.tableDivider}`}>
                {services.map((svc) => (
                  <tr key={svc.id} className={theme.tableRowHover}>
                    <td className={`py-3 font-bold ${textPrimary}`}>{svc.name}</td>
                    <td className="py-3 text-indigo-500 font-medium">{svc.category}</td>
                    <td className="py-3 font-mono">{svc.durationMinutes} min</td>
                    <td className={`py-3 text-right font-black font-mono ${textPrimary}`}>
                      {svc.priceXOF.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className={`py-3 text-right font-mono ${theme.accentSky}`}>
                      {svc.depositRequired ? `${svc.depositAmountXOF.toLocaleString('fr-FR')} FCFA` : 'Aucun'}
                    </td>
                    <td className="py-3 text-center">
                      <button className="text-xs text-indigo-500 hover:underline">Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* TAB 5: LARAVEL CODE DEMO */}
      {activeTab === 'laravel_code' && (
        <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
          <div>
            <h2 className={`text-base font-bold ${textPrimary} flex items-center gap-2`}>
              <span>Architecture Laravel 11 pour l'Espace Admin Cabinet</span>
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
    </div>
  );
};
