import React, { useState } from 'react';
import { Tenant, SpaceType, TenantType } from '../../types';
import { 
  ShieldAlert, 
  Layers, 
  Building2, 
  CreditCard, 
  TrendingUp, 
  Server, 
  Key, 
  Database,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  RefreshCw,
  Cpu,
  Radio,
  Plus,
  X,
  MapPin,
  Phone,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { getThemeTokens } from '../../utils/themeTokens';

interface SuperAdminSpaceProps {
  tenants: Tenant[];
  isDark: boolean;
  onOnboardTenant?: (newTenant: Tenant) => void;
  onSelectTenant?: (tenant: Tenant) => void;
  onSwitchToSpace?: (space: SpaceType) => void;
}

export const SuperAdminSpace: React.FC<SuperAdminSpaceProps> = ({
  tenants,
  isDark,
  onOnboardTenant,
  onSelectTenant,
  onSwitchToSpace,
}) => {
  const { showToast } = useToast();
  const theme = getThemeTokens(isDark);
  const [activeTab, setActiveTab] = useState<'tenants' | 'subscriptions' | 'infrastructure'>('tenants');

  // Modal State for Onboarding new clinic
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [newClinicName, setNewClinicName] = useState('');
  const [newClinicCity, setNewClinicCity] = useState('Dakar');
  const [newClinicPhone, setNewClinicPhone] = useState('33 824 00 12');
  const [newClinicAddress, setNewClinicAddress] = useState('Almadies, Dakar');
  const [newClinicType, setNewClinicType] = useState<TenantType>('medical');
  const [newClinicLogo, setNewClinicLogo] = useState('🏥');
  const [newClinicPlan, setNewClinicPlan] = useState<'starter' | 'pro' | 'hospital'>('pro');

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClinicName.trim()) return;
    const slug = newClinicName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const newTenant: Tenant = {
      id: `t-${Date.now()}`,
      slug: slug || `clinique-${Date.now()}`,
      name: newClinicName.trim(),
      type: newClinicType,
      tagline: 'Centre Médical & Spécialités • SunuRDV',
      address: newClinicAddress,
      city: newClinicCity,
      phone: `+221 ${newClinicPhone}`,
      email: `contact@${slug}.sn`,
      logo: newClinicLogo,
      accentColor: '#10b981',
      currency: 'FCFA',
      timezone: 'Africa/Dakar',
      requireDeposit: true,
      defaultDepositAmount: 5000,
      paymentMethods: ['on_site', 'wave', 'orange_money'],
      openingHours: {
        days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        start: '08:00',
        end: '18:00',
        fridayPrayerStart: '13:00',
        fridayPrayerEnd: '15:00',
      },
    };
    if (onOnboardTenant) {
      onOnboardTenant(newTenant);
      showToast({
        type: 'success',
        title: 'Clinique onboardée avec succès 🇸🇳',
        message: `${newTenant.name} (${newTenant.city}) a été créée et activée.`
      });
    }
    setIsOnboardModalOpen(false);
    setNewClinicName('');
  };

  const cardBg = theme.cardBg;
  const subBg = theme.subBg;
  const textPrimary = theme.textPrimary;
  const textSecondary = theme.textSecondary;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fadeIn pb-12 sm:pb-6">
      {/* Top Banner Context */}
      <div className={`rounded-2xl p-4 sm:p-6 border ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full md:w-auto">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/30 flex items-center justify-center text-2xl sm:text-3xl shrink-0">
            👑
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${theme.badgePurple}`}>
                SuperAdmin SaaS
              </span>
              <span className={`text-[10px] font-mono whitespace-nowrap ${theme.accentGreen}`}>Master Level (Multi-tenant)</span>
            </div>
            <h1 className={`text-lg sm:text-2xl font-black ${textPrimary} mt-1 truncate`}>
              Supervision des Établissements
            </h1>
            <p className={`text-xs ${textSecondary} line-clamp-2`}>
              Monitoring des cliniques, abonnements SaaS mensuels/annuels en FCFA, queues WhatsApp/SMS et quotas de serveurs.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex items-center p-1.5 rounded-xl border ${subBg} text-xs overflow-x-auto no-scrollbar w-full md:w-auto -mx-1 px-1 sm:mx-0 sm:px-0`}>
          <button
            onClick={() => setActiveTab('tenants')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'tenants' ? 'bg-purple-600 text-white font-bold' : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            Cliniques ({tenants.length})
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'subscriptions' ? 'bg-purple-600 text-white font-bold' : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            Abonnements SaaS FCFA
          </button>
          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition shrink-0 ${
              activeTab === 'infrastructure' ? 'bg-purple-600 text-white font-bold' : `${textSecondary} hover:${textPrimary}`
            }`}
          >
            Infra & Queues
          </button>
        </div>
      </div>

      {/* KPI Global SaaS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <span className={`text-[11px] font-medium ${textSecondary}`}>Cliniques Actives au Sénégal</span>
          <div className={`text-2xl font-black mt-1 ${textPrimary}`}>{tenants.length}</div>
          <span className={`text-[10px] font-medium ${theme.accentGreen}`}>100% opérationnelles</span>
        </div>

        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <span className={`text-[11px] font-medium ${textSecondary}`}>MRR SaaS (Revenu Mensuel)</span>
          <div className="text-xl font-black font-mono mt-1 text-purple-600 dark:text-purple-400">150 000 FCFA</div>
          <span className={`text-[10px] ${textSecondary}`}>3 x 50 000 FCFA/mois</span>
        </div>

        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <span className={`text-[11px] font-medium ${textSecondary}`}>Messages WhatsApp envoyés</span>
          <div className={`text-2xl font-black font-mono mt-1 ${theme.accentGreen}`}>1 428</div>
          <span className={`text-[10px] ${textSecondary}`}>Ce mois-ci (Cloud API)</span>
        </div>

        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <span className={`text-[11px] font-medium ${textSecondary}`}>Volume Wave / OM transité</span>
          <div className={`text-xl font-black font-mono mt-1 ${theme.accentSky}`}>2 850 000 FCFA</div>
          <span className={`text-[10px] ${theme.accentSky}`}>Acomptes de consultation</span>
        </div>
      </div>

      {/* Content depending on Tab */}
      {activeTab === 'tenants' && (
        <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className={`text-base font-bold ${textPrimary}`}>Tous les locataires multi-tenants actifs</h2>
            <button 
              onClick={() => setIsOnboardModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-xs self-start sm:self-auto flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Onboarder nouvelle clinique</span>
            </button>
          </div>

          <div className={`divide-y ${theme.tableDivider}`}>
            {tenants.map((t) => (
              <div key={t.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-2xl p-2.5 rounded-xl border shrink-0 ${subBg}`}>{t.logo}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <h4 className={`text-sm font-bold truncate ${textPrimary}`}>{t.name}</h4>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${theme.badgeSuccess}`}>
                        /e/{t.slug}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${textSecondary}`}>{t.address}, {t.city} • {t.phone}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-between sm:justify-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700/30">
                  <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">50 000 FCFA/m</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${theme.badgeSuccess}`}>
                    ✓ À jour
                  </span>
                  <button 
                    onClick={() => {
                      if (onSelectTenant) onSelectTenant(t);
                      if (onSwitchToSpace) onSwitchToSpace('clinic_admin');
                      showToast({
                        type: 'info',
                        title: 'Établissement sélectionné',
                        message: `Administration ouverte pour ${t.name}.`
                      });
                    }}
                    className={`text-xs px-2.5 py-1 rounded border transition ${subBg} ${textPrimary} hover:border-purple-500 hover:bg-purple-600/10 font-semibold`}
                  >
                    Gérer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
          <h2 className={`text-base font-bold ${textPrimary}`}>Grille Tarifaire des Abonnements SaaS (Adaptée Sénégal)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className={`p-4 rounded-xl border ${subBg} space-y-2`}>
              <span className={`text-xs font-bold uppercase ${textSecondary}`}>Starter (Indépendant)</span>
              <div className={`text-xl font-black font-mono ${textPrimary}`}>25 000 FCFA <span className={`text-xs ${textSecondary}`}>/mois</span></div>
              <ul className={`text-xs ${textSecondary} space-y-1 pt-2 border-t ${theme.borderSubtle}`}>
                <li>• 1 praticien</li>
                <li>• Prise de RDV en ligne</li>
                <li>• SMS de confirmation</li>
              </ul>
            </div>

            <div className={`p-4 rounded-xl border border-purple-500/50 space-y-2 relative ${
              isDark ? 'bg-purple-950/20' : 'bg-purple-50/60'
            }`}>
              <span className="absolute top-2 right-2 text-[10px] bg-purple-600 text-white font-bold px-2 py-0.5 rounded">Recommandé</span>
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase">Clinique Pro</span>
              <div className={`text-xl font-black font-mono ${textPrimary}`}>50 000 FCFA <span className={`text-xs ${textSecondary}`}>/mois</span></div>
              <ul className={`text-xs ${textSecondary} space-y-1 pt-2 border-t ${theme.borderSubtle}`}>
                <li>• Jusqu'à 5 praticiens</li>
                <li>• Rappels WhatsApp illimités</li>
                <li>• Module Réceptionniste & Téléphone</li>
              </ul>
            </div>

            <div className={`p-4 rounded-xl border ${subBg} space-y-2`}>
              <span className={`text-xs font-bold uppercase ${textSecondary}`}>Hôpital / Polyclinique</span>
              <div className={`text-xl font-black font-mono ${textPrimary}`}>120 000 FCFA <span className={`text-xs ${textSecondary}`}>/mois</span></div>
              <ul className={`text-xs ${textSecondary} space-y-1 pt-2 border-t ${theme.borderSubtle}`}>
                <li>• Praticiens illimités</li>
                <li>• Multi-guichets & Caisses</li>
                <li>• Support dédié 24/7 Dakar</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'infrastructure' && (
        <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className={`text-base font-bold ${textPrimary} flex items-center gap-2`}>
                <Server className="w-4 h-4 text-purple-500" />
                <span>Supervision Infrastructure & Queues Laravel 11</span>
              </h2>
              <p className={`text-xs ${textSecondary}`}>
                Workers asynchrones traitant les webhooks Wave et les messages WhatsApp/SMS.
              </p>
            </div>

            <button
              onClick={() => {
                showToast({
                  type: 'info',
                  title: 'Queue Worker actif',
                  message: '2 jobs WhatsApp traités avec succès.'
                });
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tester exécution Queue Worker</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-emerald-300 border border-slate-800 space-y-2">
            <div># Traitement asynchrone des messages WhatsApp et SMS</div>
            <div>php artisan queue:work --queue=whatsapp,sms,default --tries=3</div>
            <div className="text-slate-400">[2026-09-30 09:30:12] Processing: App\Jobs\SendAppointmentReminderJob</div>
            <div className="text-emerald-400">[2026-09-30 09:30:13] Processed:  App\Jobs\SendAppointmentReminderJob (124ms)</div>
          </div>
        </div>
      )}

      {/* Onboarding Modal for New Clinic */}
      {isOnboardModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className={`max-w-lg w-full rounded-2xl p-6 border shadow-2xl space-y-5 animate-scaleIn ${cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-700/20">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">{newClinicLogo}</span>
                <div>
                  <h3 className={`text-base font-bold ${textPrimary}`}>Onboarder un Établissement de Santé</h3>
                  <p className={`text-xs ${textSecondary}`}>Déploiement multi-tenant Laravel 12 avec base dédiée</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOnboardModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-4 text-xs">
              <div>
                <label className={`font-semibold block mb-1 ${textPrimary}`}>
                  Nom de la Clinique / Cabinet <span className="text-rose-500">*</span> :
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Polyclinique Cheikh Anta Diop"
                  value={newClinicName}
                  onChange={(e) => setNewClinicName(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${theme.inputBg}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`font-semibold block mb-1 ${textPrimary}`}>Ville (Sénégal) :</label>
                  <select
                    value={newClinicCity}
                    onChange={(e) => setNewClinicCity(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none transition ${theme.inputBg}`}
                  >
                    <option value="Dakar">Dakar</option>
                    <option value="Thiès">Thiès</option>
                    <option value="Saint-Louis">Saint-Louis</option>
                    <option value="Mbour">Mbour</option>
                    <option value="Touba">Touba</option>
                    <option value="Ziguinchor">Ziguinchor</option>
                  </select>
                </div>

                <div>
                  <label className={`font-semibold block mb-1 ${textPrimary}`}>Téléphone direct (+221) :</label>
                  <input
                    type="text"
                    required
                    placeholder="33 824 00 12"
                    value={newClinicPhone}
                    onChange={(e) => setNewClinicPhone(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 font-mono border focus:outline-none transition ${theme.inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className={`font-semibold block mb-1 ${textPrimary}`}>Adresse géographique :</label>
                <input
                  type="text"
                  placeholder="Ex: Route des Almadies, en face Pharmacie..."
                  value={newClinicAddress}
                  onChange={(e) => setNewClinicAddress(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none transition ${theme.inputBg}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`font-semibold block mb-1 ${textPrimary}`}>Logo / Icône :</label>
                  <div className="flex items-center gap-1.5">
                    {['🏥', '🩺', '🦷', '🏨', '💊'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewClinicLogo(emoji)}
                        className={`text-lg p-1.5 rounded-lg border transition ${
                          newClinicLogo === emoji ? 'border-purple-500 bg-purple-500/20' : 'border-slate-700/30'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`font-semibold block mb-1 ${textPrimary}`}>Abonnement SaaS :</label>
                  <select
                    value={newClinicPlan}
                    onChange={(e) => setNewClinicPlan(e.target.value as any)}
                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none transition ${theme.inputBg}`}
                  >
                    <option value="starter">Starter (25 000 FCFA)</option>
                    <option value="pro">Clinique Pro (50 000 FCFA)</option>
                    <option value="hospital">Hôpital (120 000 FCFA)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-700/20">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950/40 transition flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Créer et Activer la Clinique</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
