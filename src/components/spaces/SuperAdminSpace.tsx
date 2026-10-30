import React, { useState } from 'react';
import { Tenant } from '../../types';
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
  Radio
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { getThemeTokens } from '../../utils/themeTokens';

interface SuperAdminSpaceProps {
  tenants: Tenant[];
  isDark: boolean;
}

export const SuperAdminSpace: React.FC<SuperAdminSpaceProps> = ({
  tenants,
  isDark,
}) => {
  const { showToast } = useToast();
  const theme = getThemeTokens(isDark);
  const [activeTab, setActiveTab] = useState<'tenants' | 'subscriptions' | 'infrastructure'>('tenants');

  const cardBg = theme.cardBg;
  const subBg = theme.subBg;
  const textPrimary = theme.textPrimary;
  const textSecondary = theme.textSecondary;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Top Banner Context */}
      <div className={`rounded-2xl p-6 border ${cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/30 flex items-center justify-center text-3xl shrink-0">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badgePurple}`}>
                SaaS SuperAdmin Central (SunuRDV Platform)
              </span>
              <span className={`text-[10px] font-mono ${theme.accentGreen}`}>Master Level (Multi-tenant)</span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-black ${textPrimary} mt-1`}>
              Supervision de l'ensemble des Établissements
            </h1>
            <p className={`text-xs ${textSecondary}`}>
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
              onClick={() => {
                showToast({
                  type: 'info',
                  title: 'Onboarding SaaS',
                  message: 'Formulaire de création de nouveau tenant Laravel.'
                });
              }}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-xs self-start sm:self-auto"
            >
              + Onboarder nouvelle clinique
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
                  <button className={`text-xs px-2.5 py-1 rounded border transition ${subBg} ${textPrimary} hover:border-purple-500`}>
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
    </div>
  );
};
