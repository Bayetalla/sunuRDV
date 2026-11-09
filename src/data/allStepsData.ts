export interface StepDetail {
  step: number;
  title: string;
  category: 'Fondations' | 'Espaces Métier' | 'Intégrations Sénégal' | 'Production & Sécurité';
  status: 'completed' | 'active' | 'ready';
  desc: string;
  whyThisChoice: string[];
  routes: string[];
  controllers: string[];
  middlewares: string[];
  keyFiles: string[];
  xamppCommands: {
    command: string;
    explanation: string;
  }[];
  testingInstructions: string[];
  troubleshooting: {
    problem: string;
    fix: string;
  }[];
}

export const allStepsData: StepDetail[] = [
  {
    step: 1,
    title: "Architecture Multi-Tenant & Routing /e/{slug}",
    category: "Fondations",
    status: "completed",
    desc: "Fondation Laravel 12 avec identification du tenant par chemin /e/{slug} et sous-domaines, isolation de session et base XAMPP MySQL.",
    whyThisChoice: [
      "Le routage par /e/{slug} fonctionne immédiatement sous Windows/XAMPP sans avoir à configurer de DNS wildcard locaux complexes.",
      "Prêt pour le basculement en sous-domaine (.sunurdv.sn) en production sans modifier le code applicatif.",
      "Timezone native 'Africa/Dakar' (GMT+0) et devise FCFA (XOF) configurées dès l'initialisation."
    ],
    routes: ["routes/web.php", "routes/public.php"],
    controllers: ["App\\Http\\Controllers\\Public\\LandingController"],
    middlewares: ["App\\Http\\Middleware\\LoggingMiddleware", "App\\Http\\Middleware\\IdentifyTenant"],
    keyFiles: ["bootstrap/app.php", "app/Http/Middleware/LoggingMiddleware.php", "config/app.php", "app/Models/Tenant.php", "database/migrations/2026_01_01_000001_create_tenants_table.php"],
    xamppCommands: [
      { command: "composer create-project laravel/laravel sunurdv \"12.*\"", explanation: "Initialise Laravel 12 sous htdocs." },
      { command: "php artisan make:model Tenant -m", explanation: "Crée le modèle Tenant et la migration." },
      { command: "php artisan make:middleware IdentifyTenant", explanation: "Génère le middleware de résolution du cabinet." },
      { command: "php artisan make:middleware LoggingMiddleware", explanation: "Génère le middleware de traçabilité des requêtes avec Tenant ID et Rôle." }
    ],
    testingInstructions: [
      "Créer un tenant 'Clinique Keur Madior' (slug: clinique-keur-madior).",
      "Accéder à http://localhost:8000/e/clinique-keur-madior pour valider l'injection du tenant.",
      "Tester un faux slug pour valider l'exception 404 propre."
    ],
    troubleshooting: [
      { problem: "Tenant non trouvé (Erreur 404)", fix: "Vérifier la colonne 'slug' et que 'is_active = 1' dans la table tenants." },
      { problem: "Session écrasée entre deux cliniques", fix: "Configurer un cookie de session préfixé par le tenant ID dans session.php." }
    ]
  },
  {
    step: 2,
    title: "Authentification OTP Mobile Sénégal (+221) & Rôles",
    category: "Fondations",
    status: "completed",
    desc: "Authentification moderne sans mot de passe via code OTP par SMS/WhatsApp (+221), gestion des sessions et rôles Spatie.",
    whyThisChoice: [
      "Les patients au Sénégal oublient fréquemment leurs mots de passe traditionnels ; le numéro mobile +221 avec code temporaire à 4 chiffres garantit 0 friction.",
      "Séparation étanche entre les profils : Patient, Réceptionniste, Praticien, Admin Clinique, SuperAdmin."
    ],
    routes: ["routes/client.php", "routes/auth.php"],
    controllers: ["App\\Http\\Controllers\\Client\\PatientAuthController", "App\\Http\\Controllers\\Auth\\OtpController"],
    middlewares: ["App\\Http\\Middleware\\EnsureUserRole", "App\\Http\\Middleware\\VerifyOtpToken"],
    keyFiles: ["app/Models/User.php", "app/Services/OtpService.php", "app/Http/Middleware/EnsureUserRole.php"],
    xamppCommands: [
      { command: "composer require spatie/laravel-permission", explanation: "Installe le moteur de rôles et permissions." },
      { command: "php artisan make:model OtpCode -m", explanation: "Table de stockage des codes OTP temporaires (validité 5 min)." }
    ],
    testingInstructions: [
      "Demander un OTP pour le numéro 77 450 12 34.",
      "Vérifier la réception du code dans les logs 'storage/logs/laravel.log'.",
      "Valider le code et vérifier la session utilisateur créée."
    ],
    troubleshooting: [
      { problem: "Numéro de téléphone rejeté", fix: "Nettoyer les espaces, tirets et préfixes internationaux pour standardiser en format 9 chiffres." },
      { problem: "Code OTP expiré", fix: "Vérifier la timezone Africa/Dakar dans config/app.php pour éviter les décalages d'horloge UTC." }
    ]
  },
  {
    step: 3,
    title: "Multi-Tenant Scoped Queries & Isolation Stricte",
    category: "Fondations",
    status: "completed",
    desc: "Traits Eloquent TenantScoped, Global Scopes automatiques garantissant qu'aucune clinique ne peut lire les dossiers d'une autre.",
    whyThisChoice: [
      "Sécurité médicale critique : isolation stricte par clause WHERE tenant_id = ? injectée automatiquement sur tous les modèles.",
      "Prévient les fuites de données même si un développeur oublie la condition manuelle dans une requête."
    ],
    routes: ["routes/admin.php"],
    controllers: ["App\\Http\\Controllers\\Admin\\ClinicAdminController"],
    middlewares: ["App\\Http\\Middleware\\IdentifyTenant", "App\\Http\\Middleware\\EnsureTenantScope"],
    keyFiles: ["app/Traits/BelongsToTenant.php", "app/Scopes/TenantScope.php"],
    xamppCommands: [
      { command: "php artisan make:scope TenantScope", explanation: "Génère le Global Scope Eloquent pour l'isolation." }
    ],
    testingInstructions: [
      "Se connecter en tant que Clinique A et tenter d'accéder à l'ID d'un rendez-vous de la Clinique B.",
      "Vérifier que la requête retourne une erreur 404 ModelNotFoundException."
    ],
    troubleshooting: [
      { problem: "Données invisibles dans le backoffice", fix: "S'assurer que le currentTenant est bien instancié dans le service container avant l'exécution des scopes." }
    ]
  },
  {
    step: 4,
    title: "Gestion des Établissements & Branding",
    category: "Espaces Métier",
    status: "completed",
    desc: "Configuration des cliniques, logo, couleurs de marque, adresse physique à Dakar/régions et coordonnées téléphoniques directes.",
    whyThisChoice: [
      "Permet à chaque structure médicale d'avoir son identité visuelle propre et personnalisée sur son portail de réservation."
    ],
    routes: ["routes/admin.php"],
    controllers: ["App\\Http\\Controllers\\Admin\\ClinicSettingsController"],
    middlewares: ["App\\Http\\Middleware\\EnsureUserRole:clinic_admin"],
    keyFiles: ["app/Models/Tenant.php", "resources/views/admin/settings.blade.php"],
    xamppCommands: [
      { command: "php artisan make:controller Admin/ClinicSettingsController", explanation: "Contrôleur de gestion du profil de la clinique." }
    ],
    testingInstructions: [
      "Mettre à jour le logo et le numéro direct dans l'Espace Admin.",
      "Vérifier le reflet immédiat sur le portail public patient."
    ],
    troubleshooting: [
      { problem: "Logo non affiché sur le portail", fix: "Exécuter 'php artisan storage:link' pour lier le stockage public sous XAMPP." }
    ]
  },
  {
    step: 5,
    title: "Utilisateurs, Rôles & Habilitations",
    category: "Espaces Métier",
    status: "completed",
    desc: "Attribution des rôles médicaux et administratifs : Directeur de clinique, Médecin spécialiste, Secrétaire de guichet, Patient.",
    whyThisChoice: [
      "Conformité avec les règles du Conseil National de l'Ordre des Médecins du Sénégal concernant l'accès aux dossiers médicaux."
    ],
    routes: ["routes/admin.php"],
    controllers: ["App\\Http\\Controllers\\Admin\\UserController"],
    middlewares: ["App\\Http\\Middleware\\EnsureUserRole:clinic_admin"],
    keyFiles: ["database/seeders/RoleAndPermissionSeeder.php", "app/Models/User.php"],
    xamppCommands: [
      { command: "php artisan db:seed --class=RoleAndPermissionSeeder", explanation: "Initialise les rôles et permissions par défaut." }
    ],
    testingInstructions: [
      "Tenter d'accéder aux ordonnances médicales avec un compte Réceptionniste.",
      "Vérifier le refus d'accès 403 Forbidden."
    ],
    troubleshooting: [
      { problem: "Rôle non reconnu après mise à jour", fix: "Exécuter 'php artisan permission:cache-reset' pour vider le cache des permissions Spatie." }
    ]
  },
  {
    step: 6,
    title: "Nomenclature des Actes Médicaux & Tarifs FCFA",
    category: "Espaces Métier",
    status: "completed",
    desc: "Catalogue des prestations (consultation générale, pédiatrie, cardiologie...), durée en minutes, prix FCFA et politique d'acompte.",
    whyThisChoice: [
      "Relation Many-to-Many entre Praticiens et Prestations permettant à plusieurs médecins d'exercer un même acte ou d'avoir des actes exclusifs."
    ],
    routes: ["routes/admin.php"],
    controllers: ["App\\Http\\Controllers\\Admin\\ServiceController"],
    middlewares: ["App\\Http\\Middleware\\EnsureUserRole:clinic_admin,doctor"],
    keyFiles: ["app/Models/Service.php", "database/migrations/2026_01_01_000003_create_services_table.php"],
    xamppCommands: [
      { command: "php artisan make:model Service -mrc", explanation: "Crée le modèle Service avec migration et contrôleur resource." }
    ],
    testingInstructions: [
      "Créer un acte 'Échographie Cardiaque' à 35 000 FCFA avec 10 000 FCFA d'acompte.",
      "Vérifier son apparition dans la grille de réservation."
    ],
    troubleshooting: [
      { problem: "Erreur montant FCFA", fix: "Stocker les montants en entiers (BIGINT ou UNSIGNED INT) en FCFA sans décimales." }
    ]
  },
  {
    step: 7,
    title: "Médecins, Spécialités & Cabinets",
    category: "Espaces Métier",
    status: "completed",
    desc: "Gestion des praticiens, numéro d'ordre des médecins, spécialité, salle/bureau d'examen et affectation aux actes.",
    whyThisChoice: [
      "Affichage clair pour les patients du médecin référent, de son cabinet et de ses compétences."
    ],
    routes: ["routes/admin.php"],
    controllers: ["App\\Http\\Controllers\\Admin\\PractitionerController"],
    middlewares: ["App\\Http\\Middleware\\EnsureUserRole:clinic_admin"],
    keyFiles: ["app/Models/Practitioner.php", "database/migrations/2026_01_01_000004_create_practitioners_table.php"],
    xamppCommands: [
      { command: "php artisan make:model Practitioner -m", explanation: "Crée le modèle Praticien et sa table relationnelle." }
    ],
    testingInstructions: [
      "Créer un praticien Dr. Ousmane Diop avec le bureau Cabinet 4.",
      "Lui affecter 3 prestations et vérifier la table pivot 'practitioner_service'."
    ],
    troubleshooting: [
      { problem: "Conflit table pivot", fix: "Vérifier la migration de la table 'practitioner_service' avec clés étrangères cascadeOnDelete." }
    ]
  },
  {
    step: 8,
    title: "Horaires Dakar, Prière Djouma & Jours Fériés",
    category: "Espaces Métier",
    status: "completed",
    desc: "Algorithme de calcul des créneaux horaires tenant compte des pauses déjeuners, de la pause Prière du Vendredi (13h-15h) et des fêtes sénégalaises.",
    whyThisChoice: [
      "Évite l'absentéisme du vendredi et respecte le calendrier des jours fériés légaux et religieux du Sénégal (Magal, Gamou, Korité, Tabaski, Pâques)."
    ],
    routes: ["routes/public.php", "routes/admin.php"],
    controllers: ["App\\Http\\Controllers\\Public\\SlotCalculatorController"],
    middlewares: ["App\\Http\\Middleware\\IdentifyTenant"],
    keyFiles: ["app/Services/SlotCalculatorService.php", "config/senegal_holidays.php"],
    xamppCommands: [
      { command: "php artisan make:service SlotCalculatorService", explanation: "Génère le moteur de calcul des créneaux disponibles." }
    ],
    testingInstructions: [
      "Sélectionner un vendredi dans le sélecteur de date.",
      "Vérifier que les créneaux entre 13h00 et 15h00 sont désactivés avec le libellé Djouma."
    ],
    troubleshooting: [
      { problem: "Jour férié non bloqué", fix: "Vérifier que la table ou le fichier de configuration des fêtes nationales contient l'année en cours." }
    ]
  },
  {
    step: 9,
    title: "Calendrier Interactif & Agenda Praticien",
    category: "Espaces Métier",
    status: "completed",
    desc: "Vue agenda quotidienne et hebdomadaire pour les médecins et secrétaires, avec filtres par praticien, statut et glisser-déposer.",
    whyThisChoice: [
      "Visibilité immédiate sur les flux de consultations pour la secrétaire d'accueil et le praticien dans son cabinet."
    ],
    routes: ["routes/admin.php", "routes/doctor.php"],
    controllers: ["App\\Http\\Controllers\\Doctor\\DoctorAgendaController", "App\\Http\\Controllers\\Reception\\AgendaController"],
    middlewares: ["App\\Http\\Middleware\\EnsureUserRole:doctor,receptionist,clinic_admin"],
    keyFiles: ["resources/views/livewire/doctor/agenda.blade.php", "app/Livewire/Doctor/Agenda.php"],
    xamppCommands: [
      { command: "php artisan make:livewire Doctor/Agenda", explanation: "Génère le composant Livewire interactif de planning." }
    ],
    testingInstructions: [
      "Ouvrir l'agenda du jour sous l'Espace Médecin.",
      "Vérifier la coloration des statuts (Confirmé, Arrivé, En consultation, Terminé)."
    ],
    troubleshooting: [
      { problem: "Erreur affichage Livewire", fix: "S'assurer que Livewire 3 scripts et styles sont bien injectés dans le layout Blade principal." }
    ]
  },
  {
    step: 10,
    title: "Tunnel de Réservation Patient Public (Mobile-First)",
    category: "Espaces Métier",
    status: "completed",
    desc: "Tunnel de réservation réactif en 4 étapes : 1. Motif/Acte ➔ 2. Date/Créneau ➔ 3. Patient +221 ➔ 4. Acompte & Confirmation.",
    whyThisChoice: [
      "Optimisé pour les smartphones Android très répandus au Sénégal, avec navigation fluide sans rechargement de page."
    ],
    routes: ["routes/public.php"],
    controllers: ["App\\Livewire\\Public\\BookingWizard", "App\\Http\\Controllers\\Public\\BookingController"],
    middlewares: ["App\\Http\\Middleware\\IdentifyTenant"],
    keyFiles: ["app/Livewire/Public/BookingWizard.php", "resources/views/livewire/public/booking-wizard.blade.php"],
    xamppCommands: [
      { command: "php artisan make:livewire Public/BookingWizard", explanation: "Crée le composant Livewire du tunnel de réservation." }
    ],
    testingInstructions: [
      "Parcourir les 4 étapes de réservation et valider.",
      "Vérifier la création de la ligne dans la table 'appointments' avec sa référence unique."
    ],
    troubleshooting: [
      { problem: "Validation étape bloquée", fix: "Vérifier les règles de validation Livewire pour le champ téléphone (+221)." }
    ]
  },
  {
    step: 11,
    title: "Notifications WhatsApp Cloud API & SMS Sénégal",
    category: "Intégrations Sénégal",
    status: "completed",
    desc: "Envoi automatique des confirmations et rappels J-1 bilingues (Français et Wolof) via WhatsApp Cloud API et passerelles SMS locales.",
    whyThisChoice: [
      "WhatsApp bénéficie d'un taux d'ouverture supérieur à 96% à Dakar, réduisant drastiquement les taux de no-show (rendez-vous non honorés)."
    ],
    routes: ["routes/admin.php"],
    controllers: ["App\\Http\\Controllers\\Admin\\NotificationTemplateController"],
    middlewares: ["App\\Http\\Middleware\\EnsureUserRole:clinic_admin"],
    keyFiles: ["app/Services/Notification/WhatsAppService.php", "app/Jobs/SendAppointmentReminderJob.php"],
    xamppCommands: [
      { command: "php artisan make:job SendAppointmentReminderJob", explanation: "Crée le job asynchrone pour l'envoi de messages WhatsApp." },
      { command: "php artisan make:service Notification/WhatsAppService", explanation: "Génère l'intégration WhatsApp Cloud API." }
    ],
    testingInstructions: [
      "Déclencher un test d'envoi de rappel WhatsApp depuis l'Espace Réceptionniste.",
      "Vérifier le template bilingue généré."
    ],
    troubleshooting: [
      { problem: "Job en timeout", fix: "Vérifier la configuration du Queue Worker ('php artisan queue:work') et les credentials Meta WhatsApp API." }
    ]
  },
  {
    step: 12,
    title: "Intégration Paiements Mobiles Wave & Orange Money",
    category: "Intégrations Sénégal",
    status: "completed",
    desc: "Passerelles de paiement d'acompte par QR code Wave Sénégal et USSD Orange Money (#144#), traitement webhook sécurisé par HMAC.",
    whyThisChoice: [
      "L'acompte de 2 000 à 5 000 FCFA engage le patient et divise par quatre les rendez-vous manqués."
    ],
    routes: ["routes/api.php", "routes/public.php"],
    controllers: ["App\\Http\\Controllers\\Webhooks\\WaveWebhookController", "App\\Http\\Controllers\\Webhooks\\OrangeMoneyWebhookController"],
    middlewares: ["App\\Http\\Middleware\\VerifyWaveSignature"],
    keyFiles: ["app/Services/Payment/WavePaymentService.php", "app/Services/Payment/OrangeMoneyPaymentService.php"],
    xamppCommands: [
      { command: "php artisan make:controller Webhooks/WaveWebhookController", explanation: "Crée le contrôleur de réception des notifications Wave." }
    ],
    testingInstructions: [
      "Simuler l'envoi d'un webhook POST Wave avec payload de succès.",
      "Vérifier le passage de l'acompte à 'deposit_paid' et le déclenchement de la confirmation."
    ],
    troubleshooting: [
      { problem: "Erreur 419 CSRF sur Webhook", fix: "Exclure impérativement 'api/webhooks/*' dans bootstrap/app.php -> validateCsrfTokens(except: [...])." },
      { problem: "Signature HMAC invalide", fix: "Comparer la signature reçue dans le header 'X-Wave-Signature' avec le hash sha256 du secret." }
    ]
  },
  {
    step: 13,
    title: "Abonnements SaaS & Facturation Multi-Cliniques",
    category: "Intégrations Sénégal",
    status: "completed",
    desc: "Gestion des formules d'abonnements mensuels/annuels en FCFA (Starter 25 000 FCFA, Clinique Pro 50 000 FCFA, Hôpital 120 000 FCFA).",
    whyThisChoice: [
      "Monétisation B2B récurrente du SaaS pour les cliniques et cabinets de santé au Sénégal."
    ],
    routes: ["routes/superadmin.php"],
    controllers: ["App\\Http\\Controllers\\SuperAdmin\\SubscriptionController"],
    middlewares: ["App\\Http\\Middleware\\EnsureSuperAdmin"],
    keyFiles: ["app/Models/Subscription.php", "app/Http/Middleware/CheckTenantSubscription.php"],
    xamppCommands: [
      { command: "php artisan make:middleware CheckTenantSubscription", explanation: "Génère le middleware de vérification d'abonnement actif." }
    ],
    testingInstructions: [
      "Simuler un tenant dont l'abonnement est expiré.",
      "Vérifier que l'accès au backoffice clinique est redirigé vers la page de régularisation."
    ],
    troubleshooting: [
      { problem: "Clinique bloquée à tort", fix: "Vérifier la colonne 'subscription_expires_at' et la date du jour Africa/Dakar." }
    ]
  },
  {
    step: 14,
    title: "Tableau de Bord Direction, KPI & Export Registre CSV",
    category: "Espaces Métier",
    status: "completed",
    desc: "Indicateurs clés : taux de présence, volume d'acomptes Wave/OM encaissés, honoraires totaux et export du registre des consultations en CSV/Excel.",
    whyThisChoice: [
      "Permet au comptable et au directeur de cabinet d'auditer les flux financiers et les présences sans saisie manuelle."
    ],
    routes: ["routes/admin.php"],
    controllers: ["App\\Http\\Controllers\\Admin\\AnalyticsController", "App\\Http\\Controllers\\Admin\\ExportController"],
    middlewares: ["App\\Http\\Middleware\\EnsureUserRole:clinic_admin"],
    keyFiles: ["app/Exports/AppointmentsExport.php", "resources/views/admin/dashboard.blade.php"],
    xamppCommands: [
      { command: "php artisan make:controller Admin/ExportController", explanation: "Génère le contrôleur d'export CSV encodé UTF-8." }
    ],
    testingInstructions: [
      "Cliquer sur 'Exporter Registre CSV' dans l'Espace Admin.",
      "Vérifier que le fichier généré contient bien les colonnes Patient, Téléphone, Acte, Praticien et Montant FCFA."
    ],
    troubleshooting: [
      { problem: "Caractères accentués cassés dans Excel", fix: "Ajouter le BOM UTF-8 (\\xEF\\xBB\\xBF) au tout début du flux CSV généré." }
    ]
  },
  {
    step: 15,
    title: "Sécurité & Conformité Données de Santé Sénégal (CDP)",
    category: "Production & Sécurité",
    status: "completed",
    desc: "Chiffrement des observations médicales, journalisation d'audit des consultations, conformité avec la Commission des Données Personnelles du Sénégal (CDP).",
    whyThisChoice: [
      "Obligation légale sénégalaise (Loi 2008-12) protégeant les données à caractère personnel et le secret médical."
    ],
    routes: ["routes/doctor.php", "routes/admin.php"],
    controllers: ["App\\Http\\Controllers\\Doctor\\ConsultationRecordController"],
    middlewares: ["App\\Http\\Middleware\\EnsureUserRole:doctor"],
    keyFiles: ["app/Models/ConsultationRecord.php", "app/Observers/MedicalAuditObserver.php"],
    xamppCommands: [
      { command: "php artisan make:observer MedicalAuditObserver --model=ConsultationRecord", explanation: "Trace tout accès ou modification aux fiches médicales." }
    ],
    testingInstructions: [
      "Modifier une observation clinique sous l'Espace Médecin.",
      "Vérifier la création d'un enregistrement d'audit avec timestamp Dakar et ID du praticien."
    ],
    troubleshooting: [
      { problem: "Déchiffrement impossible", fix: "Ne jamais changer la clé APP_KEY dans .env après chiffrement en base de données." }
    ]
  },
  {
    step: 16,
    title: "Tests Automatisés Pest / PHPUnit",
    category: "Production & Sécurité",
    status: "completed",
    desc: "Suite de tests unitaires et fonctionnels : isolation multi-tenant, prise de rendez-vous, validation OTP, et sécurité des webhooks Wave.",
    whyThisChoice: [
      "Garantit la non-régression lors des déploiements et mises à jour de Laravel 12."
    ],
    routes: ["routes/web.php", "routes/api.php"],
    controllers: ["Tests\\Feature\\BookingTest", "Tests\\Feature\\TenantIsolationTest"],
    middlewares: ["App\\Http\\Middleware\\IdentifyTenant", "App\\Http\\Middleware\\EnsureUserRole"],
    keyFiles: ["tests/Feature/TenantIsolationTest.php", "tests/Feature/WaveWebhookTest.php"],
    xamppCommands: [
      { command: "php artisan test", explanation: "Lance l'ensemble des tests Pest / PHPUnit." }
    ],
    testingInstructions: [
      "Lancer 'php artisan test --filter TenantIsolationTest'.",
      "Vérifier que les assertions passent à 100% au vert."
    ],
    troubleshooting: [
      { problem: "Base de test écrasée", fix: "Configurer une base SQLite en mémoire dans phpunit.xml pour les tests rapides sans impacter MySQL XAMPP." }
    ]
  },
  {
    step: 17,
    title: "Déploiement VPS Ubuntu, Nginx, SSL & Supervisor",
    category: "Production & Sécurité",
    status: "completed",
    desc: "Mise en production sur serveur VPS : configuration Nginx multi-domaines, certificat SSL Let's Encrypt, supervisor pour les queues WhatsApp et Cron Dakar.",
    whyThisChoice: [
      "Hébergement souverain haute disponibilité avec temps de réponse ultra-rapide depuis Dakar."
    ],
    routes: ["routes/web.php"],
    controllers: ["App\\Console\\Kernel"],
    middlewares: ["App\\Http\\Middleware\\TrustProxies"],
    keyFiles: ["nginx/sunurdv.conf", "supervisor/sunurdv-worker.conf"],
    xamppCommands: [
      { command: "php artisan config:cache && php artisan route:cache && php artisan view:cache", explanation: "Optimise Laravel pour la production." },
      { command: "sudo supervisorctl status", explanation: "Vérifie l'exécution continue des workers de rappels WhatsApp." }
    ],
    testingInstructions: [
      "Effectuer un appel HTTPS vers l'URL de production.",
      "Vérifier la note SSL A+ et l'exécution du cron des rappels à 08h00 heure de Dakar."
    ],
    troubleshooting: [
      { problem: "Queue WhatsApp bloquée après redémarrage", fix: "Configurer Supervisor avec autostart=true et autorestart=true dans /etc/supervisor/conf.d/." }
    ]
  }
];
