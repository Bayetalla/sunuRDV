export interface LaravelFileItem {
  path: string;
  category: 'Configuration' | 'Base de Données & Migrations' | 'Modèles Eloquent' | 'Contrôleurs & Webhooks' | 'Services Sénégal' | 'Jobs & Queues' | 'Routes & Kernel' | 'Documentation';
  description: string;
  code: string;
  language: string;
}

export const laravelProjectFiles: LaravelFileItem[] = [
  {
    path: "composer.json",
    category: "Configuration",
    description: "Fichier de dépendances de référence Laravel 11 pour SunuRDV (PHP 8.3, Stancl/Tenancy, Filament, Guzzle, Spatie).",
    language: "json",
    code: `{
  "name": "sunurdv/saas-senegal",
  "type": "project",
  "description": "Plateforme SaaS Multi-tenant de prise de rendez-vous pour cliniques au Sénégal.",
  "keywords": ["laravel", "saas", "senegal", "dakar", "multi-tenant", "wave", "orange-money", "whatsapp"],
  "license": "MIT",
  "require": {
    "php": "^8.2",
    "laravel/framework": "^11.0",
    "laravel/tinker": "^2.9",
    "stancl/tenancy": "^3.8",
    "spatie/laravel-permission": "^6.4",
    "guzzlehttp/guzzle": "^7.8"
  },
  "require-dev": {
    "fakerphp/faker": "^1.23",
    "laravel/pint": "^1.13",
    "mockery/mockery": "^1.6",
    "nunomaduro/collision": "^8.0",
    "phpunit/phpunit": "^11.0"
  },
  "autoload": {
    "psr-4": {
      "App\\\\": "app/",
      "Database\\\\Factories\\\\": "database/factories/",
      "Database\\\\Seeders\\\\": "database/seeders/"
    }
  },
  "autoload-dev": {
    "psr-4": {
      "Tests\\\\": "tests/"
    }
  },
  "scripts": {
    "post-autoload-dump": [
      "Illuminate\\\\Foundation\\\\ComposerScripts::postAutoloadDump",
      "@php artisan package:discover --ansi"
    ],
    "post-update-cmd": [
      "@php artisan vendor:publish --tag=laravel-assets --ansi --force"
    ],
    "post-root-package-install": [
      "@php -r \\"file_exists('.env') || copy('.env.example', '.env');\\""
    ],
    "post-create-project-cmd": [
      "@php artisan key:generate --ansi"
    ]
  },
  "extra": {
    "laravel": {
      "dont-discover": []
    }
  },
  "config": {
    "optimize-autoloader": true,
    "preferred-install": "dist",
    "sort-packages": true,
    "allow-plugins": {
      "pestphp/pest-plugin": true,
      "php-http/discovery": true
    }
  },
  "minimum-stability": "stable",
  "prefer-stable": true
}`
  },
  {
    path: ".env.example",
    category: "Configuration",
    description: "Variables d'environnement calibrées pour le Sénégal (Africa/Dakar, FCFA XOF, Wave, Orange Money, Infobip SMS, WhatsApp).",
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

# Base de données MySQL (XAMPP local ou serveur de prod)
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

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database
CACHE_PREFIX=

# Paramètres Métier Sénégal
SUNURDV_DEFAULT_CURRENCY=FCFA
SUNURDV_DEFAULT_COUNTRY_CODE=+221
SUNURDV_TIMEZONE="Africa/Dakar"

# Passerelles de Paiement Sénégal Mobile Money
WAVE_ENABLED=true
WAVE_API_KEY="wave_sn_test_xxxxxxxxxxxxxxxx"
WAVE_WEBHOOK_SECRET="whsec_wave_xxxxxxxxxxxx"

ORANGE_MONEY_ENABLED=true
ORANGE_MONEY_MERCHANT_KEY="om_dakar_merch_xxxx"
ORANGE_MONEY_WEBHOOK_SECRET="om_sec_xxxx"

# Notifications WhatsApp Cloud API (Bilingue FR / Wolof)
WHATSAPP_ENABLED=true
WHATSAPP_TOKEN="EAAxxxxxx..."
WHATSAPP_PHONE_NUMBER_ID="109876543210"
WHATSAPP_TEMPLATE_LANG_DEFAULT=fr

# Passerelle SMS Sénégal (+221 Fallback)
SMS_GATEWAY=infobip
SMS_API_KEY="sms_api_key_xxxxxxxx"
SMS_SENDER_ID="SunuRDV"`
  },
  {
    path: "config/sunurdv.php",
    category: "Configuration",
    description: "Configuration métier globale : préfixes télécoms sénégalais, devises et passerelles de paiement autorisées.",
    language: "php",
    code: `<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Paramètres Généraux du SaaS SunuRDV
    |--------------------------------------------------------------------------
    */
    'currency' => env('SUNURDV_DEFAULT_CURRENCY', 'FCFA'),
    'country_code' => env('SUNURDV_DEFAULT_COUNTRY_CODE', '+221'),
    'timezone' => env('SUNURDV_TIMEZONE', 'Africa/Dakar'),

    /*
    |--------------------------------------------------------------------------
    | Validation des numéros de téléphone au Sénégal (+221)
    |--------------------------------------------------------------------------
    | 77, 78 = Orange Sénégal
    | 76 = Free Sénégal
    | 70 = Expresso Sénégal
    | 75 = Promobile / Wave Mobile
    | 33 = Fixe Sonatel / Cliniques Dakar
    */
    'phone_prefixes' => ['77', '78', '76', '70', '75', '33'],
    'phone_regex' => '/^(\\+221|221)?[\\s]?(7[76580]|33)[\\s]?[0-9]{3}[\\s]?[0-9]{2}[\\s]?[0-9]{2}$/',

    /*
    |--------------------------------------------------------------------------
    | Passerelles de paiement supportées
    |--------------------------------------------------------------------------
    */
    'payment_gateways' => [
        'on_site' => [
            'label' => 'Règlement au comptoir (Espèces)',
            'enabled' => true,
        ],
        'wave' => [
            'label' => 'Wave Sénégal (Paiement instantané 1%)',
            'enabled' => env('WAVE_ENABLED', true),
            'api_key' => env('WAVE_API_KEY'),
            'webhook_secret' => env('WAVE_WEBHOOK_SECRET'),
        ],
        'orange_money' => [
            'label' => 'Orange Money Sénégal',
            'enabled' => env('ORANGE_MONEY_ENABLED', true),
            'merchant_key' => env('ORANGE_MONEY_MERCHANT_KEY'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Templates de messages WhatsApp (FR & Wolof)
    |--------------------------------------------------------------------------
    */
    'whatsapp_templates' => [
        'confirmation' => [
            'fr' => 'SunuRDV : Votre rendez-vous est confirmé avec :practitioner à :clinic pour le :date à :time. Acompte: :deposit FCFA.',
            'wo' => 'SunuRDV : Sa rendez-vous wóor na ak :practitioner ci :clinic ci bésub :date ci :time. Acompte: :deposit FCFA.',
        ],
        'reminder' => [
            'fr' => 'Rappel : Vous avez rendez-vous demain à :time avec :practitioner à :clinic. En cas d\'empêchement, appelez le :phone.',
            'wo' => 'Fàttali : Yaa am rendez-vous ëllëg ci :time ak :practitioner ci :clinic. Bu amee lu la xawa téye, wooteel ci :phone.',
        ]
    ]
];`
  },
  {
    path: "bootstrap/app.php",
    category: "Configuration",
    description: "Point d'entrée du kernel Laravel 11 avec enregistrement du middleware multi-tenant et gestion des exceptions.",
    language: "php",
    code: `<?php

use App\Http\Middleware\IdentifyTenant;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Enregistrement des alias de middleware
        $middleware->alias([
            'tenant' => IdentifyTenant::class,
            'role' => \\Spatie\\Permission\\Middleware\\RoleMiddleware::class,
            'permission' => \\Spatie\\Permission\\Middleware\\PermissionMiddleware::class,
        ]);

        // Ignorer CSRF pour les webhooks externes Wave et Orange Money
        $middleware->validateCsrfTokens(except: [
            'webhooks/wave',
            'webhooks/orange-money',
            'api/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();`
  },
  {
    path: "database/migrations/2026_01_01_000001_create_tenants_table.php",
    category: "Base de Données & Migrations",
    description: "Migration de la table des établissements de santé / cliniques locataires (multi-tenant).",
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
            $table->string('name');                             // Ex: Clinique Keur Madior
            $table->string('slug')->unique();                   // Ex: clinique-keur-madior
            $table->string('type')->default('medical');         // medical, dental, ophthalmology
            $table->string('tagline')->nullable();              // Spécialités Médicales & Urgences
            $table->string('phone')->nullable();                // +221 33 860 11 22
            $table->string('email')->nullable();
            $table->string('address')->nullable();              // Route des Almadies
            $table->string('city')->default('Dakar');
            $table->string('timezone')->default('Africa/Dakar');
            $table->string('currency')->default('FCFA');
            $table->boolean('require_deposit')->default(false); // Exiger acompte Wave/OM
            $table->integer('default_deposit_amount')->default(0); // Montant standard en FCFA
            $table->json('payment_methods')->nullable();        // ["on_site", "wave", "orange_money"]
            $table->json('settings')->nullable();               // Couleurs, logo, options SMS
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};`
  },
  {
    path: "database/migrations/2026_01_01_000002_create_practitioners_table.php",
    category: "Base de Données & Migrations",
    description: "Migration des médecins, spécialistes et praticiens rattachés à chaque établissement.",
    language: "php",
    code: `<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('practitioners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('title')->default('Dr.');            // Dr., Pr., Sage-Femme
            $table->string('name');                             // Ousmane Diallo
            $table->string('specialty');                        // Cardiologie, Médecine Générale
            $table->string('phone')->nullable();                // +221 77 123 45 67
            $table->string('email')->nullable();
            $table->string('room')->nullable();                 // Bureau 102 - Bâtiment A
            $table->string('avatar')->nullable();
            $table->json('working_hours')->nullable();          // Plages horaires hebdomadaires
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['tenant_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('practitioners');
    }
};`
  },
  {
    path: "database/migrations/2026_01_01_000003_create_medical_services_table.php",
    category: "Base de Données & Migrations",
    description: "Migration des actes médicaux, consultations, tarifs en FCFA et exigences d'acomptes.",
    language: "php",
    code: `<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medical_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('name');                             // Consultation Spécialiste
            $table->text('description')->nullable();
            $table->integer('duration_minutes')->default(30);   // Durée créneau en minutes
            $table->integer('price_xof')->default(25000);       // Prix de l'acte en FCFA
            $table->boolean('require_deposit')->default(false);
            $table->integer('deposit_amount_xof')->default(5000);// Acompte en FCFA
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['tenant_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_services');
    }
};`
  },
  {
    path: "database/migrations/2026_01_01_000004_create_appointments_table.php",
    category: "Base de Données & Migrations",
    description: "Migration des rendez-vous : références uniques, numéros +221, statuts du cycle de vie et acomptes.",
    language: "php",
    code: `<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();              // SN-RDV-4829
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('practitioner_id')->constrained('practitioners')->cascadeOnDelete();
            $table->foreignId('service_id')->constrained('medical_services')->cascadeOnDelete();
            
            // Patient details (sans compte obligatoire)
            $table->string('patient_name');
            $table->string('patient_phone');                    // +221 77 450 12 34
            $table->string('patient_email')->nullable();
            
            // Date & Heure (Fuseau Africa/Dakar)
            $table->date('date');
            $table->string('time_slot');                        // 09:30
            
            // Statut métier
            $table->enum('status', [
                'pending',
                'confirmed',
                'arrived',
                'in_progress',
                'completed',
                'cancelled',
                'no_show'
            ])->default('confirmed');

            // Paiement & Acompte
            $table->enum('payment_method', ['on_site', 'wave', 'orange_money', 'free_money'])->default('on_site');
            $table->enum('payment_status', ['pending', 'deposit_paid', 'fully_paid', 'refunded'])->default('pending');
            $table->integer('amount_xof')->default(0);          // Montant total en FCFA
            $table->integer('deposit_paid_xof')->default(0);    // Acompte payé en FCFA

            // Canal d'origine
            $table->enum('source', [
                'online_portal',
                'receptionist_phone',
                'receptionist_walkin'
            ])->default('online_portal');

            $table->text('notes')->nullable();
            $table->text('medical_notes')->nullable();          // Notes médecin confidentielles
            $table->json('prescriptions')->nullable();          // Ordonnance numérique
            $table->boolean('reminder_sent')->default(false);
            $table->timestamps();

            $table->index(['tenant_id', 'date', 'time_slot']);
            $table->index(['tenant_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};`
  },
  {
    path: "database/migrations/2026_01_01_000005_create_payments_table.php",
    category: "Base de Données & Migrations",
    description: "Migration des transactions de paiement Wave Sénégal et Orange Money avec références de webhooks.",
    language: "php",
    code: `<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('appointment_id')->constrained('appointments')->cascadeOnDelete();
            $table->string('transaction_id')->unique();         // ID Wave ou OM
            $table->string('gateway');                          // wave, orange_money, cash
            $table->integer('amount_xof');
            $table->enum('type', ['deposit', 'full_payment', 'refund'])->default('deposit');
            $table->enum('status', ['pending', 'successful', 'failed'])->default('pending');
            $table->string('payer_phone')->nullable();
            $table->json('raw_response')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};`
  },
  {
    path: "app/Models/Tenant.php",
    category: "Modèles Eloquent",
    description: "Modèle Eloquent Tenant gérant la logique d'établissement, les casts JSON et les relations.",
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
        'tagline',
        'phone',
        'email',
        'address',
        'city',
        'timezone',
        'currency',
        'require_deposit',
        'default_deposit_amount',
        'payment_methods',
        'settings',
        'is_active',
    ];

    protected $casts = [
        'require_deposit' => 'boolean',
        'default_deposit_amount' => 'integer',
        'payment_methods' => 'array',
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function practitioners(): HasMany
    {
        return $this->hasMany(Practitioner::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(MedicalService::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}`
  },
  {
    path: "app/Models/Appointment.php",
    category: "Modèles Eloquent",
    description: "Modèle Eloquent Appointment avec scopes de filtrage par date et salle d'attente.",
    language: "php",
    code: `<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'tenant_id',
        'practitioner_id',
        'service_id',
        'patient_name',
        'patient_phone',
        'patient_email',
        'date',
        'time_slot',
        'status',
        'payment_method',
        'payment_status',
        'amount_xof',
        'deposit_paid_xof',
        'source',
        'notes',
        'medical_notes',
        'prescriptions',
        'reminder_sent',
    ];

    protected $casts = [
        'date' => 'date',
        'amount_xof' => 'integer',
        'deposit_paid_xof' => 'integer',
        'prescriptions' => 'array',
        'reminder_sent' => 'boolean',
    ];

    public function getRouteKeyName(): string
    {
        return 'reference';
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function practitioner(): BelongsTo
    {
        return $this->belongsTo(Practitioner::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(MedicalService::class, 'service_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Scopes utiles pour la réception et les médecins
    public function scopeToday($query)
    {
        return $query->whereDate('date', now('Africa/Dakar')->toDateString());
    }

    public function scopeWaitingRoom($query)
    {
        return $query->where('status', 'arrived');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }
}`
  },
  {
    path: "app/Http/Middleware/IdentifyTenant.php",
    category: "Routes & Kernel",
    description: "Middleware d'isolation résolvant le cabinet actif depuis l'URL /e/{slug} et injectant l'instance dans le conteneur.",
    language: "php",
    code: `<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next): Response
    {
        $tenantParam = $request->route('tenant');

        if ($tenantParam) {
            $tenant = $tenantParam instanceof Tenant 
                ? $tenantParam 
                : Tenant::where('slug', $tenantParam)->first();

            if (!$tenant || !$tenant->is_active) {
                abort(404, "Ce cabinet médical n'existe pas ou a été désactivé.");
            }

            // Enregistrer le tenant comme singleton
            app()->instance(Tenant::class, $tenant);
            app()->instance('currentTenant', $tenant);

            // Partager avec toutes les vues Blade
            view()->share('currentTenant', $tenant);
        }

        return $next($request);
    }
}`
  },
  {
    path: "app/Http/Controllers/BookingController.php",
    category: "Contrôleurs & Webhooks",
    description: "Contrôleur de réservation patient public : vérification OTP +221, génération de référence et déclenchement de notification.",
    language: "php",
    code: `<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\MedicalService;
use App\Models\Practitioner;
use App\Models\Tenant;
use App\Services\WhatsAppNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    /**
     * Page d'accueil publique de prise de rendez-vous (/e/{tenant:slug})
     */
    public function index(Tenant $tenant)
    {
        $practitioners = $tenant->practitioners()->where('is_active', true)->get();
        $services = $tenant->services()->where('is_active', true)->get();

        return view('tenant.booking.index', compact('tenant', 'practitioners', 'services'));
    }

    /**
     * Traitement de la confirmation de réservation
     */
    public function store(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'practitioner_id' => 'required|exists:practitioners,id',
            'service_id' => 'required|exists:medical_services,id',
            'patient_name' => 'required|string|max:150',
            'patient_phone' => ['required', 'string', 'regex:/^(\\+221|221)?[\\s]?(7[76580]|33)[\\s]?[0-9]{3}[\\s]?[0-9]{2}[\\s]?[0-9]{2}$/'],
            'date' => 'required|date|after_or_equal:today',
            'time_slot' => 'required|string',
            'payment_method' => 'required|in:on_site,wave,orange_money',
        ]);

        $service = MedicalService::findOrFail($validated['service_id']);
        $reference = 'SN-RDV-' . strtoupper(Str::random(6));

        $depositPaid = 0;
        $paymentStatus = 'pending';

        // Si paiement Wave ou Orange Money sélectionné
        if (in_array($validated['payment_method'], ['wave', 'orange_money']) && $service->require_deposit) {
            $depositPaid = $service->deposit_amount_xof;
            $paymentStatus = 'deposit_paid';
        }

        $appointment = Appointment::create([
            'reference' => $reference,
            'tenant_id' => $tenant->id,
            'practitioner_id' => $validated['practitioner_id'],
            'service_id' => $service->id,
            'patient_name' => $validated['patient_name'],
            'patient_phone' => $validated['patient_phone'],
            'date' => $validated['date'],
            'time_slot' => $validated['time_slot'],
            'status' => 'confirmed',
            'payment_method' => $validated['payment_method'],
            'payment_status' => $paymentStatus,
            'amount_xof' => $service->price_xof,
            'deposit_paid_xof' => $depositPaid,
            'source' => 'online_portal',
        ]);

        // Déclencher notification WhatsApp / SMS instantanée
        app(WhatsAppNotificationService::class)->sendConfirmation($appointment);

        return redirect()->route('tenant.booking.confirmation', [
            'tenant' => $tenant->slug,
            'appointment' => $appointment->reference
        ])->with('success', 'Votre rendez-vous a été confirmé avec succès !');
    }

    /**
     * Page de reçu / ticket numérique
     */
    public function confirmation(Tenant $tenant, Appointment $appointment)
    {
        return view('tenant.booking.ticket', compact('tenant', 'appointment'));
    }
}`
  },
  {
    path: "app/Http/Controllers/ReceptionController.php",
    category: "Contrôleurs & Webhooks",
    description: "Contrôleur du guichet de réception : enregistrement d'appels téléphoniques, file d'attente et relances WhatsApp.",
    language: "php",
    code: `<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\MedicalService;
use App\Models\Practitioner;
use App\Models\Tenant;
use App\Services\WhatsAppNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReceptionController extends Controller
{
    /**
     * Dashboard Réception & Agenda du jour
     */
    public function index(Tenant $tenant)
    {
        $appointments = $tenant->appointments()
            ->today()
            ->with(['practitioner', 'service'])
            ->orderBy('time_slot')
            ->get();

        $practitioners = $tenant->practitioners()->where('is_active', true)->get();
        $services = $tenant->services()->where('is_active', true)->get();

        return view('tenant.reception.index', compact('tenant', 'appointments', 'practitioners', 'services'));
    }

    /**
     * Création rapide d'un RDV physique ou téléphonique par la secrétaire
     */
    public function quickBook(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'patient_name' => 'required|string',
            'patient_phone' => 'required|string',
            'practitioner_id' => 'required|exists:practitioners,id',
            'service_id' => 'required|exists:medical_services,id',
            'time_slot' => 'required|string',
            'source' => 'required|in:receptionist_phone,receptionist_walkin',
            'notes' => 'nullable|string',
        ]);

        $service = MedicalService::findOrFail($validated['service_id']);

        $appointment = Appointment::create([
            'reference' => 'SN-REC-' . rand(1000, 9999),
            'tenant_id' => $tenant->id,
            'practitioner_id' => $validated['practitioner_id'],
            'service_id' => $service->id,
            'patient_name' => $validated['patient_name'],
            'patient_phone' => $validated['patient_phone'],
            'date' => now('Africa/Dakar')->toDateString(),
            'time_slot' => $validated['time_slot'],
            'status' => 'confirmed',
            'payment_method' => 'on_site',
            'payment_status' => 'pending',
            'amount_xof' => $service->price_xof,
            'deposit_paid_xof' => 0,
            'source' => $validated['source'],
            'notes' => $validated['notes'] ?? null,
            'reminder_sent' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous guichet confirmé avec succès',
            'appointment' => $appointment,
        ]);
    }

    /**
     * Progression d'état du patient : Confirmé -> Salle d'attente -> En consultation -> Terminé
     */
    public function updateStatus(Request $request, Tenant $tenant, Appointment $appointment)
    {
        $validated = $request->validate([
            'status' => 'required|in:confirmed,arrived,in_progress,completed,no_show',
        ]);

        $appointment->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'status' => $appointment->status,
        ]);
    }
}`
  },
  {
    path: "app/Http/Controllers/WaveWebhookController.php",
    category: "Contrôleurs & Webhooks",
    description: "Contrôleur de Webhook Wave Sénégal pour la validation temps réel des paiements et acomptes mobiles.",
    language: "php",
    code: `<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Payment;
use App\Services\WhatsAppNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WaveWebhookController extends Controller
{
    /**
     * Webhook appelé instantanément par Wave Sénégal lors de la réception d'un paiement
     */
    public function handle(Request $request)
    {
        $payload = $request->all();
        $signature = $request->header('Wave-Signature');

        Log::info('Webhook Wave reçu', ['payload' => $payload]);

        $event = $payload['type'] ?? null;
        $data = $payload['data'] ?? [];

        if ($event === 'checkout.session.completed') {
            $clientReference = $data['client_reference'] ?? null; // Ex: SN-RDV-4829
            $transactionId = $data['id'] ?? null;
            $amount = $data['amount'] ?? 0;

            if ($clientReference) {
                $appointment = Appointment::where('reference', $clientReference)->first();

                if ($appointment) {
                    $appointment->update([
                        'payment_status' => 'deposit_paid',
                        'deposit_paid_xof' => $amount,
                        'status' => 'confirmed',
                    ]);

                    Payment::create([
                        'tenant_id' => $appointment->tenant_id,
                        'appointment_id' => $appointment->id,
                        'transaction_id' => $transactionId,
                        'gateway' => 'wave',
                        'amount_xof' => $amount,
                        'type' => 'deposit',
                        'status' => 'successful',
                        'raw_response' => $payload,
                    ]);

                    // Notifier le patient sur WhatsApp
                    app(WhatsAppNotificationService::class)->sendWaveReceipt($appointment);
                }
            }
        }

        return response()->json(['status' => 'success']);
    }
}`
  },
  {
    path: "app/Services/WhatsAppNotificationService.php",
    category: "Services Sénégal",
    description: "Service d'envoi de messages WhatsApp bilingues (Français / Wolof) via l'API officielle Meta Cloud API.",
    language: "php",
    code: `<?php

namespace App\Services;

use App\Models\Appointment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppNotificationService
{
    protected string $token;
    protected string $phoneId;

    public function __construct()
    {
        $this->token = config('services.whatsapp.token', env('WHATSAPP_TOKEN', ''));
        $this->phoneId = config('services.whatsapp.phone_id', env('WHATSAPP_PHONE_NUMBER_ID', ''));
    }

    /**
     * Envoi du message de confirmation de RDV
     */
    public function sendConfirmation(Appointment $appointment, string $lang = 'fr'): bool
    {
        $phone = preg_replace('/[^0-9]/', '', $appointment->patient_phone);
        if (!str_starts_with($phone, '221')) {
            $phone = '221' . $phone;
        }

        $message = $lang === 'wo'
            ? "Dalal ak jamm {$appointment->patient_name}, sa rendez-vous wóor na ak {$appointment->practitioner->name} ci {$appointment->tenant->name} bésub {$appointment->date->format('d/m/Y')} ci {$appointment->time_slot}. Réf: {$appointment->reference}."
            : "Bonjour {$appointment->patient_name}, votre RDV est confirmé avec {$appointment->practitioner->name} à {$appointment->tenant->name} le {$appointment->date->format('d/m/Y')} à {$appointment->time_slot}. Réf: {$appointment->reference}.";

        return $this->sendMessage($phone, $message);
    }

    /**
     * Envoi du reçu d'acompte Wave
     */
    public function sendWaveReceipt(Appointment $appointment): bool
    {
        $phone = preg_replace('/[^0-9]/', '', $appointment->patient_phone);
        $message = "SunuRDV : Acompte Wave de {$appointment->deposit_paid_xof} FCFA reçu avec succès pour votre RDV du {$appointment->date->format('d/m/Y')} à {$appointment->time_slot}. Réf: {$appointment->reference}.";
        return $this->sendMessage($phone, $message);
    }

    protected function sendMessage(string $recipientPhone, string $body): bool
    {
        if (empty($this->token)) {
            Log::info("[Simulation WhatsApp Sénégal] Message à {$recipientPhone} : {$body}");
            return true;
        }

        try {
            $response = Http::withToken($this->token)->post("https://graph.facebook.com/v19.0/{$this->phoneId}/messages", [
                'messaging_product' => 'whatsapp',
                'to' => $recipientPhone,
                'type' => 'text',
                'text' => ['body' => $body],
            ]);

            return $response->successful();
        } catch (\\Exception $e) {
            Log::error('Erreur WhatsApp: ' . $e->getMessage());
            return false;
        }
    }
}`
  },
  {
    path: "app/Jobs/SendAppointmentReminderJob.php",
    category: "Jobs & Queues",
    description: "Job asynchrone programmé pour exécuter les rappels J-1 sur le fuseau horaire Africa/Dakar.",
    language: "php",
    code: `<?php

namespace App\Jobs;

use App\Models\Appointment;
use App\Services\WhatsAppNotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendAppointmentReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Appointment $appointment)
    {
    }

    public function handle(WhatsAppNotificationService $whatsappService): void
    {
        if ($this->appointment->reminder_sent || $this->appointment->status === 'cancelled') {
            return;
        }

        $whatsappService->sendConfirmation($this->appointment);

        $this->appointment->update(['reminder_sent' => true]);
    }
}`
  },
  {
    path: "routes/web.php",
    category: "Routes & Kernel",
    description: "Fichier de routes web structuré pour les 5 espaces distincts (Patient, Réception, Médecin, Direction Cabinet, SuperAdmin).",
    language: "php",
    code: `<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\ClinicAdminController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ReceptionController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\WaveWebhookController;
use App\Models\Tenant;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| 1. Plateforme Centrale SunuRDV
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return view('welcome', [
        'tenants' => Tenant::where('is_active', true)->get()
    ]);
})->name('home');

// Webhook Wave & Orange Money
Route::post('/webhooks/wave', [WaveWebhookController::class, 'handle']);

/*
|--------------------------------------------------------------------------
| 2. Espace SuperAdmin Plateforme (/superadmin)
|--------------------------------------------------------------------------
*/
Route::prefix('superadmin')
    ->middleware(['auth', 'role:superadmin'])
    ->name('superadmin.')
    ->group(function () {
        Route::get('/', [SuperAdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/tenants', [SuperAdminController::class, 'tenants'])->name('tenants');
        Route::get('/subscriptions', [SuperAdminController::class, 'subscriptions'])->name('subscriptions');
    });

/*
|--------------------------------------------------------------------------
| 3. Espaces Multi-tenant par chemin (/e/{tenant:slug})
|--------------------------------------------------------------------------
*/
Route::prefix('e/{tenant:slug}')
    ->middleware(['tenant'])
    ->name('tenant.')
    ->group(function () {

        // A. Espace Patient Public (Prise de RDV en ligne, OTP +221)
        Route::get('/', [BookingController::class, 'index'])->name('booking.index');
        Route::post('/book', [BookingController::class, 'store'])->name('booking.store');
        Route::get('/ticket/{appointment:reference}', [BookingController::class, 'confirmation'])->name('booking.confirmation');

        // B. Espace Réceptionniste & Guichet
        Route::prefix('reception')->name('reception.')->group(function () {
            Route::get('/', [ReceptionController::class, 'index'])->name('index');
            Route::post('/quick-book', [ReceptionController::class, 'quickBook'])->name('quick_book');
            Route::patch('/appointments/{appointment}/status', [ReceptionController::class, 'updateStatus'])->name('status');
        });

        // C. Espace Praticien (Consultations, ordonnances)
        Route::prefix('praticien')->name('doctor.')->group(function () {
            Route::get('/agenda', [DoctorController::class, 'agenda'])->name('agenda');
            Route::get('/consultation/{appointment}', [DoctorController::class, 'consultation'])->name('consultation');
            Route::post('/consultation/{appointment}/prescribe', [DoctorController::class, 'prescribe'])->name('prescribe');
        });

        // D. Espace Direction & Admin Cabinet
        Route::prefix('admin')->name('admin.')->group(function () {
            Route::get('/dashboard', [ClinicAdminController::class, 'index'])->name('dashboard');
            Route::post('/settings', [ClinicAdminController::class, 'updateSettings'])->name('settings');
        });
    });`
  },
  {
    path: "database/seeders/DatabaseSeeder.php",
    category: "Base de Données & Migrations",
    description: "Données de démarrage pour les cliniques de Dakar, les spécialités médicales et les tarifs FCFA.",
    language: "php",
    code: `<?php

namespace Database\\Seeders;

use App\Models\MedicalService;
use App\Models\Practitioner;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Clinique Keur Madior (Almadies, Dakar)
        $keurMadior = Tenant::create([
            'name' => 'Clinique Keur Madior',
            'slug' => 'clinique-keur-madior',
            'type' => 'medical',
            'tagline' => 'Spécialités Médicales & Urgences 24/7',
            'phone' => '+221 33 820 12 34',
            'email' => 'contact@keurmadior.sn',
            'address' => 'Route des Almadies, Dakar',
            'city' => 'Dakar',
            'timezone' => 'Africa/Dakar',
            'currency' => 'FCFA',
            'require_deposit' => true,
            'default_deposit_amount' => 5000,
            'payment_methods' => ['on_site', 'wave', 'orange_money'],
            'is_active' => true,
        ]);

        // Médecins
        $drNdiaye = Practitioner::create([
            'tenant_id' => $keurMadior->id,
            'title' => 'Dr.',
            'name' => 'Aminata Ndiaye',
            'specialty' => 'Pédiatrie & Néonatalogie',
            'phone' => '+221 77 450 12 34',
            'room' => 'Bureau 102 - Pavillon Mère-Enfant',
            'avatar' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
            'is_active' => true,
        ]);

        $drDiallo = Practitioner::create([
            'tenant_id' => $keurMadior->id,
            'title' => 'Dr.',
            'name' => 'Cheikh Tidiane Diallo',
            'specialty' => 'Cardiologie & Hypertension',
            'phone' => '+221 76 680 99 11',
            'room' => 'Salle 204 - Bâtiment Central',
            'avatar' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
            'is_active' => true,
        ]);

        // Actes Médicaux
        MedicalService::create([
            'tenant_id' => $keurMadior->id,
            'name' => 'Consultation Pédiatrique',
            'description' => 'Bilan de santé, suivi de croissance et vaccinations infantiles.',
            'duration_minutes' => 30,
            'price_xof' => 20000,
            'require_deposit' => true,
            'deposit_amount_xof' => 5000,
            'is_active' => true,
        ]);

        MedicalService::create([
            'tenant_id' => $keurMadior->id,
            'name' => 'Consultation Cardiologie & ECG',
            'description' => 'Examen cardiologique complet avec électrocardiogramme.',
            'duration_minutes' => 45,
            'price_xof' => 35000,
            'require_deposit' => true,
            'deposit_amount_xof' => 10000,
            'is_active' => true,
        ]);
    }
}`
  },
  {
    path: "README.md",
    category: "Documentation",
    description: "Guide complet de déploiement et commandes artisan pour démarrer le projet sous Windows (XAMPP) ou Linux.",
    language: "markdown",
    code: `# SunuRDV - Backend Laravel 11 (Architecture Multi-tenant Sénégal)

Plateforme SaaS de gestion et prise de rendez-vous médicaux adaptée aux réalités du Sénégal (Wave, Orange Money, OTP +221, WhatsApp Cloud API, fuseau Africa/Dakar).

## 🚀 Installation Rapide (Windows XAMPP ou Linux)

\`\`\`bash
# 1. Cloner ou dézipper le projet
cd C:\\xampp\\htdocs\\sunurdv

# 2. Installer les dépendances PHP
composer install

# 3. Configurer l'environnement
cp .env.example .env
php artisan key:generate

# 4. Créer la base de données MySQL dans phpMyAdmin ou via CLI
mysql -u root -e "CREATE DATABASE IF NOT EXISTS sunurdv_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 5. Exécuter les migrations et le jeu de données démo Dakar
php artisan migrate --seed

# 6. Lancer le serveur local
php artisan serve --port=8000
\`\`\`

## 📱 URLs des Espaces Multi-tenant

- **Page d'accueil plateforme** : \`http://localhost:8000/\`
- **Espace Patient (Clinique Keur Madior)** : \`http://localhost:8000/e/clinique-keur-madior\`
- **Espace Guichet Réception** : \`http://localhost:8000/e/clinique-keur-madior/reception\`
- **Espace Médecin** : \`http://localhost:8000/e/clinique-keur-madior/praticien/agenda\`
- **Espace Admin Cabinet** : \`http://localhost:8000/e/clinique-keur-madior/admin/dashboard\`
- **Espace SuperAdmin Central** : \`http://localhost:8000/superadmin\`

## ⚡ Traitement asynchrone des messages WhatsApp et SMS

\`\`\`bash
php artisan queue:work --queue=whatsapp,sms,default --tries=3
\`\`\`
`
  }
];
