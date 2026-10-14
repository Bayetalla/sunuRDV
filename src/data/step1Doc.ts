export interface CodeFile {
  path: string;
  description: string;
  code: string;
  language: string;
}

export interface StepGuide {
  stepNumber: number;
  title: string;
  subtitle: string;
  whyThisChoice: string[];
  directoryTree: string;
  files: CodeFile[];
  xamppCommands: {
    title: string;
    command: string;
    explanation: string;
  }[];
  testingInstructions: string[];
  commonErrors: {
    error: string;
    cause: string;
    solution: string;
  }[];
}

export const step1Data: StepGuide = {
  stepNumber: 1,
  title: "Architecture du Projet SaaS & Multi-tenant (Laravel 11 / XAMPP)",
  subtitle: "Fondation solide, modulaire et adaptée aux réalités du Sénégal",
  whyThisChoice: [
    "Pourquoi Laravel 11 ? C'est la dernière version stable de référence. Elle est ultra-légère (plus de Kernel.php lourd, configuration simplifiée dans bootstrap/app.php), robuste et idéale pour une maintenance aisée.",
    "Pourquoi le Multi-tenant par chemin d'URL (/e/{slug}) au départ ? Au Sénégal, les petites cliniques et salons n'ont pas tous leur propre nom de domaine configuré avec des DNS complexes (*.votredomaine.sn). Le routage par chemin évite les certificats SSL wildcard compliqués en dev et fonctionne immédiatement en local avec XAMPP.",
    "Architecture prête pour les sous-domaines : Le TenantMiddleware isole le contexte de la clinique dès l'entrée de la requête HTTP. Si demain on active les sous-domaines (ex: keurmadior.sunurdv.sn), seule une ligne dans la configuration change !",
    "Stack Blade + Livewire + Alpine.js + Tailwind : Pas d'API React/Vue découplée à maintenir avec des tokens JWT complexes. Tout reste dans l'écosystème Laravel, idéal pour un développeur junior.",
    "Adaptation Sénégal dès la base : Timezone configurée sur 'Africa/Dakar', devise 'FCFA' (XOF), encodage UTF-8 pour supporter les caractères spéciaux wolof et français, et structure de base de données pensée pour les numéros de téléphone +221."
  ],
  directoryTree: `sunurdv/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── BookingController.php          # Prise de RDV publique
│   │   │   ├── DashboardController.php        # Backoffice clinique
│   │   │   └── ReceptionistController.php     # Guichet & Téléphone
│   │   └── Middleware/
│   │       └── IdentifyTenant.php             # Résolution du tenant /e/{slug}
│   ├── Models/
│   │   ├── Tenant.php                         # Modèle Clinique / Entreprise
│   │   ├── User.php                           # Médecins, Réceptionnistes, Admins
│   │   ├── Practitioner.php                   # Praticiens & Spécialités
│   │   ├── Service.php                        # Prestations & Tarifs FCFA
│   │   └── Appointment.php                    # Rendez-vous & Acomptes
│   └── Services/                              # Abstraction métier
│       ├── Payment/
│       │   ├── PaymentGatewayInterface.php    # Interface Wave, Orange Money, Free
│       │   └── WavePaymentGateway.php
│       └── Notification/
│           ├── NotificationChannelInterface.php # Interface WhatsApp / SMS
│           └── WhatsAppChannel.php
├── bootstrap/
│   └── app.php                                # Configuration Laravel 11 & Middleware
├── config/
│   ├── app.php                                # Timezone: 'Africa/Dakar'
│   └── sunurdv.php                            # Paramètres SaaS (devises, indicatif +221)
├── database/
│   ├── migrations/
│   │   ├── 2026_01_01_000001_create_tenants_table.php
│   │   └── 2026_01_01_000002_create_users_table.php
│   └── seeders/
│       └── DatabaseSeeder.php                 # Données de démo cliniques Dakar
├── routes/
│   └── web.php                                # Routes SaaS & routes /e/{tenant:slug}
└── .env                                       # Configuration MySQL XAMPP & Dakar`,
  files: [
    {
      path: ".env",
      description: "Fichier d'environnement configuré pour XAMPP local (MySQL port 3306, base sunurdv_db) et fuseau Africa/Dakar.",
      language: "ini",
      code: `APP_NAME="SunuRDV"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE="Africa/Dakar"
APP_URL=http://localhost:8000
APP_LOCALE=fr
APP_FALLBACK_LOCALE=fr

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

# Configuration Base de données XAMPP
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sunurdv_db
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

QUEUE_CONNECTION=database

# Paramètres spécifiques Sénégal
SUNURDV_DEFAULT_CURRENCY=FCFA
SUNURDV_DEFAULT_COUNTRY_CODE=+221
SUNURDV_TIMEZONE="Africa/Dakar"
`
    },
    {
      path: "config/sunurdv.php",
      description: "Configuration globale du SaaS : devises, pays supportés, passerelles de paiement prévues et fuseau horaire.",
      language: "php",
      code: `<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Paramètres Généraux SunuRDV Sénégal
    |--------------------------------------------------------------------------
    */
    'currency' => env('SUNURDV_DEFAULT_CURRENCY', 'FCFA'),
    'country_code' => env('SUNURDV_DEFAULT_COUNTRY_CODE', '+221'),
    'timezone' => env('SUNURDV_TIMEZONE', 'Africa/Dakar'),

    /*
    |--------------------------------------------------------------------------
    | Opérateurs Mobiles reconnus au Sénégal
    |--------------------------------------------------------------------------
    | Utilisé pour valider et formater les numéros locaux :
    | 77 & 78 = Orange, 76 = Free, 70 = Expresso, 75 = Promobile/Wave
    */
    'phone_prefixes' => ['77', '78', '76', '70', '75'],

    /*
    |--------------------------------------------------------------------------
    | Modes de paiement supportés
    |--------------------------------------------------------------------------
    */
    'payment_gateways' => [
        'on_site' => [
            'label' => 'Paiement au comptoir (Espèces)',
            'enabled' => true,
        ],
        'wave' => [
            'label' => 'Wave Sénégal',
            'enabled' => env('WAVE_ENABLED', true),
        ],
        'orange_money' => [
            'label' => 'Orange Money Sénégal',
            'enabled' => env('ORANGE_MONEY_ENABLED', true),
        ],
        'free_money' => [
            'label' => 'Free Money',
            'enabled' => env('FREE_MONEY_ENABLED', false),
        ],
    ],
];
`
    },
    {
      path: "database/migrations/2026_01_01_000001_create_tenants_table.php",
      description: "Migration de la table des entreprises/cliniques locataires (multi-tenant).",
      language: "php",
      code: `<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name');                         // Ex: Clinique Keur Madior
            $table->string('slug')->unique();               // Ex: clinique-keur-madior
            $table->string('type')->default('medical');     // medical, dental, salon, auto
            $table->string('phone')->nullable();            // +221 33 820 12 34
            $table->string('email')->nullable();
            $table->string('address')->nullable();          // Almadies, Dakar
            $table->string('city')->default('Dakar');
            $table->string('timezone')->default('Africa/Dakar');
            $table->string('currency')->default('FCFA');
            $table->boolean('require_deposit')->default(false); // Acompte obligatoire ou non
            $table->integer('default_deposit_amount')->default(0); // Montant acompte en FCFA
            $table->json('settings')->nullable();           // Horaires, couleurs, canaux actifs
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
`
    },
    {
      path: "app/Models/Tenant.php",
      description: "Modèle Eloquent Tenant avec casts JSON et relations.",
      language: "php",
      code: `<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'type',
        'phone',
        'email',
        'address',
        'city',
        'timezone',
        'currency',
        'require_deposit',
        'default_deposit_amount',
        'settings',
        'is_active',
    ];

    protected $casts = [
        'require_deposit' => 'boolean',
        'default_deposit_amount' => 'integer',
        'is_active' => 'boolean',
        'settings' => 'array',
    ];

    /**
     * Utiliser le slug plutôt que l'ID dans les routes implicites (/e/{tenant:slug})
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
`
    },
    {
      path: "app/Http/Middleware/IdentifyTenant.php",
      description: "Middleware d'isolation : extrait le tenant via le paramètre de route /e/{tenant} et le partage à l'application.",
      language: "php",
      code: `<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IdentifyTenant
{
    /**
     * Résout l'entreprise/clinique active et l'injecte dans le conteneur de services
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Récupérer le paramètre de route {tenant}
        $tenantParam = $request->route('tenant');

        if ($tenantParam) {
            // Si c'est déjà une instance de Tenant (Route Model Binding)
            $tenant = $tenantParam instanceof Tenant 
                ? $tenantParam 
                : Tenant::where('slug', $tenantParam)->first();

            if (!$tenant || !$tenant->is_active) {
                abort(404, "Ce cabinet ou établissement n'existe pas ou a été désactivé.");
            }

            // 2. Enregistrer le tenant comme singleton dans le Container Laravel
            app()->instance(Tenant::class, $tenant);
            app()->instance('currentTenant', $tenant);

            // 3. Partager avec toutes les vues Blade automatiquement
            view()->share('currentTenant', $tenant);
        }

        return $next($request);
    }
}
`
    },
    {
      path: "bootstrap/app.php",
      description: "Point d'entrée Laravel 11 pour enregistrer notre middleware IdentifyTenant.",
      language: "php",
      code: `<?php

use App\Http\Middleware\IdentifyTenant;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Enregistrement de l'alias de middleware
        $middleware->alias([
            'tenant' => IdentifyTenant::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
`
    },
    {
      path: "routes/web.php",
      description: "Fichier de routes principal avec la séparation claire des espaces : Client (Public), Réception, Médecin, Direction Cabinet et SuperAdmin.",
      language: "php",
      code: `<?php

use App\Models\Tenant;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| 1. Landing Page Plateforme SaaS (sunurdv.sn)
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return view('welcome', [
        'demoTenants' => Tenant::where('is_active', true)->get()
    ]);
})->name('home');

/*
|--------------------------------------------------------------------------
| 2. Espace SuperAdmin Plateforme SaaS (Master / Global)
|--------------------------------------------------------------------------
| Supervision globale de toutes les cliniques, abonnements mensuels FCFA,
| passerelles Wave et serveurs.
*/
Route::prefix('superadmin')
    ->middleware(['auth', 'role:superadmin'])
    ->name('superadmin.')
    ->group(function () {
        Route::get('/', [SuperAdminController::class, 'dashboard'])->name('dashboard');
        Route::resource('tenants', TenantManagementController::class);
        Route::get('/subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions');
});

/*
|--------------------------------------------------------------------------
| 3. Espaces Établissement (Multi-tenant par chemin /e/{slug})
|--------------------------------------------------------------------------
| Découpage distinct selon les rôles du personnel et les patients :
*/
Route::prefix('e/{tenant:slug}')
    ->middleware(['tenant'])
    ->name('tenant.')
    ->group(function () {
        
        // A. ESPACE CLIENT / PATIENT (Public, mobile-first, sans mot de passe, code OTP +221)
        Route::get('/', [BookingController::class, 'index'])->name('booking.index');
        Route::post('/book', [BookingController::class, 'store'])->name('booking.store');
        Route::get('/confirmation/{appointment:reference}', [BookingController::class, 'confirmation'])->name('booking.confirmation');

        // B. ESPACE RÉCEPTION & GUICHET (Accueil téléphonique & physique, gestion salle d'attente)
        Route::prefix('reception')
            ->middleware(['auth', 'role:receptionist,admin'])
            ->name('reception.')
            ->group(function () {
                Route::get('/', [ReceptionController::class, 'index'])->name('index');
                Route::post('/quick-book', [ReceptionController::class, 'quickBook'])->name('quick_book');
                Route::patch('/appointments/{appointment}/status', [ReceptionController::class, 'updateStatus'])->name('status');
                Route::post('/appointments/{appointment}/whatsapp-reminder', [ReceptionController::class, 'sendReminder'])->name('reminder');
            });

        // C. ESPACE MÉDECIN / PRATICIEN (Consultations, antécédents, ordonnances numériques)
        Route::prefix('praticien')
            ->middleware(['auth', 'role:doctor,admin'])
            ->name('doctor.')
            ->group(function () {
                Route::get('/consultations', [DoctorController::class, 'agenda'])->name('agenda');
                Route::get('/consultation/{appointment}', [DoctorController::class, 'consultation'])->name('consultation');
                Route::post('/consultation/{appointment}/prescribe', [DoctorController::class, 'savePrescription'])->name('prescribe');
            });

        // D. ESPACE DIRECTION & ADMIN CABINET (Tarifs FCFA, médecins, acomptes Wave/OM)
        Route::prefix('admin')
            ->middleware(['auth', 'role:admin'])
            ->name('admin.')
            ->group(function () {
                Route::get('/dashboard', [ClinicAdminController::class, 'index'])->name('dashboard');
                Route::post('/settings', [ClinicAdminController::class, 'updateSettings'])->name('settings.update');
                Route::resource('/practitioners', PractitionerController::class);
                Route::resource('/services', ServiceController::class);
            });
});
`
    }
  ],
  xamppCommands: [
    {
      title: "1. Création du projet Laravel 11 sous Windows",
      command: "cd C:\\xampp\\htdocs\ncomposer create-project laravel/laravel sunurdv \"11.*\"\ncd sunurdv",
      explanation: "Télécharge un projet Laravel 11 propre dans votre dossier htdocs de XAMPP."
    },
    {
      title: "2. Création de la base de données MySQL dans XAMPP",
      command: "mysql -u root -e \"CREATE DATABASE IF NOT EXISTS sunurdv_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\"",
      explanation: "Crée la base de données MySQL avec le support complet des caractères accentués et emojis (utf8mb4)."
    },
    {
      title: "3. Génération de la clé d'application et création des fichiers",
      command: "php artisan key:generate\nphp artisan make:model Tenant -m\nphp artisan make:middleware IdentifyTenant",
      explanation: "Génère la clé APP_KEY dans .env, crée le modèle Tenant avec sa migration (-m) et le middleware d'isolation."
    },
    {
      title: "4. Exécution des migrations",
      command: "php artisan migrate",
      explanation: "Applique la table 'tenants' ainsi que les tables système (sessions, jobs, users) dans MySQL."
    },
    {
      title: "5. Lancement du serveur de développement local",
      command: "php artisan serve --port=8000",
      explanation: "Démarre le serveur local. L'application est alors accessible sur http://localhost:8000."
    }
  ],
  testingInstructions: [
    "Démarrer Apache et MySQL depuis le panneau de contrôle XAMPP (Control Panel). Les deux boutons doivent être sur fond vert.",
    "Créer un premier enregistrement de test dans la table 'tenants' (via phpMyAdmin à l'adresse http://localhost/phpmyadmin ou via tinker : php artisan tinker puis Tenant::create(['name' => 'Clinique Keur Madior', 'slug' => 'clinique-keur-madior', 'city' => 'Dakar'])).",
    "Ouvrir votre navigateur à l'adresse : http://localhost:8000/e/clinique-keur-madior",
    "Résultat attendu : La page affiche avec succès 'Bienvenue sur l'espace de prise de RDV : Clinique Keur Madior (Dakar)'.",
    "Tester avec un faux slug : http://localhost:8000/e/cabinet-inexistant",
    "Résultat attendu : Erreur 404 propre 'Ce cabinet ou établissement n'existe pas ou a été désactivé.'"
  ],
  commonErrors: [
    {
      error: "SQLSTATE[HY000] [2002] No connection could be made because the target machine actively refused it",
      cause: "Le service MySQL de XAMPP n'est pas démarré ou écoute sur un port différent de 3306.",
      solution: "Ouvrez XAMPP Control Panel et cliquez sur 'Start' devant MySQL. Si le port est 3307 au lieu de 3306, modifiez DB_PORT=3307 dans votre fichier .env."
    },
    {
      error: "Call to undefined function Illuminate\\Database\\Connectors\\... pdo_mysql",
      cause: "L'extension pdo_mysql est désactivée dans le fichier php.ini de votre PHP sous Windows.",
      solution: "Ouvrez C:\\xampp\\php\\php.ini, cherchez la ligne ';extension=pdo_mysql' et retirez le point-virgule ';' au début, puis sauvegardez et redémarrez Apache."
    },
    {
      error: "Target class [IdentifyTenant] does not exist",
      cause: "Le middleware n'a pas été enregistré correctement avec son namespace complet dans bootstrap/app.php.",
      solution: "Vérifiez que vous avez bien importé 'use App\\Http\\Middleware\\IdentifyTenant;' tout en haut de bootstrap/app.php."
    },
    {
      error: "Date/heure décalée de 1 heure ou 2 heures dans les logs",
      cause: "Le fuseau horaire par défaut de PHP/Laravel est réglé sur UTC au lieu du fuseau de Dakar.",
      solution: "Réglez impérativement APP_TIMEZONE=\"Africa/Dakar\" dans le .env et vérifiez dans config/app.php que 'timezone' => env('APP_TIMEZONE', 'Africa/Dakar'). Dakar n'a pas d'heure d'été (GMT+0)."
    }
  ]
};

export const allStepsOverview = [
  { step: 1, title: "Architecture du projet", status: "active", desc: "Laravel 11, routing /e/{slug}, XAMPP, structure modulaire" },
  { step: 2, title: "Authentification", status: "pending", desc: "Connexion OTP +221, session sécurisée, rôles" },
  { step: 3, title: "Multi-tenant", status: "pending", desc: "Isolation stricte des données et scoped queries par tenant" },
  { step: 4, title: "Entreprises & Cliniques", status: "pending", desc: "Gestion des fiches, branding, coordonnées Dakar" },
  { step: 5, title: "Utilisateurs et Rôles", status: "pending", desc: "Admin, Praticien, Réceptionniste, Patient" },
  { step: 6, title: "Services & Tarifs", status: "pending", desc: "Actes médicaux, durées, prix en FCFA et politique d'acompte" },
  { step: 7, title: "Médecins & Professionnels", status: "pending", desc: "Profils, spécialités, salles de consultation" },
  { step: 8, title: "Horaires & Disponibilités", status: "pending", desc: "Créneaux, pauses déjeuner, prière du vendredi (13h-15h), jours fériés" },
  { step: 9, title: "Calendrier Interactif", status: "pending", desc: "Vue agenda jour/semaine pour praticiens et secrétaires" },
  { step: 10, title: "Réservation en ligne", status: "pending", desc: "Tunnel patient fluide, mobile-first, confirmation instantanée" },
  { step: 11, title: "Notifications WhatsApp & SMS", status: "pending", desc: "Interface interchangeable, rappels J-1, bilingue FR/Wolof" },
  { step: 12, title: "Paiements Mobiles", status: "pending", desc: "Architecture Wave, Orange Money, Free Money & comptoir" },
  { step: 13, title: "Abonnements SaaS", status: "pending", desc: "Plans mensuels/annuels FCFA pour les cliniques locataires" },
  { step: 14, title: "Dashboard & Statistiques", status: "pending", desc: "Taux de présence, no-shows, chiffre d'affaires FCFA" },
  { step: 15, title: "Sécurité & Données", status: "pending", desc: "Conformité loi sénégalaise CDP, chiffrement, RGPD/Sénégal" },
  { step: 16, title: "Tests Automatisés", status: "pending", desc: "Pest / PHPUnit pour les réservations et paiements" },
  { step: 17, title: "Déploiement VPS & Production", status: "pending", desc: "Nginx, SSL Let's Encrypt, supervisor pour les queues WhatsApp" }
];
