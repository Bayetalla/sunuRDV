import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Globe, 
  UserCheck, 
  PhoneCall, 
  Stethoscope, 
  Building2, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode, 
  Copy, 
  Check, 
  HelpCircle, 
  Wrench, 
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Sparkles,
  Activity,
  Terminal
} from 'lucide-react';
import { getThemeTokens } from '../../utils/themeTokens';
import { useToast } from '../ui/Toast';
import { HttpLoggingInspector } from './HttpLoggingInspector';

export interface ArchitectureDomain {
  id: string;
  name: string;
  role: string;
  badge: string;
  badgeColor: string;
  icon: any;
  routeFile: string;
  routePrefix: string;
  urlExample: string;
  middlewares: {
    name: string;
    file: string;
    responsibility: string;
    failureAction: string;
  }[];
  controllers: {
    name: string;
    file: string;
    methods: string[];
    description: string;
  }[];
  repairGuide: {
    symptom: string;
    suspectMiddleware: string;
    diagnosticSteps: string[];
    quickFix: string;
  }[];
  codeSnippet: string;
}

export const architectureDomains: ArchitectureDomain[] = [
  {
    id: 'public',
    name: "Espace Public (Réservation en Ligne)",
    role: "Patients anonymes, visiteurs de clinique",
    badge: "Sans compte requis",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    icon: Globe,
    routeFile: "routes/public.php",
    routePrefix: "/clinique/{slug} ou /e/{slug}",
    urlExample: "https://sunurdv.sn/clinique/clinique-de-la-madeleine/reserver",
    middlewares: [
      {
        name: "IdentifyTenant",
        file: "app/Http/Middleware/IdentifyTenant.php",
        responsibility: "Résout le cabinet médical actif à partir du slug d'URL ou du sous-domaine (.sunurdv.sn), injecte l'instance Tenant dans le conteneur de services Laravel.",
        failureAction: "Lève une exception Http 404 propre si le cabinet n'existe pas ou est désactivé (is_active = false)."
      }
    ],
    controllers: [
      {
        name: "BookingWizard",
        file: "app/Livewire/Public/BookingWizard.php",
        methods: ["mount()", "selectService()", "selectSlot()", "submitBooking()"],
        description: "Gère le tunnel interactif de réservation en 4 étapes (Motif ➔ Créneau ➔ Coordonnées +221 ➔ Acompte Wave/OM)."
      },
      {
        name: "ClinicPortalController",
        file: "app/Http/Controllers/Public/ClinicPortalController.php",
        methods: ["showClinic()", "getAvailableSlots()"],
        description: "Délivre la vitrine médicale, la liste des praticiens habilités et l'API des créneaux calculés."
      }
    ],
    repairGuide: [
      {
        symptom: "Erreur 404 'Ce cabinet n'existe pas' sur une clinique pourtant créée",
        suspectMiddleware: "IdentifyTenant",
        diagnosticSteps: [
          "Vérifier dans MySQL la table 'tenants' : `SELECT id, slug, is_active FROM tenants WHERE slug = '...';`",
          "S'assurer que la colonne 'is_active' vaut bien 1 (true).",
          "Vérifier le binding de route dans bootstrap/app.php pour s'assurer que IdentifyTenant est bien déclaré."
        ],
        quickFix: "Exécuter dans Tinker : `Tenant::where('slug', 'mon-cabinet')->update(['is_active' => true]);`"
      },
      {
        symptom: "Créneaux du vendredi 14h affichés alors qu'il y a la prière du Djouma",
        suspectMiddleware: "SlotCalculatorService (invoqué par le contrôleur)",
        diagnosticSteps: [
          "Vérifier que la timezone 'Africa/Dakar' est active dans config/app.php.",
          "Inspecter la méthode `isFridayPrayerTime()` dans `SlotCalculatorService.php` (créneau 13h00-15h00)."
        ],
        quickFix: "Ajouter la condition `$dayOfWeek === Carbon::FRIDAY && $time >= '13:00' && $time <= '15:00'`."
      }
    ],
    codeSnippet: `// routes/public.php
Route::middleware(['web', 'tenant.identify'])->group(function () {
    Route::get('/clinique/{slug}', [ClinicPortalController::class, 'showClinic'])->name('public.clinic');
    Route::get('/clinique/{slug}/reserver', BookingWizard::class)->name('public.booking');
    Route::get('/confirmation/{reference}', [AppointmentConfirmationController::class, 'show'])->name('public.confirmed');
});`
  },
  {
    id: 'client',
    name: "Espace Client / Patient (Suivi & File d'attente)",
    role: "Patient authentifié par mobile Sénégal (+221)",
    badge: "Session OTP Vérifiée",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    icon: UserCheck,
    routeFile: "routes/client.php",
    routePrefix: "/patient ou /e/{slug}/patient",
    urlExample: "https://sunurdv.sn/patient/mon-rdv/SN-RDV-4829",
    middlewares: [
      {
        name: "IdentifyTenant",
        file: "app/Http/Middleware/IdentifyTenant.php",
        responsibility: "Assure que le patient consulte les rendez-vous relatifs à la clinique sélectionnée.",
        failureAction: "Redirige vers l'accueil du portail patient."
      },
      {
        name: "EnsureUserRole:client",
        file: "app/Http/Middleware/EnsureUserRole.php",
        responsibility: "Vérifie que l'utilisateur connecté est un patient légitime et empêche l'accès aux interfaces d'administration.",
        failureAction: "Redirige vers la page de connexion OTP (/patient/connexion)."
      }
    ],
    controllers: [
      {
        name: "PatientDashboard",
        file: "app/Livewire/Client/PatientDashboard.php",
        methods: ["render()", "cancelAppointment()", "reschedule()"],
        description: "Affiche l'historique des consultations, le statut d'acompte et les ordonnances téléchargeables."
      },
      {
        name: "QueueTicketController",
        file: "app/Http/Controllers/Client/QueueTicketController.php",
        methods: ["showLiveTicket()", "downloadPdf()"],
        description: "Délivre le ticket de file d'attente en temps réel avec position dynamique et heure estimée."
      }
    ],
    repairGuide: [
      {
        symptom: "Patient redirigé en boucle vers la saisie du code OTP",
        suspectMiddleware: "EnsureUserRole:client",
        diagnosticSteps: [
          "Vérifier que la session Laravel persiste bien le `user_id` et que `Auth::check()` retourne true.",
          "Vérifier que le cookie de session n'est pas bloqué par les attributs SameSite sous Chrome/Safari."
        ],
        quickFix: "Dans config/session.php, régler 'same_site' => 'lax' et 'secure' => env('APP_ENV') === 'production'."
      }
    ],
    codeSnippet: `// routes/client.php
Route::prefix('patient')->middleware(['web', 'tenant.identify', 'role:client'])->group(function () {
    Route::get('/dashboard', PatientDashboard::class)->name('client.dashboard');
    Route::get('/ticket/{reference}', [QueueTicketController::class, 'showLiveTicket'])->name('client.ticket');
    Route::get('/ordonnance/{id}/telecharger', [MedicalRecordsController::class, 'downloadPrescription'])->name('client.prescription');
});`
  },
  {
    id: 'reception',
    name: "Espace Guichet & Réception (Triage & File)",
    role: "Secrétaire médicale, hôtesse d'accueil",
    badge: "Accueil & Téléphone +221",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    icon: PhoneCall,
    routeFile: "routes/reception.php (ou routes/admin.php)",
    routePrefix: "/e/{slug}/guichet",
    urlExample: "https://sunurdv.sn/e/clinique-keur-madior/guichet",
    middlewares: [
      {
        name: "auth",
        file: "Illuminate\\Auth\\Middleware\\Authenticate",
        responsibility: "Garantit que le personnel de réception est authentifié dans le système.",
        failureAction: "Redirige vers /login avec notification d'authentification requise."
      },
      {
        name: "IdentifyTenant",
        file: "app/Http/Middleware/IdentifyTenant.php",
        responsibility: "Charge le cabinet et vérifie que la secrétaire appartient bien à cet établissement spécifique.",
        failureAction: "Refuse l'accès si `auth()->user()->tenant_id !== $tenant->id`."
      },
      {
        name: "EnsureUserRole:receptionist,admin",
        file: "app/Http/Middleware/EnsureUserRole.php",
        responsibility: "Valide les privilèges d'accueil : pointage des présences, création d'enregistrements guichet et relances WhatsApp.",
        failureAction: "Renvoie une erreur 403 Forbidden 'Accès réservé au personnel d'accueil'."
      }
    ],
    controllers: [
      {
        name: "ReceptionistController",
        file: "app/Http/Controllers/Reception/ReceptionistController.php",
        methods: ["index()", "storeWalkin()", "updateStatus()", "sendWhatsAppReminder()"],
        description: "Contrôleur gérant la file d'attente physique, les prises de RDV par appel téléphonique +221 et le pointage en salle."
      }
    ],
    repairGuide: [
      {
        symptom: "Une secrétaire reçoit '403 Forbidden' en tentant d'enregistrer un patient guichet",
        suspectMiddleware: "EnsureUserRole",
        diagnosticSteps: [
          "Inspecter la table `model_has_roles` : l'utilisateur a-t-il le rôle 'receptionist' ou 'clinic_admin' ?",
          "Inspecter la table `users` : le `tenant_id` de l'utilisatrice correspond-il exactement au tenant de l'URL ?"
        ],
        quickFix: "Exécuter : `$user->assignRole('receptionist'); $user->update(['tenant_id' => $tenant->id]);`"
      }
    ],
    codeSnippet: `// routes/reception.php
Route::prefix('guichet')->middleware(['web', 'auth', 'tenant.identify', 'role:receptionist,admin'])->group(function () {
    Route::get('/', [ReceptionistController::class, 'index'])->name('reception.index');
    Route::post('/pointage/{appointment}', [ReceptionistController::class, 'markArrived'])->name('reception.arrive');
    Route::post('/appel-physique', [ReceptionistController::class, 'storeWalkin'])->name('reception.walkin');
    Route::post('/relance-whatsapp/{appointment}', [ReceptionistController::class, 'sendReminder'])->name('reception.whatsapp');
});`
  },
  {
    id: 'doctor',
    name: "Espace Médecin (Consultations & Ordonnances)",
    role: "Médecin spécialiste, chirurgien, praticien",
    badge: "Secret Médical Garanti",
    badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    icon: Stethoscope,
    routeFile: "routes/doctor.php (ou routes/admin.php)",
    routePrefix: "/e/{slug}/medecin",
    urlExample: "https://sunurdv.sn/e/clinique-keur-madior/medecin",
    middlewares: [
      {
        name: "auth",
        file: "Illuminate\\Auth\\Middleware\\Authenticate",
        responsibility: "Authentification du praticien par email ou numéro d'Ordre des Médecins.",
        failureAction: "Redirection vers /login."
      },
      {
        name: "IdentifyTenant",
        file: "app/Http/Middleware/IdentifyTenant.php",
        responsibility: "Assure l'accès au cabinet rattaché au contrat du praticien.",
        failureAction: "403 Unauthorized si le praticien n'exerce pas dans cette clinique."
      },
      {
        name: "EnsureUserRole:doctor",
        file: "app/Http/Middleware/EnsureUserRole.php",
        responsibility: "Restreint la lecture et l'édition des observations cliniques, antécédents et ordonnances au corps médical uniquement.",
        failureAction: "403 Forbidden 'Accès réservé aux médecins habilités'."
      }
    ],
    controllers: [
      {
        name: "DoctorConsultationController",
        file: "app/Http/Controllers/Doctor/DoctorConsultationController.php",
        methods: ["agenda()", "openFile()", "saveNotes()", "issuePrescription()"],
        description: "Contrôleur du dossier médical partagé (DMP), rédaction des notes cliniques et édition d'ordonnance officielle."
      },
      {
        name: "PrescriptionController",
        file: "app/Http/Controllers/Doctor/PrescriptionController.php",
        methods: ["generatePdf()", "sendViaWhatsApp()"],
        description: "Génère l'ordonnance officielle avec en-tête de l'Ordre des Médecins du Sénégal et QR code de sécurité."
      }
    ],
    repairGuide: [
      {
        symptom: "Le Dr. Ndiaye ne voit pas les patients de sa consultation dans son agenda",
        suspectMiddleware: "Isolation par Practitioner ID (Contrôleur)",
        diagnosticSteps: [
          "Vérifier le lien dans la table `users` : le compte médecin possède-t-il `practitioner_id` non nul ?",
          "Inspecter la clause : `Appointment::where('practitioner_id', $user->practitioner_id)->whereDate('date', today())`."
        ],
        quickFix: "Lier l'utilisateur au profil praticien : `$user->update(['practitioner_id' => $practitioner->id]);`"
      }
    ],
    codeSnippet: `// routes/doctor.php
Route::prefix('medecin')->middleware(['web', 'auth', 'tenant.identify', 'role:doctor'])->group(function () {
    Route::get('/agenda', [DoctorConsultationController::class, 'agenda'])->name('doctor.agenda');
    Route::get('/consultation/{appointment}', [DoctorConsultationController::class, 'openFile'])->name('doctor.consult');
    Route::post('/consultation/{appointment}/ordonnance', [PrescriptionController::class, 'store'])->name('doctor.prescribe');
});`
  },
  {
    id: 'admin',
    name: "Espace Admin Cabinet (Direction & Comptabilité)",
    role: "Directeur de clinique, gérant de cabinet",
    badge: "Gestion & Tarifs FCFA",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    icon: Building2,
    routeFile: "routes/admin.php",
    routePrefix: "/e/{slug}/admin",
    urlExample: "https://sunurdv.sn/e/clinique-keur-madior/admin",
    middlewares: [
      {
        name: "auth",
        file: "Illuminate\\Auth\\Middleware\\Authenticate",
        responsibility: "Vérifie la session administrateur sécurisée.",
        failureAction: "Redirection vers /login."
      },
      {
        name: "IdentifyTenant",
        file: "app/Http/Middleware/IdentifyTenant.php",
        responsibility: "Charge l'entité clinique et injecte les paramètres comptables.",
        failureAction: "404 si clinique inactive."
      },
      {
        name: "EnsureUserRole:clinic_admin",
        file: "app/Http/Middleware/EnsureUserRole.php",
        responsibility: "Réservé aux administrateurs de la clinique pour éditer les tarifs, gérer les praticiens et exporter les données.",
        failureAction: "403 Forbidden 'Accès réservé à la direction de la clinique'."
      },
      {
        name: "CheckTenantSubscription",
        file: "app/Http/Middleware/CheckTenantSubscription.php",
        responsibility: "Vérifie que la clinique a bien réglé son abonnement mensuel/annuel en FCFA (Wave / Orange Money).",
        failureAction: "Redirige vers /abonnement-expire avec bouton de paiement Wave."
      }
    ],
    controllers: [
      {
        name: "ClinicAdminController",
        file: "app/Http/Controllers/Admin/ClinicAdminController.php",
        methods: ["dashboard()", "updateSettings()", "exportCsv()"],
        description: "Statistiques d'honoraires, acomptes perçus, export du registre des consultations au format Excel/CSV."
      },
      {
        name: "ServiceController",
        file: "app/Http/Controllers/Admin/ServiceController.php",
        methods: ["index()", "store()", "update()", "destroy()"],
        description: "CRUD complet des actes médicaux et gestion de la relation Many-to-Many avec les médecins."
      },
      {
        name: "PractitionerController",
        file: "app/Http/Controllers/Admin/PractitionerController.php",
        methods: ["index()", "store()", "update()", "destroy()"],
        description: "Gestion de l'équipe médicale, des jours de présence et des cabinets de consultation."
      }
    ],
    repairGuide: [
      {
        symptom: "Message 'Abonnement suspendu' alors que la clinique a payé par Wave",
        suspectMiddleware: "CheckTenantSubscription",
        diagnosticSteps: [
          "Inspecter la colonne `tenants.subscription_expires_at` : la date est-elle dépassée ?",
          "Vérifier si le webhook Wave n'a pas échoué à mettre à jour la date de renouvellement."
        ],
        quickFix: "Mettre à jour la date d'échéance : `$tenant->update(['subscription_expires_at' => now()->addMonth()]);`"
      }
    ],
    codeSnippet: `// routes/admin.php
Route::prefix('admin')->middleware(['web', 'auth', 'tenant.identify', 'role:clinic_admin', 'tenant.subscribed'])->group(function () {
    Route::get('/dashboard', [ClinicAdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::resource('services', ServiceController::class);
    Route::resource('practitioners', PractitionerController::class);
    Route::get('/export-registre-csv', [ClinicAdminController::class, 'exportCsv'])->name('admin.export_csv');
});`
  },
  {
    id: 'superadmin',
    name: "Espace SuperAdmin Plateforme (Multi-Tenant SaaS)",
    role: "Fondateur & Ingénieur Plateforme SunuRDV",
    badge: "Master Central",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    icon: Layers,
    routeFile: "routes/superadmin.php",
    routePrefix: "/superadmin",
    urlExample: "https://sunurdv.sn/superadmin/dashboard",
    middlewares: [
      {
        name: "auth",
        file: "Illuminate\\Auth\\Middleware\\Authenticate",
        responsibility: "Authentification à double facteur réservée à l'équipe centrale.",
        failureAction: "Redirection vers /login."
      },
      {
        name: "EnsureUserRole:superadmin",
        file: "app/Http/Middleware/EnsureUserRole.php",
        responsibility: "Vérifie le drapeau `is_super_admin = true` en base de données centrale. S'exécute HORS de tout scope de clinique !",
        failureAction: "403 Forbidden 'Accès réservé aux super-administrateurs de la plateforme'."
      }
    ],
    controllers: [
      {
        name: "SuperAdminController",
        file: "app/Http/Controllers/SuperAdmin/SuperAdminController.php",
        methods: ["index()", "onboardTenant()", "toggleTenant()", "checkQueues()"],
        description: "Supervision globale de toutes les cliniques du Sénégal, monitoring des queues WhatsApp et calcul du MRR en FCFA."
      }
    ],
    repairGuide: [
      {
        symptom: "SuperAdmin redirigé vers une erreur 'Tenant introuvable'",
        suspectMiddleware: "IdentifyTenant (présence erronée)",
        diagnosticSteps: [
          "Vérifier `routes/superadmin.php` : le fichier ne doit JAMAIS être wrappé dans le groupe middleware `tenant.identify` !",
          "Les routes superadmin vivent sur le domaine racine central (sunurdv.sn), pas sur un tenant."
        ],
        quickFix: "Retirer 'tenant.identify' de la définition des routes superadmin dans web.php."
      }
    ],
    codeSnippet: `// routes/superadmin.php (SUR LE DOMAINE CENTRAL)
Route::prefix('superadmin')->middleware(['web', 'auth', 'role:superadmin'])->group(function () {
    Route::get('/dashboard', [SuperAdminController::class, 'index'])->name('superadmin.index');
    Route::post('/onboarder-clinique', [SuperAdminController::class, 'onboardTenant'])->name('superadmin.onboard');
    Route::get('/queues-status', [SuperAdminController::class, 'checkQueues'])->name('superadmin.queues');
});`
  },
  {
    id: 'webhooks',
    name: "Passerelles Webhook Asynchrones (Wave & Orange Money)",
    role: "Serveurs distants Wave Sénégal & Sonatel",
    badge: "Bypass CSRF & Auth",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    icon: Zap,
    routeFile: "routes/api.php",
    routePrefix: "/api/webhooks",
    urlExample: "https://sunurdv.sn/api/webhooks/wave",
    middlewares: [
      {
        name: "VerifyWaveSignature",
        file: "app/Http/Middleware/VerifyWaveSignature.php",
        responsibility: "Valide la signature cryptographique HMAC-SHA256 envoyée dans le header HTTP `X-Wave-Signature` pour certifier l'authenticité du paiement de l'acompte.",
        failureAction: "Renvoie immédiatement un code HTTP 401 Unauthorized sans exécuter le contrôleur."
      }
    ],
    controllers: [
      {
        name: "WaveWebhookController",
        file: "app/Http/Controllers/Webhooks/WaveWebhookController.php",
        methods: ["handle()"],
        description: "Réceptionne l'acompte en FCFA, met à jour le rendez-vous à 'deposit_paid' et dispatche le job d'envoi de confirmation WhatsApp."
      }
    ],
    repairGuide: [
      {
        symptom: "Erreur 419 'Page Expired' lors des callbacks de paiement Wave",
        suspectMiddleware: "VerifyCsrfToken",
        diagnosticSteps: [
          "Wave appelle l'URL depuis ses serveurs et n'a pas de token de session CSRF Blade.",
          "Dans bootstrap/app.php, configurer l'exclusion CSRF sur les endpoints d'API."
        ],
        quickFix: "Ajouter : `->withMiddleware(function ($middleware) { $middleware->validateCsrfTokens(except: ['api/webhooks/*']); })`"
      },
      {
        symptom: "Erreur 401 'Signature invalid' reçue par Wave",
        suspectMiddleware: "VerifyWaveSignature",
        diagnosticSteps: [
          "Inspecter la variable d'environnement WAVE_WEBHOOK_SECRET dans le fichier .env.",
          "S'assurer que la clé secrète configurée dans le portail développeur Wave Sénégal correspond exactement."
        ],
        quickFix: "Exécuter 'php artisan config:clear' après avoir renseigné la bonne clé secrète dans le .env."
      }
    ],
    codeSnippet: `// routes/api.php
Route::post('/webhooks/wave', [WaveWebhookController::class, 'handle'])
    ->middleware('verify.wave.signature')
    ->name('api.webhooks.wave');

Route::post('/webhooks/orange-money', [OrangeMoneyWebhookController::class, 'handle'])
    ->middleware('verify.om.signature')
    ->name('api.webhooks.om');`
  }
];

export const ArchitectureMatrixView: React.FC<{ isDark?: boolean }> = ({ isDark = true }) => {
  const { showToast } = useToast();
  const theme = getThemeTokens(isDark);
  const [activeViewMode, setActiveViewMode] = useState<'matrix' | 'logger'>('matrix');
  const [selectedDomainId, setSelectedDomainId] = useState<string>('public');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const filteredDomains = architectureDomains.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      d.routeFile.toLowerCase().includes(q) ||
      d.middlewares.some(m => m.name.toLowerCase().includes(q) || m.responsibility.toLowerCase().includes(q)) ||
      d.controllers.some(c => c.name.toLowerCase().includes(q))
    );
  });

  const activeDomain = architectureDomains.find(d => d.id === selectedDomainId) || architectureDomains[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast({
      type: 'success',
      title: 'Routes copiées ! 🇸🇳',
      message: 'Définition de route copiée dans le presse-papier.'
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const cardBg = theme.cardBg;
  const subBg = theme.subBg;
  const textPrimary = theme.textPrimary;
  const textSecondary = theme.textSecondary;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Mode Selector: Architecture Matrix vs Logging & Tracing Console */}
      <div className={`p-1.5 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 w-full sm:w-auto self-start shadow-sm transition ${subBg}`}>
        <button
          onClick={() => setActiveViewMode('matrix')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeViewMode === 'matrix'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
              : `${textSecondary} hover:${textPrimary}`
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>Matrice & Diagnostic par Espace (7 Domaines)</span>
        </button>

        <button
          onClick={() => setActiveViewMode('logger')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeViewMode === 'logger'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
              : `${textSecondary} hover:${textPrimary}`
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Console Traçabilité HTTP (LoggingMiddleware)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-mono font-bold">
            NOUVEAU
          </span>
        </button>
      </div>

      {activeViewMode === 'logger' ? (
        <HttpLoggingInspector isDark={isDark} />
      ) : (
        <>
          {/* Header Banner */}
          <div className={`p-6 sm:p-7 rounded-2xl border shadow-xl transition-all ${cardBg}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                <ShieldCheck className="w-5 h-5 text-purple-500" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Séparation Stricte des Responsabilités • Laravel 12
                </span>
                <h1 className={`text-xl sm:text-2xl font-black ${textPrimary} mt-0.5`}>
                  Matrice Routes ➔ Middlewares ➔ Contrôleurs
                </h1>
              </div>
            </div>
            <p className={`text-xs sm:text-sm max-w-3xl leading-relaxed ${textSecondary}`}>
              Chaque espace dispose de son fichier de route étanche, de ses middlewares sentinelles et de ses contrôleurs dédiés. 
              Cette séparation permet d'<strong>isoler instantanément la cause d'un bug</strong> et de réparer sans casser les autres modules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              7 Espaces Sécurisés
            </span>
          </div>
        </div>

        {/* Global Search in Matrix */}
        <div className="mt-5 relative">
          <Search className={`w-4 h-4 absolute left-3.5 top-3 ${textSecondary}`} />
          <input
            type="text"
            placeholder="Rechercher une route (ex: routes/public.php), un middleware (ex: IdentifyTenant), ou un contrôleur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs border focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${theme.inputBg}`}
          />
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {architectureDomains.map((dom) => {
          const Icon = dom.icon;
          const isSelected = dom.id === activeDomain.id;
          return (
            <button
              key={dom.id}
              onClick={() => setSelectedDomainId(dom.id)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 border ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-950/40'
                  : `${subBg} ${textSecondary} hover:${textPrimary} border-transparent`
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{dom.name.split(' (')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Breakdown for Selected Domain */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Pipeline Flow (7 cols) */}
        <div className={`lg:col-span-7 rounded-2xl p-6 border shadow-xl space-y-6 ${cardBg}`}>
          <div className="flex items-center justify-between border-b pb-4 border-slate-700/20">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeDomain.badgeColor}`}>
                  {activeDomain.badge}
                </span>
                <span className={`text-xs font-mono ${theme.accentSky}`}>{activeDomain.routePrefix}</span>
              </div>
              <h2 className={`text-lg font-bold ${textPrimary} mt-1`}>
                {activeDomain.name}
              </h2>
              <p className={`text-xs ${textSecondary}`}>Public cible : {activeDomain.role}</p>
            </div>

            <button
              onClick={() => handleCopyCode(activeDomain.codeSnippet)}
              className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                copiedCode ? 'bg-emerald-600 text-white' : `${subBg} ${textPrimary} hover:border-purple-500`
              }`}
              title="Copier la configuration de route"
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedCode ? 'Copié' : 'Copier Route'}</span>
            </button>
          </div>

          {/* Pipeline Diagram */}
          <div className="space-y-3">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
              Chaîne de Traitement HTTP (Pipeline Séparé)
            </h3>

            <div className={`p-4 rounded-xl border space-y-4 ${subBg}`}>
              {/* Step 1: Route Entry */}
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${textPrimary}`}>Fichier de Route Dédié</span>
                    <span className="font-mono text-[11px] text-emerald-400">{activeDomain.routeFile}</span>
                  </div>
                  <p className={`text-[11px] ${textSecondary}`}>
                    Exemple d'URL : <code className="font-mono text-[10px] text-slate-300">{activeDomain.urlExample}</code>
                  </p>
                </div>
              </div>

              <div className="flex justify-center -my-2 text-slate-500">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>

              {/* Step 2: Middlewares (Gatekeepers) */}
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-purple-500/20 text-purple-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${textPrimary}`}>Sentinelles Middleware (Pipeline Laravel 12)</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono">
                      1 Global + {activeDomain.middlewares.length} Espace
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {/* Middleware 0: Global LoggingMiddleware */}
                    <div className={`p-2.5 rounded-lg border text-xs space-y-1 ${cardBg} border-emerald-500/40 bg-emerald-950/10`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 uppercase font-mono">
                            Global • 100% Requêtes
                          </span>
                          <strong className="text-emerald-400 font-mono text-xs">LoggingMiddleware</strong>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                          app/Http/Middleware/LoggingMiddleware.php
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${textSecondary}`}>
                        <strong>Rôle :</strong> Démarre le chronomètre microsecondes, génère l'UUID <code className="text-emerald-300">X-Request-Id</code>, 
                        trace l'<strong>ID du Tenant</strong>, le <strong>rôle utilisateur</strong>, l'IP cliente et journalise la latence vers <code className="text-emerald-300">storage/logs/laravel.log</code>.
                      </p>
                      <p className="text-[10px] text-purple-400 font-medium">
                        🛡️ Enregistré dans <code>bootstrap/app.php</code> via <code>$middleware-&gt;append(LoggingMiddleware::class)</code>.
                      </p>
                    </div>

                    {/* Domain-specific middlewares */}
                    {activeDomain.middlewares.map((mw, idx) => (
                      <div key={idx} className={`p-2.5 rounded-lg border text-xs space-y-1 ${cardBg} border-purple-500/30`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 uppercase font-mono">
                              Espace
                            </span>
                            <strong className="text-purple-400 font-mono text-xs">{mw.name}</strong>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">{mw.file}</span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${textSecondary}`}>
                          <strong>Rôle :</strong> {mw.responsibility}
                        </p>
                        <p className="text-[10px] text-rose-400 font-medium">
                          ⚠️ En cas d'échec : {mw.failureAction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center -my-2 text-slate-500">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>

              {/* Step 3: Controller Execution */}
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-sky-500/20 text-sky-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${textPrimary}`}>Contrôleurs & Actions Spécifiques</span>
                    <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-mono">
                      Métier Isolé
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeDomain.controllers.map((ctrl, idx) => (
                      <div key={idx} className={`p-2.5 rounded-lg border text-xs space-y-1 ${cardBg} border-sky-500/30`}>
                        <div className="flex items-center justify-between">
                          <strong className="text-sky-400 font-mono text-xs">{ctrl.name}</strong>
                          <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">{ctrl.file}</span>
                        </div>
                        <p className={`text-[11px] ${textSecondary}`}>{ctrl.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {ctrl.methods.map((m, mIdx) => (
                            <span key={mIdx} className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 font-mono text-[10px]">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Route Code Snippet */}
          <div className="space-y-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
              Extrait PHP de la Route Dédiée
            </span>
            <pre className="p-4 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
              {activeDomain.codeSnippet}
            </pre>
          </div>
        </div>

        {/* Right Column: Diagnostic & Quick Repair Guide (5 cols) */}
        <div className={`lg:col-span-5 rounded-2xl p-6 border shadow-xl space-y-5 ${cardBg}`}>
          <div className="flex items-center gap-2 border-b pb-3 border-slate-700/20">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
              <Wrench className="w-4 h-4 text-rose-500" />
            </span>
            <div>
              <h3 className={`text-sm font-bold ${textPrimary}`}>Guide de Diagnostic & Réparation</h3>
              <p className={`text-[11px] ${textSecondary}`}>Comment corriger les anomalies gérées par middleware</p>
            </div>
          </div>

          <div className="space-y-4">
            {activeDomain.repairGuide.map((repair, idx) => (
              <div key={idx} className={`p-4 rounded-xl border space-y-3 ${subBg} transition-all hover:border-slate-600`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className={`text-xs font-bold ${textPrimary}`}>{repair.symptom}</h4>
                    <span className="text-[10px] font-mono text-purple-400">
                      Sentinelle incriminée : <strong>{repair.suspectMiddleware}</strong>
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pl-6 text-xs">
                  <span className={`text-[11px] font-semibold block ${textSecondary}`}>Étapes de diagnostic :</span>
                  <ul className="space-y-1 text-[11px] list-disc list-outside text-slate-300">
                    {repair.diagnosticSteps.map((step, sIdx) => (
                      <li key={sIdx} className="leading-relaxed">{step}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider block">Solution Rapide (QuickFix) :</span>
                  <p className="font-mono text-[11px] leading-relaxed">{repair.quickFix}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-4 rounded-xl border text-xs space-y-2 ${subBg} border-indigo-500/30`}>
            <div className="flex items-center gap-2 font-bold text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Règle d'or de maintenance SunuRDV :</span>
            </div>
            <p className={`text-[11px] leading-relaxed ${textSecondary}`}>
              Si une requête échoue avec un code HTTP <strong>403 (Forbidden)</strong> ou <strong>401 (Unauthorized)</strong>, le bug ne vient JAMAIS du contrôleur ! 
              La requête a été arrêtée net au niveau du middleware sentinelle. Inspectez toujours les paramètres passés à <code>$request-&gt;user()</code> et à <code>IdentifyTenant</code> avant de toucher au contrôleur.
            </p>
          </div>
        </div>
      </div>
    </>
  )}
</div>
  );
};
