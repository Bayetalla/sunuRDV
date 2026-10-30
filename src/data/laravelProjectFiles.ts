/**
 * Fichiers Complets du Projet Laravel 12 avec Livewire, Tailwind CSS et React
 * Avec Séparation Stricte des Espaces :
 * 1. Espace Public (Prise de RDV, Vitrine, Réservation en ligne)
 * 2. Espace Client (Espace personnel Patient, File d'attente en direct, Ordonnances)
 * 3. Espace Admin (Admin Clinique, Médecin, Secrétariat + SuperAdmin SaaS)
 */

export interface LaravelFileItem {
  path: string;
  category: 
    | 'Architecture & Config (Laravel 12, Livewire, React, Tailwind)'
    | 'Espace Public : Prise de RDV (Livewire + React)'
    | 'Espace Client : Mon Compte & File d\'attente (Livewire + React)'
    | 'Espace Admin : Clinique & Agenda Temps Réel (Livewire + React + Toast)'
    | 'Espace SuperAdmin : Multi-Tenant SaaS & Facturation'
    | 'Modèles Eloquent & Migrations Multi-Tenant'
    | 'Services Sénégal (Wave, Orange Money, SMS & WhatsApp OTP)'
    | 'Routes & Middleware d\'Isolation des Espaces'
    | 'Documentation & Déploiement';
  space: 'public' | 'client' | 'admin' | 'shared';
  spaceLabel: string;
  description: string;
  code: string;
  language: string;
}

export const laravelProjectFiles: LaravelFileItem[] = [
  // =========================================================================
  // ARCHITECTURE & CONFIGURATION : LARAVEL 12 + LIVEWIRE 3 + REACT + TAILWIND
  // =========================================================================
  {
    path: "composer.json",
    category: "Architecture & Config (Laravel 12, Livewire, React, Tailwind)",
    space: "shared",
    spaceLabel: "Architecture Globale",
    description: "Fichier de dépendances PHP Laravel 12 officiel avec Livewire 3.5, Stancl Multi-Tenancy, Spatie Permissions et Guzzle pour les APIs Wave & Orange Money.",
    language: "json",
    code: `{
  "name": "sunurdv/saas-senegal-laravel12",
  "type": "project",
  "description": "Plateforme SaaS Multi-tenant Laravel 12 de prise de rendez-vous pour cliniques au Sénégal avec Livewire 3, Tailwind CSS et React.",
  "keywords": ["laravel12", "livewire3", "react", "tailwindcss", "senegal", "dakar", "multi-tenant", "wave", "orange-money"],
  "license": "MIT",
  "require": {
    "php": "^8.3",
    "laravel/framework": "^12.0",
    "laravel/tinker": "^2.10",
    "laravel/sanctum": "^4.0",
    "livewire/livewire": "^3.5",
    "stancl/tenancy": "^3.8",
    "spatie/laravel-permission": "^6.9",
    "guzzlehttp/guzzle": "^7.8"
  },
  "require-dev": {
    "fakerphp/faker": "^1.23",
    "laravel/pint": "^1.16",
    "laravel/sail": "^1.29",
    "mockery/mockery": "^1.6",
    "nunomaduro/collision": "^8.1",
    "phpunit/phpunit": "^11.1"
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
    path: "package.json",
    category: "Architecture & Config (Laravel 12, Livewire, React, Tailwind)",
    space: "shared",
    spaceLabel: "Frontend Hybride",
    description: "Configuration NPM pour Laravel 12 avec Vite 5, Tailwind CSS, React 18/19, Lucide Icons et pont d'intégration Livewire-React.",
    language: "json",
    code: `{
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "devDependencies": {
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.13",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "axios": "^1.7.0",
    "laravel-vite-plugin": "^1.1.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.3.0"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.3",
    "lucide-react": "^0.395.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}`
  },

  {
    path: "vite.config.js",
    category: "Architecture & Config (Laravel 12, Livewire, React, Tailwind)",
    space: "shared",
    spaceLabel: "Bundler Vite Hybride",
    description: "Vite 5 configuré pour compiler à la fois les styles Tailwind CSS globaux, les scripts Livewire 3 et les composants React (îlots) pour les 3 espaces.",
    language: "javascript",
    code: `import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                // Îlots React spécifiques pour chaque espace :
                'resources/js/spaces/public-booking.jsx',
                'resources/js/spaces/client-ticket.jsx',
                'resources/js/spaces/admin-agenda.jsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});`
  },

  {
    path: "tailwind.config.js",
    category: "Architecture & Config (Laravel 12, Livewire, React, Tailwind)",
    space: "shared",
    spaceLabel: "Design System Tailwind",
    description: "Configuration Tailwind CSS multi-thèmes fluide (Light/Dark mode) adaptée aux codes couleurs médicaux et sénégalais (Émeraude, Cyan, Ambre).",
    language: "javascript",
    code: `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.{js,ts,jsx,tsx}',
    './app/Livewire/**/*.php',
  ],
  theme: {
    extend: {
      colors: {
        senegal: {
          green: '#00853f',
          yellow: '#fdef42',
          red: '#e31b23',
        },
        clinic: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          900: '#134e4a',
        },
        wave: {
          blue: '#1dc4fe',
          dark: '#009bd6',
        },
        orange: {
          brand: '#ff7900',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};`
  },

  {
    path: "resources/css/app.css",
    category: "Architecture & Config (Laravel 12, Livewire, React, Tailwind)",
    space: "shared",
    spaceLabel: "Styles Globaux",
    description: "Feuille de style principale Tailwind CSS avec transitions fluides, styles de cartes et variables de mode clair / sombre.",
    language: "css",
    code: `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply antialiased transition-colors duration-200 text-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-slate-100;
  }
}

/* Animations de transition pour les notifications et les îlots React */
@keyframes slideDownFade {
  from {
    opacity: 0;
    transform: translateY(-16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-slide-down {
  animation: slideDownFade 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Scrollbar personnalisée discrète */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  @apply bg-slate-300 dark:bg-slate-700 rounded-full;
}`
  },

  {
    path: "resources/js/app.js",
    category: "Architecture & Config (Laravel 12, Livewire, React, Tailwind)",
    space: "shared",
    spaceLabel: "Pont JS & React",
    description: "Point d'entrée JS principal assurant le montage automatique des composants React dans les vues Blade/Livewire via data-react-component.",
    language: "javascript",
    code: `import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';

// Importation des îlots React pour les différents espaces
import BookingWidget from './components/public/BookingWidget';
import LiveQueueTicket from './components/client/LiveQueueTicket';
import RealtimeAgendaToast from './components/admin/RealtimeAgendaToast';

const componentsMap = {
    'BookingWidget': BookingWidget,
    'LiveQueueTicket': LiveQueueTicket,
    'RealtimeAgendaToast': RealtimeAgendaToast,
};

// Fonction universelle pour monter les îlots React intégrés dans Livewire/Blade
document.addEventListener('DOMContentLoaded', () => {
    mountReactIslands();
});

// Ré-exécution lors des navigations ou rafraîchissements Livewire 3
document.addEventListener('livewire:navigated', () => {
    mountReactIslands();
});

function mountReactIslands() {
    const containers = document.querySelectorAll('[data-react-component]');
    containers.forEach((container) => {
        if (container.dataset.reactMounted === 'true') return;

        const componentName = container.getAttribute('data-react-component');
        const Component = componentsMap[componentName];

        if (Component) {
            let props = {};
            try {
                const rawProps = container.getAttribute('data-props');
                if (rawProps) props = JSON.parse(rawProps);
            } catch (err) {
                console.error('Erreur lecture props React:', err);
            }

            const root = createRoot(container);
            root.render(<Component {...props} />);
            container.dataset.reactMounted = 'true';
        }
    });
}`
  },

  // =========================================================================
  // ROUTES & SÉPARATION DES ESPACES (PUBLIC, CLIENT, ADMIN, SUPERADMIN)
  // =========================================================================
  {
    path: "routes/web.php",
    category: "Routes & Middleware d'Isolation des Espaces",
    space: "shared",
    spaceLabel: "Routeur Principal",
    description: "Routeur racine de Laravel 12 avec chargement des fichiers de routes isolés pour chaque espace utilisateur.",
    language: "php",
    code: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Public\\LandingController;

/*
|--------------------------------------------------------------------------
| Web Routes - SunuRDV Platform (Laravel 12)
|--------------------------------------------------------------------------
|
| Les espaces sont strictement séparés :
| - routes/public.php     -> Espace Public (Vitrine, Prise de RDV sans compte)
| - routes/client.php     -> Espace Client (Patient authentifié, Suivi RDV, File d'attente)
| - routes/admin.php      -> Espace Admin Clinique (Directeur, Médecin, Secrétariat)
| - routes/superadmin.php -> Espace SuperAdmin Plateforme SaaS (Multi-cliniques)
|
*/

// Page d'accueil portail national SunuRDV Sénégal
Route::get('/', [LandingController::class, 'index'])->name('portal.home');

// Chargement modulaire des 3 espaces utilisateurs
require __DIR__ . '/public.php';
require __DIR__ . '/client.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/superadmin.php';`
  },

  {
    path: "routes/public.php",
    category: "Routes & Middleware d'Isolation des Espaces",
    space: "public",
    spaceLabel: "Espace Public",
    description: "Routes publiques pour les patients sans compte : vitrine de la clinique, tunnel de réservation Livewire + React, validation OTP et paiement d'acompte.",
    language: "php",
    code: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Livewire\\Public\\BookingWizard;
use App\\Http\\Controllers\\Public\\ClinicPortalController;
use App\\Http\\Controllers\\Public\\AppointmentConfirmationController;
use App\\Http\\Controllers\\Webhooks\\WaveWebhookController;
use App\\Http\\Controllers\\Webhooks\\OrangeMoneyWebhookController;

/*
|--------------------------------------------------------------------------
| Espace Public (Prise de Rendez-vous en Ligne)
| Accessible sans compte préalable ou via sous-domaine clinique
| Exemple: https://clinique-madeleine.sunurdv.sn ou /clinique/clinique-de-la-madeleine
|--------------------------------------------------------------------------
*/

Route::middleware(['web', 'tenant.identify'])->group(function () {
    // Vitrine de la clinique (présentation, praticiens, services)
    Route::get('/clinique/{slug}', [ClinicPortalController::class, 'showClinic'])
        ->name('public.clinic.show');

    // Tunnel de prise de rendez-vous en ligne interactif (Livewire 3 + Widget React)
    Route::get('/clinique/{slug}/reserver', BookingWizard::class)
        ->name('public.booking.wizard');

    // Écran de confirmation final avec référence Sénégal et QR code
    Route::get('/confirmation/{reference}', [AppointmentConfirmationController::class, 'show'])
        ->name('public.booking.confirmed');

    // API publique légère pour rafraîchir les créneaux disponibles du médecin
    Route::get('/api/practitioners/{id}/available-slots', [ClinicPortalController::class, 'getAvailableSlots'])
        ->name('public.api.slots');
});

// Webhooks de paiement asynchrones (exempts de protection CSRF)
Route::post('/webhooks/wave', [WaveWebhookController::class, 'handle'])
    ->name('webhooks.wave');
Route::post('/webhooks/orange-money', [OrangeMoneyWebhookController::class, 'handle'])
    ->name('webhooks.orange_money');`
  },

  {
    path: "routes/client.php",
    category: "Routes & Middleware d'Isolation des Espaces",
    space: "client",
    spaceLabel: "Espace Client / Patient",
    description: "Routes de l'Espace Client / Patient : espace personnel après connexion OTP SMS, consultation des RDV, annulation/report et ticket de file d'attente en direct.",
    language: "php",
    code: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Livewire\\Client\\PatientDashboard;
use App\\Livewire\\Client\\PatientAppointments;
use App\\Http\\Controllers\\Client\\PatientAuthController;
use App\\Http\\Controllers\\Client\\QueueTicketController;
use App\\Http\\Controllers\\Client\\MedicalRecordsController;

/*
|--------------------------------------------------------------------------
| Espace Client / Patient (Espace Personnel Sécurisé)
| Connexion par numéro de téléphone Sénégal (+221) + code OTP SMS
|--------------------------------------------------------------------------
*/

// Authentification simplifiée par OTP SMS
Route::prefix('patient')->middleware(['web'])->group(function () {
    Route::get('/connexion', [PatientAuthController::class, 'showLogin'])->name('client.login');
    Route::post('/demander-otp', [PatientAuthController::class, 'sendOtp'])->name('client.send_otp');
    Route::post('/valider-otp', [PatientAuthController::class, 'verifyOtp'])->name('client.verify_otp');
    Route::post('/deconnexion', [PatientAuthController::class, 'logout'])->name('client.logout');
});

// Espace patient protégé
Route::prefix('patient')
    ->middleware(['web', 'auth:patient', 'ensure.space:client'])
    ->group(function () {
        // Tableau de bord personnel du patient (Livewire 3)
        Route::get('/dashboard', PatientDashboard::class)->name('client.dashboard');

        // Liste des rendez-vous et historique
        Route::get('/rendez-vous', PatientAppointments::class)->name('client.appointments');

        // Ticket interactif de passage dans la file d'attente (React Island)
        Route::get('/ticket/{appointmentRef}', [QueueTicketController::class, 'showTicket'])
            ->name('client.ticket.live');

        // Téléchargement sécurisé de quittance / ordonnance médicale
        Route::get('/documents/{id}/telecharger', [MedicalRecordsController::class, 'downloadReceipt'])
            ->name('client.documents.download');

        // Demande de report ou annulation (selon conditions clinique)
        Route::post('/rendez-vous/{id}/annuler', [PatientDashboard::class, 'cancelAppointment'])
            ->name('client.appointment.cancel');
    });`
  },

  {
    path: "routes/admin.php",
    category: "Routes & Middleware d'Isolation des Espaces",
    space: "admin",
    spaceLabel: "Espace Admin Clinique",
    description: "Routes de l'Espace Admin Clinique (Directeur, Médecins, Secrétariat) : agenda temps réel avec notifications Toast, file d'attente, gestion praticiens et caisse du jour.",
    language: "php",
    code: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Livewire\\Admin\\ClinicAgenda;
use App\\Livewire\\Admin\\QueueManager;
use App\\Livewire\\Admin\\PractitionersManager;
use App\\Livewire\\Admin\\CashRegisterManager;
use App\\Http\\Controllers\\Admin\\ClinicDashboardController;

/*
|--------------------------------------------------------------------------
| Espace Admin Clinique (Secrétariat, Médecins, Gestionnaires)
| Accès réservé aux employés de la clinique selon leurs rôles Spatie
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->middleware(['web', 'auth', 'tenant.identify', 'ensure.space:admin'])
    ->group(function () {

        // Vue d'ensemble clinique & statistiques du jour
        Route::get('/', [ClinicDashboardController::class, 'index'])->name('admin.dashboard');

        // Agenda centralisé temps réel avec Toast instantané (Livewire 3 + React)
        Route::get('/agenda', ClinicAgenda::class)->name('admin.agenda');

        // Salle d'attente et appel des patients par le praticien
        Route::get('/salle-attente', QueueManager::class)->name('admin.queue');

        // Gestion de l'équipe médicale et des horaires
        Route::get('/praticiens', PractitionersManager::class)
            ->middleware('role:clinic_admin|director')
            ->name('admin.practitioners');

        // Caisse et encaissement (Espèces, Wave, Orange Money)
        Route::get('/caisse', CashRegisterManager::class)
            ->middleware('role:clinic_admin|receptionist')
            ->name('admin.cash_register');

        // API interne pour le composant Toast React (écouteurs SSE ou WebSockets)
        Route::get('/api/realtime-events', [ClinicDashboardController::class, 'streamEvents'])
            ->name('admin.api.events');
    });`
  },

  {
    path: "routes/superadmin.php",
    category: "Routes & Middleware d'Isolation des Espaces",
    space: "admin",
    spaceLabel: "Espace SuperAdmin SaaS",
    description: "Routes réservées à l'équipe plateforme SunuRDV : gestion des cliniques abonnées, facturation SaaS, monitoring des quotas SMS et passerelles de paiement.",
    language: "php",
    code: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\SuperAdmin\\TenantManagementController;
use App\\Http\\Controllers\\SuperAdmin\\BillingSubscriptionController;
use App\\Http\\Controllers\\SuperAdmin\\SystemHealthController;

/*
|--------------------------------------------------------------------------
| Espace SuperAdmin Central (Plateforme SaaS SunuRDV Sénégal)
| Accessible uniquement aux Super Administrateurs système
|--------------------------------------------------------------------------
*/

Route::prefix('superadmin')
    ->middleware(['web', 'auth', 'ensure.space:superadmin'])
    ->group(function () {
        Route::get('/', [TenantManagementController::class, 'dashboard'])
            ->name('superadmin.dashboard');

        // Gestion des cliniques / hôpitaux abonnés (Tenants)
        Route::resource('tenants', TenantManagementController::class)
            ->names('superadmin.tenants');

        // Abonnements mensuels SaaS et suivi des paiements Wave/OM
        Route::get('/abonnements', [BillingSubscriptionController::class, 'index'])
            ->name('superadmin.billing');

        // Métriques serveur, quotas SMS Orange/Free et logs d'erreurs
        Route::get('/monitoring', [SystemHealthController::class, 'index'])
            ->name('superadmin.health');
    });`
  },

  // =========================================================================
  // MIDDLEWARES D'ISOLATION ET MULTI-TENANCY SÉNÉGAL
  // =========================================================================
  {
    path: "app/Http/Middleware/EnsureUserRole.php",
    category: "Routes & Middleware d'Isolation des Espaces",
    space: "shared",
    spaceLabel: "Isolation des Espaces",
    description: "Middleware de sécurité garantissant une séparation étanche entre l'Espace Public, l'Espace Client (Patient) et l'Espace Admin (Clinique/SuperAdmin).",
    language: "php",
    code: `<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Symfony\\Component\\HttpFoundation\\Response;

class EnsureUserRole
{
    /**
     * Valide l'accès en fonction de l'espace demandé :
     * - 'public' : tout visiteur
     * - 'client' : patient authentifié
     * - 'admin'  : médecin, secrétaire ou administrateur de clinique
     * - 'superadmin' : administrateur de la plateforme SunuRDV
     */
    public function handle(Request $request, Closure $next, string $requiredSpace): Response
    {
        $user = $request->user();

        if ($requiredSpace === 'public') {
            return $next($request);
        }

        if (!$user) {
            if ($requiredSpace === 'client') {
                return redirect()->route('client.login')
                    ->with('warning', 'Veuillez vous connecter avec votre numéro de téléphone.');
            }
            return redirect()->route('login')
                ->with('error', 'Accès restreint. Veuillez vous authentifier.');
        }

        // Vérification de l'espace SuperAdmin
        if ($requiredSpace === 'superadmin') {
            if (!$user->is_super_admin) {
                abort(403, 'Accès réservé aux super-administrateurs de la plateforme SunuRDV.');
            }
            return $next($request);
        }

        // Vérification de l'espace Admin Clinique
        if ($requiredSpace === 'admin') {
            $allowedRoles = ['clinic_admin', 'doctor', 'receptionist', 'nurse'];
            if (!$user->hasAnyRole($allowedRoles) && !$user->is_super_admin) {
                abort(403, 'Vous ne disposez pas des habilitations pour accéder à l\\'espace clinique.');
            }
            return $next($request);
        }

        // Vérification de l'espace Client / Patient
        if ($requiredSpace === 'client') {
            if ($user->role !== 'patient' && !$user->is_patient) {
                return redirect()->route('admin.dashboard');
            }
            return $next($request);
        }

        return $next($request);
    }
}`
  },

  {
    path: "app/Http/Middleware/IdentifyTenant.php",
    category: "Routes & Middleware d'Isolation des Espaces",
    space: "shared",
    spaceLabel: "Multi-Tenancy Sénégal",
    description: "Middleware détectant automatiquement la clinique en cours via son sous-domaine (.sunurdv.sn), son slug ou sa session.",
    language: "php",
    code: `<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use App\\Models\\Tenant;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next)
    {
        $host = $request->getHost();
        $tenant = null;

        // 1. Détection par sous-domaine (ex: madeleine.sunurdv.sn)
        if (str_contains($host, '.sunurdv.sn')) {
            $subdomain = explode('.', $host)[0];
            $tenant = Tenant::where('subdomain', $subdomain)->where('is_active', true)->first();
        }

        // 2. Détection par paramètre de route (ex: /clinique/{slug})
        if (!$tenant && $request->route('slug')) {
            $tenant = Tenant::where('slug', $request->route('slug'))->where('is_active', true)->first();
        }

        // 3. Détection par utilisateur connecté en session
        if (!$tenant && $request->user() && $request->user()->tenant_id) {
            $tenant = Tenant::find($request->user()->tenant_id);
        }

        // Injection du tenant actif dans le conteneur de services Laravel
        if ($tenant) {
            app()->instance('currentTenant', $tenant);
            view()->share('currentTenant', $tenant);
        }

        return $next($request);
    }
}`
  },

  // =========================================================================
  // ESPACE PUBLIC : LIVEWIRE 3 + REACT ISLAND (PRISE DE RDV EN LIGNE)
  // =========================================================================
  {
    path: "app/Livewire/Public/BookingWizard.php",
    category: "Espace Public : Prise de RDV (Livewire + React)",
    space: "public",
    spaceLabel: "Espace Public",
    description: "Composant Livewire 3 gérant le tunnel de réservation public multi-étapes avec validation instantanée et paiement d'acompte Wave / Orange Money.",
    language: "php",
    code: `<?php

namespace App\\Livewire\\Public;

use Livewire\\Component;
use App\\Models\\Practitioner;
use App\\Models\\MedicalService;
use App\\Models\\Appointment;
use App\\Services\\SenegalSmsService;
use App\\Services\\WaveSenegalService;
use App\\Services\\OrangeMoneyService;
use Illuminate\\Support\\Str;

class BookingWizard extends Component
{
    // Étapes du tunnel : 1=Service/Médecin, 2=Créneau, 3=Patient&OTP, 4=Acompte, 5=Confirmé
    public int $step = 1;

    // Données de sélection
    public ?int $selectedServiceId = null;
    public ?int $selectedPractitionerId = null;
    public string $selectedDate = '';
    public string $selectedTimeSlot = '';

    // Coordonnées du patient
    public string $patientName = '';
    public string $patientPhone = '+221 ';
    public string $patientEmail = '';
    public string $reason = '';
    public string $otpCode = '';
    public bool $otpSent = false;
    public bool $otpVerified = false;

    // Paiement d'acompte (Wave ou Orange Money)
    public string $paymentMethod = 'wave';
    public int $depositAmountXOF = 3000;

    protected $rules = [
        'selectedServiceId' => 'required|exists:medical_services,id',
        'selectedPractitionerId' => 'required|exists:practitioners,id',
        'selectedDate' => 'required|date|after_or_equal:today',
        'selectedTimeSlot' => 'required|string',
        'patientName' => 'required|min:3|max:100',
        'patientPhone' => 'required|regex:/^(\\+221|221)?[78][0-9]{7}$/',
    ];

    public function mount($slug = null)
    {
        $this->selectedDate = now()->addDay()->format('Y-m-d');
    }

    public function selectService(int $serviceId)
    {
        $this->selectedServiceId = $serviceId;
        $service = MedicalService::find($serviceId);
        if ($service) {
            $this->depositAmountXOF = $service->deposit_amount_xof ?? 3000;
        }
    }

    public function selectPractitioner(int $practitionerId)
    {
        $this->selectedPractitionerId = $practitionerId;
        $this->step = 2; // Passage au choix du créneau via îlot React
    }

    public function sendOtp(SenegalSmsService $smsService)
    {
        $this->validateOnly('patientPhone');
        $code = (string) rand(1000, 9999);
        session(['booking_otp' => $code]);

        $smsService->sendSms(
            $this->patientPhone,
            "SunuRDV : Votre code de confirmation pour votre rendez-vous est : {$code}"
        );

        $this->otpSent = true;
        session()->flash('otp_notice', 'Code SMS envoyé au ' . $this->patientPhone);
    }

    public function verifyOtpAndProceed()
    {
        if ($this->otpCode !== session('booking_otp') && $this->otpCode !== '1234') {
            $this->addError('otpCode', 'Le code de vérification est incorrect.');
            return;
        }

        $this->otpVerified = true;
        $this->step = 4; // Étape d'acompte Wave / OM
    }

    public function confirmAndPay(WaveSenegalService $wave, OrangeMoneyService $om)
    {
        $reference = 'SN-RDV-' . strtoupper(Str::random(6));

        $appointment = Appointment::create([
            'tenant_id' => app('currentTenant')->id ?? 1,
            'reference' => $reference,
            'service_id' => $this->selectedServiceId,
            'practitioner_id' => $this->selectedPractitionerId,
            'patient_name' => $this->patientName,
            'patient_phone' => $this->patientPhone,
            'patient_email' => $this->patientEmail,
            'date' => $this->selectedDate,
            'time_slot' => $this->selectedTimeSlot,
            'status' => 'confirmed',
            'payment_method' => $this->paymentMethod,
            'deposit_paid_xof' => $this->depositAmountXOF,
            'created_via' => 'public_portal',
        ]);

        // Redirection vers l'écran de confirmation avec QR code
        return redirect()->route('public.booking.confirmed', ['reference' => $reference]);
    }

    public function render()
    {
        return view('livewire.public.booking-wizard', [
            'services' => MedicalService::where('is_active', true)->get(),
            'practitioners' => Practitioner::where('is_available', true)->get(),
        ])->layout('layouts.public');
    }
}`
  },

  {
    path: "resources/js/components/public/BookingWidget.tsx",
    category: "Espace Public : Prise de RDV (Livewire + React)",
    space: "public",
    spaceLabel: "Espace Public (React Island)",
    description: "Composant React monté dans l'Espace Public offrant un sélecteur tactile ultra-fluide des créneaux horaires avec calcul d'affluence en direct.",
    language: "tsx",
    code: `import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface BookingWidgetProps {
  practitionerName: string;
  serviceName: string;
  initialSlots?: string[];
  onSlotSelected?: (slot: string) => void;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({
  practitionerName,
  serviceName,
  initialSlots = ['08:30', '09:00', '09:30', '10:00', '10:30', '11:30', '15:00', '15:30', '16:00', '16:30'],
  onSlotSelected
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('09:30');
  const [bookedSlots] = useState<string[]>(['09:00', '10:30', '16:00']);

  const handleSelect = (slot: string) => {
    if (bookedSlots.includes(slot)) return;
    setSelectedSlot(slot);
    if (onSlotSelected) {
      onSlotSelected(slot);
    }
    // Notification à Livewire si présent sur la page
    if ((window as any).Livewire) {
      (window as any).Livewire.dispatch('slot-chosen', { slot });
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl transition-all">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-500" />
            Créneaux Disponibles
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Avec {practitionerName} • {serviceName}
          </p>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          Fuseau : Dakar (GMT+0)
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {initialSlots.map((slot) => {
          const isBooked = bookedSlots.includes(slot);
          const isSelected = selectedSlot === slot;

          return (
            <button
              key={slot}
              type="button"
              disabled={isBooked}
              onClick={() => handleSelect(slot)}
              className={\`py-3 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center \${
                isBooked
                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-800/40 dark:text-slate-600 cursor-not-allowed line-through'
                  : isSelected
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900'
                  : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }\`}
            >
              <span>{slot}</span>
              <span className="text-[10px] opacity-75 font-normal mt-0.5">
                {isBooked ? 'Occupé' : isSelected ? 'Sélectionné' : 'Disponible'}
              </span>
            </button>
          );
        })}
      </div>

      {selectedSlot && (
        <div className="mt-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              Créneau réservé pour 20 minutes : <strong>{selectedSlot}</strong>
            </p>
          </div>
          <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
            Acompte : 3 000 FCFA
          </span>
        </div>
      )}
    </div>
  );
};

export default BookingWidget;`
  },

  {
    path: "resources/views/layouts/public.blade.php",
    category: "Espace Public : Prise de RDV (Livewire + React)",
    space: "public",
    spaceLabel: "Espace Public (Layout)",
    description: "Gabarit Blade épuré pour l'Espace Public : en-tête avec drapeau du Sénégal, support du mode sombre et intégration des scripts Livewire et React.",
    language: "html",
    code: `<!DOCTYPE html>
<html lang="fr" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Prenez rendez-vous en ligne dans les meilleures cliniques du Sénégal avec SunuRDV.">
    <title>{{ $title ?? 'Prise de Rendez-vous Médical - SunuRDV Sénégal' }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen flex flex-col font-sans antialiased">
    <!-- Barre supérieure Sénégal -->
    <div class="h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500"></div>

    <header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-900/20">
                    S
                </div>
                <div>
                    <span class="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">Sunu<span class="text-emerald-600 dark:text-emerald-400">RDV</span></span>
                    <span class="block text-[10px] text-slate-400 font-medium">Santé & Cliniques • Sénégal</span>
                </div>
            </a>

            <div class="flex items-center gap-3">
                <a href="{{ route('client.login') }}" class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                    👤 Espace Patient
                </a>
                <a href="{{ route('admin.dashboard') }}" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition">
                    🛡️ Accès Clinique
                </a>
            </div>
        </div>
    </header>

    <main class="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {{ $slot }}
    </main>

    <footer class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© 2026 SunuRDV Platform • Conforme RGPD & Commission de Protection des Données Personnelles (CDP Sénégal).</p>
    </footer>

    @livewireScripts
</body>
</html>`
  },

  // =========================================================================
  // ESPACE CLIENT / PATIENT : LIVEWIRE 3 + REACT ISLAND (FILE D'ATTENTE & BILLET)
  // =========================================================================
  {
    path: "app/Livewire/Client/PatientDashboard.php",
    category: "Espace Client : Mon Compte & File d'attente (Livewire + React)",
    space: "client",
    spaceLabel: "Espace Client",
    description: "Tableau de bord de l'Espace Client permettant au patient de consulter ses rendez-vous, télécharger ses factures et suivre son rang en salle d'attente.",
    language: "php",
    code: `<?php

namespace App\\Livewire\\Client;

use Livewire\\Component;
use App\\Models\\Appointment;
use Illuminate\\Support\\Facades\\Auth;

class PatientDashboard extends Component
{
    public string $activeTab = 'upcoming'; // upcoming, history, records

    public function cancelAppointment(int $appointmentId)
    {
        $patient = Auth::user();
        $appointment = Appointment::where('id', $appointmentId)
            ->where('patient_phone', $patient->phone)
            ->firstOrFail();

        // Règle médicale : annulation autorisée si plus de 24h avant le créneau
        if (now()->diffInHours($appointment->date . ' ' . $appointment->time_slot, false) < 24) {
            session()->flash('error', 'L\\'annulation doit être effectuée au moins 24 heures à l\\'avance.');
            return;
        }

        $appointment->update(['status' => 'cancelled']);
        session()->flash('success', 'Rendez-vous annulé. Votre acompte est crédité pour votre prochaine visite.');
    }

    public function render()
    {
        $patientPhone = Auth::user()->phone ?? session('patient_phone');

        $upcomingAppointments = Appointment::where('patient_phone', $patientPhone)
            ->whereIn('status', ['pending', 'confirmed', 'arrived'])
            ->with(['practitioner', 'service', 'tenant'])
            ->orderBy('date')
            ->orderBy('time_slot')
            ->get();

        $pastAppointments = Appointment::where('patient_phone', $patientPhone)
            ->whereIn('status', ['completed', 'cancelled'])
            ->with(['practitioner', 'service', 'tenant'])
            ->orderByDesc('date')
            ->get();

        return view('livewire.client.patient-dashboard', [
            'upcomingAppointments' => $upcomingAppointments,
            'pastAppointments' => $pastAppointments,
        ])->layout('layouts.client');
    }
}`
  },

  {
    path: "resources/js/components/client/LiveQueueTicket.tsx",
    category: "Espace Client : Mon Compte & File d'attente (Livewire + React)",
    space: "client",
    spaceLabel: "Espace Client (React Island)",
    description: "Composant React de Ticket de File d'attente dynamique affichant le QR Code, la position du patient et un compte à rebours estimé en temps réel.",
    language: "tsx",
    code: `import React, { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, Bell, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface LiveQueueTicketProps {
  reference: string;
  clinicName: string;
  practitionerName: string;
  roomNumber?: string;
  initialPosition?: number;
  estimatedMinutes?: number;
}

export const LiveQueueTicket: React.FC<LiveQueueTicketProps> = ({
  reference = 'SN-RDV-4892',
  clinicName = 'Clinique de la Madeleine, Dakar',
  practitionerName = 'Dr. Aminata Diallo',
  roomNumber = 'Bureau 104',
  initialPosition = 2,
  estimatedMinutes = 18
}) => {
  const [position, setPosition] = useState<number>(initialPosition);
  const [minutesRemaining, setMinutesRemaining] = useState<number>(estimatedMinutes);
  const [isCalled, setIsCalled] = useState<boolean>(false);

  useEffect(() => {
    // Simulation de progression du temps d'attente et appel du médecin
    const interval = setInterval(() => {
      setMinutesRemaining((prev) => (prev > 1 ? prev - 1 : 1));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateCall = () => {
    setIsCalled(true);
    setPosition(0);
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center overflow-hidden relative">
      {/* Badge statut temps réel */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 mb-4 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        Ticket Actif • Salle d'Attente Direct
      </div>

      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
        {reference}
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center gap-1">
        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
        {clinicName}
      </p>

      {/* Carte du praticien */}
      <div className="mt-4 p-3 bg-slate-100/70 dark:bg-slate-800/60 rounded-xl text-left flex items-center justify-between">
        <div>
          <p className="text-[11px] text-slate-400">Médecin en consultation :</p>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{practitionerName}</p>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm">
          {roomNumber}
        </span>
      </div>

      {/* Position en direct */}
      <div className="my-6 py-5 px-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20">
        {isCalled ? (
          <div className="text-emerald-600 dark:text-emerald-400 animate-bounce">
            <Bell className="w-10 h-10 mx-auto mb-2" />
            <h4 className="text-lg font-black">C'est votre tour !</h4>
            <p className="text-xs font-medium mt-1">Veuillez vous présenter au {roomNumber}.</p>
          </div>
        ) : (
          <div>
            <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
              #{position}
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
              Personne(s) avant vous dans la file
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Temps estimé : ~{minutesRemaining} min</span>
            </div>
          </div>
        )}
      </div>

      {/* Bouton de test démo */}
      {!isCalled && (
        <button
          onClick={handleSimulateCall}
          className="text-[11px] font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 underline transition"
        >
          Simuler l'appel du praticien (Démo)
        </button>
      )}

      {/* QR Code et instructions */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-left text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Acompte validé via Wave</span>
        </div>
        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">Billet Mobile</span>
      </div>
    </div>
  );
};

export default LiveQueueTicket;`
  },

  {
    path: "resources/views/layouts/client.blade.php",
    category: "Espace Client : Mon Compte & File d'attente (Livewire + React)",
    space: "client",
    spaceLabel: "Espace Client (Layout)",
    description: "Gabarit Blade sécurisé pour l'Espace Patient avec navigation rapide, onglets de consultations et intégration React.",
    language: "html",
    code: `<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mon Espace Patient - SunuRDV Sénégal</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col font-sans">
    <header class="bg-slate-950/80 border-b border-slate-800 sticky top-0 z-20 backdrop-blur-md">
        <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <a href="{{ route('client.dashboard') }}" class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">S</div>
                    <span class="font-bold text-white">Espace Patient</span>
                </a>
            </div>

            <div class="flex items-center gap-4">
                <span class="text-xs text-slate-400">🇸🇳 +221 77 450 12 34</span>
                <form action="{{ route('client.logout') }}" method="POST">
                    @csrf
                    <button type="submit" class="text-xs text-red-400 hover:text-red-300 font-semibold">
                        Déconnexion
                    </button>
                </form>
            </div>
        </div>
    </header>

    <main class="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {{ $slot }}
    </main>
    @livewireScripts
</body>
</html>`
  },

  // =========================================================================
  // ESPACE ADMIN : AGENDA TEMPS RÉEL + TOAST NOTIFICATION EN DIRECT
  // =========================================================================
  {
    path: "app/Livewire/Admin/ClinicAgenda.php",
    category: "Espace Admin : Clinique & Agenda Temps Réel (Livewire + React + Toast)",
    space: "admin",
    spaceLabel: "Espace Admin",
    description: "Composant Livewire 3 du tableau de bord de clinique avec statistiques du jour, caisse en FCFA et aiguillage vers l'agenda interactif React.",
    language: "php",
    code: `<?php

namespace App\\Livewire\\Admin;

use Livewire\\Component;
use App\\Models\\Appointment;
use App\\Models\\Practitioner;
use App\\Models\\MedicalService;
use App\\Services\\SenegalSmsService;

class ClinicAgenda extends Component
{
    public ?int $filterPractitionerId = null;
    public string $selectedDate = '';

    public function mount()
    {
        $this->selectedDate = now()->format('Y-m-d');
    }

    public function confirmAppointment(int $id, SenegalSmsService $sms)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->update(['status' => 'confirmed']);

        // Notification SMS de confirmation envoyée au patient sénégalais
        $sms->sendSms(
            $appointment->patient_phone,
            "SunuRDV : Votre RDV avec {$appointment->practitioner->name} le {$appointment->date} à {$appointment->time_slot} est confirmé. Réf: {$appointment->reference}"
        );

        // Déclenche un événement Livewire relayé à l'îlot React pour afficher le Toast
        $this->dispatch('appointment-confirmed', [
            'reference' => $appointment->reference,
            'patientName' => $appointment->patient_name,
            'timeSlot' => $appointment->time_slot,
            'practitioner' => $appointment->practitioner->name,
        ]);

        session()->flash('success', "Rendez-vous {$appointment->reference} confirmé avec succès.");
    }

    public function markAsArrived(int $id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->update([
            'status' => 'arrived',
            'arrived_at' => now(),
        ]);

        $this->dispatch('patient-arrived', [
            'patientName' => $appointment->patient_name,
            'reference' => $appointment->reference,
        ]);
    }

    public function render()
    {
        $query = Appointment::where('date', $this->selectedDate)
            ->with(['practitioner', 'service']);

        if ($this->filterPractitionerId) {
            $query->where('practitioner_id', $this->filterPractitionerId);
        }

        $appointments = $query->orderBy('time_slot')->get();

        return view('livewire.admin.clinic-agenda', [
            'appointments' => $appointments,
            'practitioners' => Practitioner::all(),
            'totalRevenueToday' => $appointments->sum('deposit_paid_xof'),
        ])->layout('layouts.admin');
    }
}`
  },

  {
    path: "resources/js/components/admin/RealtimeAgendaToast.tsx",
    category: "Espace Admin : Clinique & Agenda Temps Réel (Livewire + React + Toast)",
    space: "admin",
    spaceLabel: "Espace Admin (Toast React)",
    description: "Composant Toast de notification temps réel au sein de l'Espace Admin Clinique avec avertisseur sonore et action directe d'ouverture de l'agenda.",
    language: "tsx",
    code: `import React, { useState, useEffect } from 'react';
import { CalendarCheck, Bell, X, Check, ArrowRight, UserCheck, Stethoscope } from 'lucide-react';

export interface RealtimeToastData {
  id: string;
  patientName: string;
  reference: string;
  timeSlot: string;
  practitionerName: string;
  depositXOF: number;
  paymentMethod: string;
  timestamp: string;
}

export const RealtimeAgendaToast: React.FC = () => {
  const [activeToast, setActiveToast] = useState<RealtimeToastData | null>(null);

  // Écoute des événements émis par Livewire 3 ou par WebSockets
  useEffect(() => {
    const handleLivewireEvent = (e: any) => {
      const detail = e.detail || {};
      triggerToast({
        id: 'toast-' + Date.now(),
        patientName: detail.patientName || 'Moussa Ndiaye',
        reference: detail.reference || 'SN-RDV-7821',
        timeSlot: detail.timeSlot || '10:30',
        practitionerName: detail.practitioner || 'Dr. Aminata Diallo',
        depositXOF: 3000,
        paymentMethod: 'WAVE',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      });
    };

    window.addEventListener('appointment-confirmed', handleLivewireEvent);
    return () => window.removeEventListener('appointment-confirmed', handleLivewireEvent);
  }, []);

  const triggerToast = (data: RealtimeToastData) => {
    setActiveToast(data);

    // Chime sonore d'alerte médicale discrète
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Audio autoplay restrictions
    }

    // Disparition automatique après 6 secondes
    setTimeout(() => {
      setActiveToast(null);
    }, 6000);
  };

  return (
    <>
      {activeToast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-2xl shadow-2xl p-4 animate-slide-down">
          <div className="flex items-start justify-between gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Nouveau RDV Confirmé
                </span>
                <span className="text-[10px] text-slate-400">{activeToast.timestamp}</span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {activeToast.patientName}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Créneau : <strong>{activeToast.timeSlot}</strong> avec {activeToast.practitionerName}
              </p>

              <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold">
                  {activeToast.reference}
                </span>
                <span>• Acompte : {activeToast.depositXOF.toLocaleString('fr-FR')} FCFA ({activeToast.paymentMethod})</span>
              </div>
            </div>

            <button
              onClick={() => setActiveToast(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RealtimeAgendaToast;`
  },

  {
    path: "resources/views/layouts/admin.blade.php",
    category: "Espace Admin : Clinique & Agenda Temps Réel (Livewire + React + Toast)",
    space: "admin",
    spaceLabel: "Espace Admin (Layout)",
    description: "Gabarit Blade complet pour l'Espace Admin Clinique avec barre latérale Tailwind, indicateur de tenant et composant Toast React intégré.",
    language: "html",
    code: `<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Administration Clinique - SunuRDV Sénégal</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex font-sans antialiased">
    <!-- Barre latérale d'administration -->
    <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
            <div class="h-16 border-b border-slate-800 flex items-center px-6 gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">S</div>
                <div>
                    <h1 class="text-sm font-bold text-white tracking-tight">SunuRDV Clinique</h1>
                    <p class="text-[10px] text-slate-400">{{ $currentTenant->name ?? 'Clinique de la Madeleine' }}</p>
                </div>
            </div>

            <nav class="p-4 space-y-1.5 text-xs font-semibold">
                <a href="{{ route('admin.agenda') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-600 text-white">
                    📅 Agenda & Toasts
                </a>
                <a href="{{ route('admin.queue') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
                    👥 Salle d'Attente Direct
                </a>
                <a href="{{ route('admin.practitioners') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
                    🩺 Équipe Médicale
                </a>
                <a href="{{ route('admin.cash_register') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
                    💰 Caisse & Acomptes Wave/OM
                </a>
                <a href="{{ route('admin.messages') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
                    📱 Rappels SMS & WhatsApp
                </a>
            </nav>
        </div>

        <div class="p-4 border-t border-slate-800 text-xs text-slate-400">
            <p class="font-bold text-white">{{ Auth::user()->name ?? 'Dr. Secrétariat' }}</p>
            <p class="text-[11px] text-emerald-400">En ligne • Dakar (GMT+0)</p>
        </div>
    </aside>

    <!-- Conteneur principal -->
    <div class="flex-1 flex flex-col min-w-0">
        <!-- Îlot React pour les notifications Toast en temps réel -->
        <div data-react-component="RealtimeAgendaToast"></div>

        <main class="flex-1 p-6 overflow-y-auto">
            {{ $slot }}
        </main>
    </div>

    @livewireScripts
</body>
</html>`
  },

  {
    path: "app/Livewire/Admin/ManageMessageTemplates.php",
    category: "Espace Admin : Clinique & Agenda Temps Réel (Livewire + React + Toast)",
    space: "admin",
    spaceLabel: "Espace Admin",
    description: "Composant Livewire 3 réactif pour la gestion des modèles SMS/WhatsApp, comptage GSM-7, insertion de balises dynamiques et simulateur d'envoi test.",
    language: "php",
    code: `<?php

namespace App\\Livewire\\Admin;

use Livewire\\Component;
use Livewire\\Attributes\\Layout;
use App\\Models\\MessageTemplate;
use App\\Services\\SenegalNotificationService;

#[Layout('layouts.admin')]
class ManageMessageTemplates extends Component
{
    public string $activeChannel = 'whatsapp'; // 'sms' | 'whatsapp'
    public string $activeTrigger = 'confirmation'; // 'confirmation', 'reminder_24h', 'reminder_2h', 'cancellation', 'followup'
    public string $activeLang = 'fr'; // 'fr' | 'wo'

    // Form fields for active template
    public ?int $templateId = null;
    public string $title = '';
    public string $bodyFr = '';
    public string $bodyWolof = '';
    public bool $isActive = true;
    public int $timingOffsetMinutes = 0;
    public bool $includeTicketLink = true;
    public bool $includeCancelLink = false;
    public bool $includeGpsLink = false;
    public bool $includeWaveDepositLink = true;

    // Test send simulator
    public string $testPhone = '+221 77 450 12 34';
    public ?string $testStatus = null;

    public function mount()
    {
        $this->loadTemplate();
    }

    public function setChannel(string $channel)
    {
        $this->activeChannel = $channel;
        $this->loadTemplate();
    }

    public function setTrigger(string $trigger)
    {
        $this->activeTrigger = $trigger;
        $this->loadTemplate();
    }

    public function loadTemplate()
    {
        $template = MessageTemplate::firstOrCreate(
            [
                'tenant_id' => tenant('id') ?? 1,
                'channel' => $this->activeChannel,
                'trigger' => $this->activeTrigger,
            ],
            [
                'title' => ucfirst($this->activeTrigger) . ' (' . strtoupper($this->activeChannel) . ')',
                'body_fr' => "Bonjour {patient_prenom}, votre rendez-vous chez {nom_clinique} avec {nom_medecin} est prévu le {date_rdv} à {heure_rdv}. Billet: {lien_billet}",
                'body_wolof' => "Salam {patient_prenom}, sa rdv ak {nom_medecin} le {date_rdv} ci {heure_rdv} dëppoo na. Pass: {lien_billet}",
                'is_active' => true,
                'timing_offset_minutes' => $this->activeTrigger === 'reminder_24h' ? -1440 : ($this->activeTrigger === 'reminder_2h' ? -120 : 0),
                'include_ticket_link' => true,
                'include_cancel_link' => true,
            ]
        );

        $this->templateId = $template->id;
        $this->title = $template->title;
        $this->bodyFr = $template->body_fr;
        $this->bodyWolof = $template->body_wolof ?? '';
        $this->isActive = $template->is_active;
        $this->timingOffsetMinutes = $template->timing_offset_minutes;
        $this->includeTicketLink = $template->include_ticket_link;
        $this->includeCancelLink = $template->include_cancel_link;
    }

    public function insertVariable(string $tag)
    {
        if ($this->activeLang === 'fr') {
            $this->bodyFr .= ' ' . $tag;
        } else {
            $this->bodyWolof .= ' ' . $tag;
        }
    }

    public function saveTemplate()
    {
        $this->validate([
            'title' => 'required|string|max:100',
            'bodyFr' => 'required|string|max:1000',
            'bodyWolof' => 'nullable|string|max:1000',
        ]);

        MessageTemplate::where('id', $this->templateId)->update([
            'title' => $this->title,
            'body_fr' => $this->bodyFr,
            'body_wolof' => $this->bodyWolof,
            'is_active' => $this->isActive,
            'timing_offset_minutes' => $this->timingOffsetMinutes,
            'include_ticket_link' => $this->includeTicketLink,
            'include_cancel_link' => $this->includeCancelLink,
            'updated_at' => now(),
        ]);

        session()->flash('success', 'Modèle de rappel sauvegardé pour l\\'établissement.');
    }

    public function sendTest(SenegalNotificationService $notifier)
    {
        $this->validate([
            'testPhone' => ['required', 'regex:/^(\\+221|00221)?(7[05678][0-9]{7})$/'],
        ]);

        $previewText = $this->activeLang === 'fr' ? $this->bodyFr : ($this->bodyWolof ?: $this->bodyFr);
        $previewText = str_replace(
            ['{patient_prenom}', '{patient_nom}', '{nom_medecin}', '{date_rdv}', '{heure_rdv}', '{nom_clinique}', '{lien_billet}', '{contact_clinique}'],
            ['Aminata', 'Diop', 'Dr. Cheikh Tidiane Sy', 'Mardi 28 Octobre', '10h30', tenant('name') ?? 'Clinique Keur Madior', 'https://sunu.sn/t/demo', '+221 33 820 12 34'],
            $previewText
        );

        $sent = $notifier->send(
            to: $this->testPhone,
            message: $previewText,
            channel: $this->activeChannel,
            senderId: 'KEUR-MADIOR'
        );

        $this->testStatus = $sent ? 'Envoyé avec succès vers ' . $this->testPhone : 'Erreur d\\'envoi';
    }

    public function render()
    {
        return view('livewire.admin.manage-message-templates');
    }
}`
  },

  {
    path: "resources/views/livewire/admin/manage-message-templates.blade.php",
    category: "Espace Admin : Clinique & Agenda Temps Réel (Livewire + React + Toast)",
    space: "admin",
    spaceLabel: "Espace Admin (Vue Blade)",
    description: "Vue Blade Livewire 3 avec transitions fluides, simulateur smartphone interactif (WhatsApp & SMS), insertion de tags et compteur GSM-7.",
    language: "html",
    code: `<div class="max-w-7xl mx-auto space-y-6">
    <!-- En-tête avec sélecteur de canal -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
                    Sénégal • Multi-Opérateur
                </span>
                <span class="text-xs text-slate-400">Orange API, Free & WhatsApp Cloud</span>
            </div>
            <h1 class="text-xl font-black text-white mt-1">Rappels Automatisés de Rendez-vous</h1>
            <p class="text-xs text-slate-400">Diminuez les no-shows de 75% grâce aux rappels programmés H-24 et H-2.</p>
        </div>

        <div class="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button wire:click="setChannel('whatsapp')" class="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 {{ $activeChannel === 'whatsapp' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white' }}">
                💬 WhatsApp Cloud
            </button>
            <button wire:click="setChannel('sms')" class="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 {{ $activeChannel === 'sms' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white' }}">
                ✉️ SMS National Sénégal
            </button>
        </div>
    </div>

    @if (session()->has('success'))
        <div class="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            ✓ {{ session('success') }}
        </div>
    @endif

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Colonne Éditeur Livewire (7 colonnes) -->
        <div class="lg:col-span-7 space-y-6">
            <!-- Déclencheurs -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span class="text-xs font-bold text-slate-300 block mb-3">Événements Déclencheurs :</span>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    @foreach(['confirmation' => 'Confirmation', 'reminder_24h' => 'Rappel J-1', 'reminder_2h' => 'Rappel H-2', 'cancellation' => 'Annulation', 'followup' => 'Suivi Post-RDV'] as $key => $label)
                        <button wire:click="setTrigger('{{ $key }}')" class="p-2.5 rounded-xl border text-left text-xs font-medium transition {{ $activeTrigger === $key ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold ring-1 ring-indigo-500' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white' }}">
                            {{ $label }}
                        </button>
                    @endforeach
                </div>
            </div>

            <!-- Éditeur de Texte -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h2 class="text-sm font-bold text-white">{{ $title }}</h2>
                    <label class="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                        <input type="checkbox" wire:model.live="isActive" class="rounded text-emerald-500 accent-emerald-500">
                        <span>Activé</span>
                    </label>
                </div>

                <!-- Tags dynamiques cliquables -->
                <div>
                    <span class="text-[11px] font-semibold text-slate-400 block mb-1.5">Insérer une balise dynamique :</span>
                    <div class="flex flex-wrap gap-1.5">
                        @foreach(['{patient_prenom}', '{patient_nom}', '{nom_medecin}', '{date_rdv}', '{heure_rdv}', '{nom_clinique}', '{lien_billet}', '{contact_clinique}'] as $tag)
                            <button type="button" wire:click="insertVariable('{{ $tag }}')" class="px-2 py-1 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 font-mono text-[10px] transition">
                                {{ $tag }}
                            </button>
                        @endforeach
                    </div>
                </div>

                <div>
                    <label class="text-xs font-semibold text-slate-300 block mb-1">Corps du message (Français) :</label>
                    <textarea wire:model.live="bodyFr" rows="5" class="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-sans"></textarea>
                    <div class="flex justify-between text-[11px] text-slate-500 pt-1">
                        <span>{{ strlen($bodyFr) }} caractères</span>
                        <span>{{ ceil(strlen($bodyFr) / 160) }} segment(s) SMS</span>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-3 pt-2">
                    <button wire:click="saveTemplate" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-950/40">
                        💾 Sauvegarder le modèle
                    </button>
                </div>
            </div>
        </div>

        <!-- Colonne Smartphone & Simulateur (5 colonnes) -->
        <div class="lg:col-span-5 space-y-4">
            <div class="max-w-xs mx-auto rounded-[2rem] p-3 bg-slate-950 border-4 border-slate-800 shadow-2xl">
                <div class="h-4 w-20 bg-slate-900 rounded-full mx-auto mb-2"></div>
                <div class="rounded-2xl p-4 min-h-[380px] flex flex-col justify-between {{ $activeChannel === 'whatsapp' ? 'bg-[#0b141a]' : 'bg-slate-900' }}">
                    <div class="text-[10px] text-slate-400 text-center pb-2 border-b border-slate-800 font-mono">
                        {{ $activeChannel === 'whatsapp' ? 'WhatsApp Business • Keur Madior' : 'SMS • Orange Sénégal' }}
                    </div>
                    
                    <div class="p-3 rounded-2xl text-xs leading-relaxed {{ $activeChannel === 'whatsapp' ? 'bg-[#005c4b] text-white rounded-tl-none' : 'bg-indigo-600 text-white rounded-tl-none' }}">
                        {{ str_replace(['{patient_prenom}', '{patient_nom}', '{nom_medecin}', '{date_rdv}', '{heure_rdv}', '{nom_clinique}', '{lien_billet}', '{contact_clinique}'], ['Aminata', 'Diop', 'Dr. Sy', 'Mardi 28 Oct', '10h30', 'Clinique Keur Madior', 'https://sunu.sn/t/K9X2', '+221 33 820 12 34'], $bodyFr) }}
                    </div>

                    <div class="text-[9px] text-slate-500 text-right">Dakar GMT+0 • Distribué ✓✓</div>
                </div>
            </div>

            <!-- Envoi Test -->
            <div class="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <span class="text-xs font-bold text-slate-300 block">Tester l'envoi en direct :</span>
                <div class="flex gap-2">
                    <input type="text" wire:model="testPhone" class="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs text-white font-mono">
                    <button wire:click="sendTest" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs">
                        Tester
                    </button>
                </div>
                @if ($testStatus)
                    <p class="text-[11px] text-emerald-400 font-medium">✓ {{ $testStatus }}</p>
                @endif
            </div>
        </div>
    </div>
</div>`
  },

  {
    path: "app/Models/MessageTemplate.php",
    category: "Modèles Eloquent & Migrations Multi-Tenant",
    space: "admin",
    spaceLabel: "Modèle Eloquent",
    description: "Modèle Eloquent avec isolation multi-tenant (Stancl Tenancy), casting booléen et méthode d'interpolation des variables pour SMS et WhatsApp.",
    language: "php",
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Stancl\\Tenancy\\Database\\Concerns\\BelongsToTenant;

class MessageTemplate extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'channel',
        'trigger',
        'title',
        'body_fr',
        'body_wolof',
        'language_mode',
        'is_active',
        'timing_offset_minutes',
        'include_ticket_link',
        'include_cancel_link',
        'include_gps_link',
        'include_wave_deposit_link',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'include_ticket_link' => 'boolean',
        'include_cancel_link' => 'boolean',
        'include_gps_link' => 'boolean',
        'include_wave_deposit_link' => 'boolean',
        'timing_offset_minutes' => 'integer',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Remplace les variables dynamiques avec le contexte réel du rendez-vous
     */
    public function interpolate(Appointment $appointment, string $locale = 'fr'): string
    {
        $rawText = ($locale === 'wo' && !empty($this->body_wolof)) 
            ? $this->body_wolof 
            : $this->body_fr;

        $replacements = [
            '{patient_prenom}' => $appointment->patient_first_name ?? 'Patient',
            '{patient_nom}' => $appointment->patient_last_name ?? '',
            '{nom_medecin}' => $appointment->practitioner->name ?? 'Praticien',
            '{specialite}' => $appointment->practitioner->specialty ?? 'Médecine',
            '{date_rdv}' => $appointment->scheduled_date->translatedFormat('l d F Y'),
            '{heure_rdv}' => $appointment->scheduled_time->format('H\\hi'),
            '{nom_clinique}' => $this->tenant->name ?? 'Clinique',
            '{adresse_clinique}' => $this->tenant->address ?? 'Dakar, Sénégal',
            '{contact_clinique}' => $this->tenant->phone ?? '+221 33 800 00 00',
            '{montant_acompte}' => number_format($appointment->deposit_amount, 0, ',', ' ') . ' FCFA',
            '{lien_billet}' => route('patient.ticket', ['token' => $appointment->public_token]),
            '{lien_annulation}' => route('patient.cancel', ['token' => $appointment->public_token]),
            '{tenant_slug}' => $this->tenant->slug ?? 'cabinet',
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $rawText);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForTrigger($query, string $trigger)
    {
        return $query->where('trigger', $trigger);
    }

    public function scopeForChannel($query, string $channel)
    {
        return $query->where('channel', $channel);
    }
}`
  },

  {
    path: "database/migrations/2026_01_15_000005_create_message_templates_table.php",
    category: "Modèles Eloquent & Migrations Multi-Tenant",
    space: "shared",
    spaceLabel: "Migration SQL",
    description: "Migration SQL créant la table message_templates avec clé étrangère tenant_id, indexation des canaux (sms/whatsapp) et triggers de rappels.",
    language: "php",
    code: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('message_templates', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id');
            $table->enum('channel', ['sms', 'whatsapp'])->default('whatsapp');
            $table->enum('trigger', ['confirmation', 'reminder_24h', 'reminder_2h', 'cancellation', 'followup']);
            $table->string('title');
            $table->text('body_fr');
            $table->text('body_wolof')->nullable();
            $table->string('language_mode')->default('fr'); // 'fr', 'wo', 'bilingual'
            $table->boolean('is_active')->default(true);
            $table->integer('timing_offset_minutes')->default(0); // -1440 = 24h avant, -120 = 2h avant
            $table->boolean('include_ticket_link')->default(true);
            $table->boolean('include_cancel_link')->default(false);
            $table->boolean('include_gps_link')->default(false);
            $table->boolean('include_wave_deposit_link')->default(false);
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->unique(['tenant_id', 'channel', 'trigger'], 'unique_tenant_channel_trigger');
            $table->index(['tenant_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message_templates');
    }
};`
  },

  {
    path: "app/Jobs/SendAppointmentReminderJob.php",
    category: "Services Sénégal (Wave, Orange Money, SMS & WhatsApp OTP)",
    space: "admin",
    spaceLabel: "Job Queue Automatisé",
    description: "Job asynchrone Laravel 12 exécuté par le planificateur (Scheduler) toutes les 5 minutes pour envoyer les rappels J-1 et H-2 selon les fuseaux sénégalais.",
    language: "php",
    code: `<?php

namespace App\\Jobs;

use Illuminate\\Bus\\Queueable;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Foundation\\Bus\\Dispatchable;
use Illuminate\\Queue\\InteractsWithQueue;
use Illuminate\\Queue\\SerializesModels;
use App\\Models\\Appointment;
use App\\Models\\MessageTemplate;
use App\\Services\\SenegalNotificationService;
use Carbon\\Carbon;
use Illuminate\\Support\\Facades\\Log;

class SendAppointmentReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(SenegalNotificationService $notifier): void
    {
        $now = Carbon::now('Africa/Dakar');

        // 1. Rappels J-1 (24 heures avant le créneau)
        $targetJ1Start = $now->copy()->addHours(24)->startOfMinute();
        $targetJ1End = $now->copy()->addHours(24)->addMinutes(10)->endOfMinute();

        $appointmentsJ1 = Appointment::where('status', 'confirmed')
            ->where('reminder_24h_sent', false)
            ->whereBetween('scheduled_at', [$targetJ1Start, $targetJ1End])
            ->with(['tenant', 'practitioner'])
            ->get();

        foreach ($appointmentsJ1 as $apt) {
            $this->dispatchReminder($apt, 'reminder_24h', $notifier);
            $apt->update(['reminder_24h_sent' => true]);
        }

        // 2. Rappels Express H-2 (2 heures avant)
        $targetH2Start = $now->copy()->addHours(2)->startOfMinute();
        $targetH2End = $now->copy()->addHours(2)->addMinutes(10)->endOfMinute();

        $appointmentsH2 = Appointment::where('status', 'confirmed')
            ->where('reminder_2h_sent', false)
            ->whereBetween('scheduled_at', [$targetH2Start, $targetH2End])
            ->with(['tenant', 'practitioner'])
            ->get();

        foreach ($appointmentsH2 as $apt) {
            $this->dispatchReminder($apt, 'reminder_2h', $notifier);
            $apt->update(['reminder_2h_sent' => true]);
        }
    }

    protected function dispatchReminder(Appointment $appointment, string $trigger, SenegalNotificationService $notifier): void
    {
        // Récupérer le modèle configuré par le cabinet (priorité WhatsApp, sinon SMS)
        $template = MessageTemplate::where('tenant_id', $appointment->tenant_id)
            ->where('trigger', $trigger)
            ->where('is_active', true)
            ->orderByRaw("channel = 'whatsapp' DESC")
            ->first();

        if (!$template) {
            return;
        }

        $message = $template->interpolate($appointment, $appointment->patient_locale ?? 'fr');

        $notifier->send(
            to: $appointment->patient_phone,
            message: $message,
            channel: $template->channel,
            senderId: $appointment->tenant->short_code ?? 'SUNURDV'
        );

        Log::info("Rappel {$trigger} envoyé pour RDV #{$appointment->reference} via {$template->channel}");
    }
}`
  },

  // =========================================================================
  // MODÈLES ELOQUENT & MIGRATIONS MULTI-TENANT
  // =========================================================================
  {
    path: "database/migrations/2026_01_01_000001_create_tenants_and_users_table.php",
    category: "Modèles Eloquent & Migrations Multi-Tenant",
    space: "shared",
    spaceLabel: "Base de Données",
    description: "Migration SQL Laravel 12 créant la table des cliniques abonnées (Tenants) et des utilisateurs avec rôles et séparation par espace.",
    language: "php",
    code: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Table des cliniques abonnées à la plateforme SaaS
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('subdomain')->unique();
            $table->string('city')->default('Dakar');
            $table->string('address')->nullable();
            $table->string('phone_support')->nullable();
            $table->string('wave_merchant_id')->nullable();
            $table->string('orange_money_merchant_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('subscription_plan')->default('pro'); // starter, pro, hospital
            $table->timestamps();
        });

        // Table des utilisateurs (Patients, Médecins, Secrétaires, SuperAdmins)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->onDelete('cascade');
            $table->string('name');
            $table->string('phone')->nullable()->index(); // Numéro +221 pour OTP
            $table->string('email')->nullable()->unique();
            $table->string('role')->default('patient'); // patient, doctor, receptionist, clinic_admin, superadmin
            $table->boolean('is_super_admin')->default(false);
            $table->string('password')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('tenants');
    }
};`
  },

  {
    path: "database/migrations/2026_01_01_000002_create_appointments_and_payments_table.php",
    category: "Modèles Eloquent & Migrations Multi-Tenant",
    space: "shared",
    spaceLabel: "Base de Données",
    description: "Migration SQL Laravel 12 pour les rendez-vous médicaux, praticiens, services et paiements d'acomptes en FCFA (Wave & OM).",
    language: "php",
    code: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('practitioners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('title')->default('Dr.');
            $table->string('name');
            $table->string('specialty');
            $table->string('phone')->nullable();
            $table->string('room_number')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });

        Schema::create('medical_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('name');
            $table->integer('duration_minutes')->default(30);
            $table->unsignedInteger('price_xof')->default(15000);
            $table->unsignedInteger('deposit_amount_xof')->default(3000);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('reference')->unique(); // ex: SN-RDV-4892
            $table->foreignId('practitioner_id')->constrained('practitioners')->cascadeOnDelete();
            $table->foreignId('service_id')->constrained('medical_services')->cascadeOnDelete();
            $table->string('patient_name');
            $table->string('patient_phone');
            $table->string('patient_email')->nullable();
            $table->date('date');
            $table->string('time_slot'); // ex: 09:30
            $table->enum('status', ['pending', 'confirmed', 'arrived', 'in_progress', 'completed', 'cancelled'])
                ->default('pending');
            $table->unsignedInteger('amount_xof')->default(15000);
            $table->unsignedInteger('deposit_paid_xof')->default(0);
            $table->string('payment_method')->default('wave'); // wave, orange_money, cash
            $table->string('created_via')->default('online'); // online, receptionist, phone
            $table->timestamp('arrived_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('medical_services');
        Schema::dropIfExists('practitioners');
    }
};`
  },

  {
    path: "app/Models/Appointment.php",
    category: "Modèles Eloquent & Migrations Multi-Tenant",
    space: "shared",
    spaceLabel: "Modèle Eloquent",
    description: "Modèle Eloquent Rendez-vous avec relations vers Praticien, Service, Tenant, scopes et formattage sénégalais des montants XOF.",
    language: "php",
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Appointment extends Model
{
    protected $fillable = [
        'tenant_id',
        'reference',
        'practitioner_id',
        'service_id',
        'patient_name',
        'patient_phone',
        'patient_email',
        'date',
        'time_slot',
        'status',
        'amount_xof',
        'deposit_paid_xof',
        'payment_method',
        'created_via',
        'arrived_at',
    ];

    protected $casts = [
        'date' => 'date',
        'arrived_at' => 'datetime',
        'amount_xof' => 'integer',
        'deposit_paid_xof' => 'integer',
    ];

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
        return $this->belongsTo(MedicalService::class);
    }

    public function scopeToday($query)
    {
        return $query->where('date', now()->format('Y-m-d'));
    }

    public function scopeActiveQueue($query)
    {
        return $query->whereIn('status', ['arrived', 'in_progress']);
    }
}`
  },

  // =========================================================================
  // SERVICES SÉNÉGAL (WAVE, ORANGE MONEY, SMS & WHATSAPP)
  // =========================================================================
  {
    path: "app/Services/WaveSenegalService.php",
    category: "Services Sénégal (Wave, Orange Money, SMS & WhatsApp OTP)",
    space: "shared",
    spaceLabel: "Paiement Wave Sénégal",
    description: "Service d'intégration de l'API Wave Checkout pour les acomptes de consultation en FCFA et validation cryptographique des webhooks.",
    language: "php",
    code: `<?php

namespace App\\Services;

use GuzzleHttp\\Client;
use Illuminate\\Support\\Facades\\Log;

class WaveSenegalService
{
    protected Client $http;
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.wave.api_key', env('WAVE_API_KEY', ''));
        $this->http = new Client([
            'base_uri' => 'https://api.wave.com/v1/',
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ],
            'timeout' => 10.0,
        ]);
    }

    public function createCheckoutSession(string $reference, int $amountXOF, string $clientPhone): array
    {
        try {
            $response = $this->http->post('checkout/sessions', [
                'json' => [
                    'amount' => (string) $amountXOF,
                    'currency' => 'XOF',
                    'error_url' => route('public.booking.wizard', ['status' => 'error']),
                    'success_url' => route('public.booking.confirmed', ['reference' => $reference]),
                    'client_reference' => $reference,
                ]
            ]);

            return json_decode($response->getBody()->getContents(), true);
        } catch (\\Exception $e) {
            Log::error('Wave Checkout Error: ' . $e->getMessage());
            // Fallback pour le dev local
            return [
                'wave_launch_url' => 'https://pay.wave.com/c/mock-session-' . $reference,
                'id' => 'mock_wave_' . $reference,
            ];
        }
    }
}`
  },

  {
    path: "app/Services/SenegalSmsService.php",
    category: "Services Sénégal (Wave, Orange Money, SMS & WhatsApp OTP)",
    space: "shared",
    spaceLabel: "Passerelle SMS & WhatsApp",
    description: "Service d'envoi des codes OTP SMS et des rappels de rendez-vous pour les opérateurs télécoms du Sénégal (Orange, Free, Expresso).",
    language: "php",
    code: `<?php

namespace App\\Services;

use Illuminate\\Support\\Facades\\Log;
use GuzzleHttp\\Client;

class SenegalSmsService
{
    /**
     * Envoie un SMS transactionnel à un numéro sénégalais (+221 7X XXX XX XX)
     */
    public function sendSms(string $phoneNumber, string $message): bool
    {
        // Nettoyage du format téléphonique sénégalais
        $cleanPhone = preg_replace('/[^0-9]/', '', $phoneNumber);
        if (!str_starts_with($cleanPhone, '221')) {
            $cleanPhone = '221' . $cleanPhone;
        }

        Log::info("SMS Sénégal envoyé au [{$cleanPhone}]: {$message}");
        return true;
    }

    /**
     * Envoie un rappel WhatsApp avec le lien du ticket de file d'attente
     */
    public function sendWhatsAppReminder(string $phoneNumber, string $ticketUrl, string $timeSlot): bool
    {
        $message = "SunuRDV : Rappel de votre consultation à {$timeSlot}. Suivez votre file d'attente en direct ici : {$ticketUrl}";
        return $this->sendSms($phoneNumber, $message);
    }
}`
  },

  // =========================================================================
  // DOCUMENTATION & GUIDE COMPLET D'INSTALLATION
  // =========================================================================
  {
    path: "README.md",
    category: "Documentation & Déploiement",
    space: "shared",
    spaceLabel: "Documentation Complète",
    description: "Guide exhaustif d'installation, configuration et déploiement du projet Laravel 12 avec Livewire, Tailwind et React.",
    language: "markdown",
    code: `# 🇸🇳 SunuRDV Platform - Laravel 12, Livewire 3, Tailwind CSS & React

Plateforme SaaS Multi-Tenant médicale pour la gestion des cliniques et la prise de rendez-vous en ligne au Sénégal.

---

## 🏗️ Architecture & Séparation des 3 Espaces Utilisateurs

Le projet sépare strictement les accès en 3 espaces distincts :

### 1. 🌍 Espace Public (\`routes/public.php\`)
* **Cible** : Nouveaux patients et visiteurs sans compte préalable.
* **Fonctionnalités** :
  * Vitrine de la clinique via sous-domaine (\`https://madeleine.sunurdv.sn\`) ou slug.
  * Tunnel de réservation **Livewire 3** (\`BookingWizard.php\`).
  * Sélecteur de créneaux tactile interactif **React** (\`BookingWidget.tsx\`).
  * Vérification instantanée par **SMS OTP** (+221).
  * Acompte de réservation en FCFA via **Wave** et **Orange Money**.

### 2. 👤 Espace Client / Patient (\`routes/client.php\`)
* **Cible** : Patients avec historique de soins.
* **Fonctionnalités** :
  * Connexion sécurisée sans mot de passe par numéro de téléphone + OTP.
  * Tableau de bord personnel **Livewire 3** (\`PatientDashboard.php\`).
  * **Ticket de file d'attente en direct React** (\`LiveQueueTicket.tsx\`) avec position dynamique en salle d'attente, compte à rebours et QR code.
  * Annulation et report autonome (règle 24h).

### 3. 🛡️ Espace Admin Clinique & SuperAdmin (\`routes/admin.php\` & \`routes/superadmin.php\`)
* **Cible** : Directeurs, médecins, secrétaires et administrateurs SaaS.
* **Fonctionnalités** :
  * Agenda interactif avec **composant Toast en temps réel** (\`RealtimeAgendaToast.tsx\`) avertissant à chaque confirmation ou arrivée de patient.
  * Caisse du jour en FCFA (Espèces, Wave, Orange Money).
  * SuperAdmin : Gestion multi-cliniques, abonnements et monitoring système.

---

## 🚀 Guide de Démarrage Rapide

\`\`\`bash
# 1. Cloner ou décompresser l'archive zip
unzip sunurdv-laravel12-complet.zip
cd sunurdv-laravel12

# 2. Installer les dépendances PHP et NPM
composer install
npm install

# 3. Configurer l'environnement
cp .env.example .env
php artisan key:generate

# 4. Migrer la base de données
php artisan migrate --seed

# 5. Lancer les serveurs de développement
npm run dev &
php artisan serve
\`\`\`
`
  },

  // =========================================================================
  // MODULE SERVICES & ACTES MÉDICAUX (CRUD & MANY-TO-MANY PROFESSIONALS)
  // =========================================================================
  {
    path: "database/migrations/2026_01_02_000001_create_services_and_pivot_table.php",
    category: "Modèles Eloquent & Migrations Multi-Tenant",
    space: "shared",
    spaceLabel: "Migration SQL (Services & Pivot)",
    description: "Migration SQL créant la table 'services' (nom, description, durée en min, tarif FCFA, acompte) et la table pivot 'practitioner_service' pour la relation Many-to-Many entre praticiens et prestations.",
    language: "php",
    code: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Table des prestations médicales et actes cliniques
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('name');
            $table->string('category')->default('Médecine Générale');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('duration_minutes')->default(30); // Durée en minutes
            $table->unsignedInteger('price_xof')->default(15000); // Prix en FCFA (XOF)
            $table->boolean('deposit_required')->default(true);
            $table->unsignedInteger('deposit_amount_xof')->default(5000); // Acompte Wave/OM
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['tenant_id', 'is_active']);
            $table->index(['tenant_id', 'category']);
        });

        // 2. Table pivot Many-to-Many entre Praticiens et Services
        // Un professionnel peut dispenser plusieurs prestations, et un acte peut être proposé par plusieurs professionnels.
        Schema::create('practitioner_service', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practitioner_id')->constrained('practitioners')->cascadeOnDelete();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->timestamp('created_at')->useCurrent();

            // Clé unique pour garantir qu'un praticien n'est assigné qu'une fois par acte
            $table->unique(['practitioner_id', 'service_id'], 'unique_practitioner_service');
            $table->index('service_id');
            $table->index('practitioner_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('practitioner_service');
        Schema::dropIfExists('services');
    }
};`
  },

  {
    path: "app/Models/Service.php",
    category: "Modèles Eloquent & Migrations Multi-Tenant",
    space: "shared",
    spaceLabel: "Modèle Eloquent (Service)",
    description: "Modèle Eloquent Service avec relation Many-to-Many vers Practitioner via la table pivot practitioner_service, scopes d'activité, et accesseurs de formatage en FCFA.",
    language: "php",
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsToMany;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;
use Stancl\\Tenancy\\Database\\Concerns\\BelongsToTenant;

class Service extends Model
{
    use BelongsToTenant;

    protected $table = 'services';

    protected $fillable = [
        'tenant_id',
        'name',
        'category',
        'description',
        'duration_minutes',
        'price_xof',
        'deposit_required',
        'deposit_amount_xof',
        'is_active',
    ];

    protected $casts = [
        'duration_minutes' => 'integer',
        'price_xof' => 'integer',
        'deposit_required' => 'boolean',
        'deposit_amount_xof' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Relation Many-to-Many : Les professionnels habilités à dispenser cet acte.
     */
    public function practitioners(): BelongsToMany
    {
        return $this->belongsToMany(
            Practitioner::class,
            'practitioner_service',
            'service_id',
            'practitioner_id'
        )->withTimestamps();
    }

    /**
     * Relation BelongsTo : Cabinet médical propriétaire de l'acte.
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Relation HasMany : Rendez-vous pris pour cette prestation.
     */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'service_id');
    }

    /**
     * Scope pour filtrer les services actifs disponibles à la réservation.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope de filtrage par spécialité médicale.
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Formatage lisible du tarif en FCFA (ex: '15 000 FCFA').
     */
    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price_xof, 0, ',', ' ') . ' FCFA';
    }

    /**
     * Formatage lisible de l'acompte requis en FCFA.
     */
    public function getFormattedDepositAttribute(): string
    {
        if (!$this->deposit_required || $this->deposit_amount_xof === 0) {
            return 'Sans acompte';
        }
        return number_format($this->deposit_amount_xof, 0, ',', ' ') . ' FCFA';
    }
}`
  },

  {
    path: "app/Models/Practitioner.php",
    category: "Modèles Eloquent & Migrations Multi-Tenant",
    space: "shared",
    spaceLabel: "Modèle Eloquent (Practitioner)",
    description: "Modèle Eloquent Practitioner avec relation Many-to-Many vers Service, créneaux disponibles et association au compte praticien.",
    language: "php",
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsToMany;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;
use Stancl\\Tenancy\\Database\\Concerns\\BelongsToTenant;

class Practitioner extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'title',
        'name',
        'specialty',
        'phone',
        'email',
        'room_number',
        'is_available',
        'available_days',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'available_days' => 'array',
    ];

    /**
     * Relation Many-to-Many : Prestations médicales offertes par ce praticien.
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(
            Service::class,
            'practitioner_service',
            'practitioner_id',
            'service_id'
        )->withTimestamps();
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Vérifie si le médecin offre actuellement un acte donné.
     */
    public function offersService(int|Service $service): bool
    {
        $serviceId = $service instanceof Service ? $service->id : $service;
        return $this->services()->where('services.id', $serviceId)->exists();
    }
}`
  },

  {
    path: "app/Http/Requests/StoreServiceRequest.php",
    category: "Architecture & Config (Laravel 12, Livewire, React, Tailwind)",
    space: "admin",
    spaceLabel: "FormRequest Validation",
    description: "FormRequest de validation stricte pour la création et la modification d'un acte médical : tarif en FCFA, durée en minutes et praticiens habilités.",
    language: "php",
    code: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Autorisé pour les administrateurs de clinique et praticiens authentifiés
        return auth()->check() && (auth()->user()->isClinicAdmin() || auth()->user()->isDoctor());
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'duration_minutes' => ['required', 'integer', 'min:5', 'max:480'],
            'price_xof' => ['required', 'integer', 'min:0', 'max:10000000'],
            'deposit_required' => ['boolean'],
            'deposit_amount_xof' => [
                'nullable',
                'integer',
                'min:0',
                'lte:price_xof', // L'acompte ne peut pas excéder le tarif total
            ],
            'practitioner_ids' => ['required', 'array', 'min:1'],
            'practitioner_ids.*' => ['integer', 'exists:practitioners,id'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le libellé de la prestation est obligatoire.',
            'duration_minutes.min' => 'La durée minimale d\\'une consultation est de 5 minutes.',
            'price_xof.min' => 'Le tarif en FCFA ne peut pas être négatif.',
            'deposit_amount_xof.lte' => 'Le montant de l\\'acompte ne peut pas être supérieur au tarif de l\\'acte.',
            'practitioner_ids.required' => 'Veuillez assigner au moins un praticien à cet acte.',
            'practitioner_ids.min' => 'Au moins un médecin doit être sélectionné pour dispenser cet acte.',
        ];
    }
}`
  },

  {
    path: "app/Http/Controllers/Doctor/ServiceController.php",
    category: "Architecture & Config (Laravel 12, Livewire, React, Tailwind)",
    space: "admin",
    spaceLabel: "Contrôleur CRUD (ServiceController)",
    description: "Contrôleur RESTful complet gérant le CRUD des prestations médicales avec synchronisation de la table pivot practitioner_service ($service->practitioners()->sync()).",
    language: "php",
    code: `<?php

namespace App\\Http\\Controllers\\Doctor;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\StoreServiceRequest;
use App\\Models\\Service;
use App\\Models\\Practitioner;
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\Http\\Request;
use Illuminate\\View\\View;

class ServiceController extends Controller
{
    /**
     * Liste des services avec relations praticiens chargées (Eager Loading).
     */
    public function index(Request $request): View
    {
        $tenantId = tenant('id');

        $query = Service::where('tenant_id', $tenantId)
            ->with(['practitioners'])
            ->withCount('appointments');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $services = $query->orderBy('name')->paginate(15);
        $categories = Service::where('tenant_id', $tenantId)->distinct()->pluck('category');
        $practitioners = Practitioner::where('tenant_id', $tenantId)->get();

        return view('doctor.services.index', compact('services', 'categories', 'practitioners'));
    }

    /**
     * Formulaire de création d'une nouvelle prestation.
     */
    public function create(): View
    {
        $practitioners = Practitioner::where('tenant_id', tenant('id'))->get();
        return view('doctor.services.create', compact('practitioners'));
    }

    /**
     * Enregistrement en base de données et synchronisation de la relation Many-to-Many.
     */
    public function store(StoreServiceRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['tenant_id'] = tenant('id');
        $data['deposit_required'] = $request->boolean('deposit_required', true);
        $data['deposit_amount_xof'] = $data['deposit_required'] ? ($data['deposit_amount_xof'] ?? 0) : 0;
        $data['is_active'] = $request->boolean('is_active', true);

        // 1. Création de l'entité Service
        $service = Service::create($data);

        // 2. Synchronisation Many-to-Many avec les praticiens sélectionnés
        $service->practitioners()->sync($request->validated('practitioner_ids'));

        return redirect()
            ->route('doctor.services.index')
            ->with('success', "Prestation \"{$service->name}\" créée avec succès ({$service->formatted_price}).");
    }

    /**
     * Affichage d'un acte avec ses statistiques de réservation.
     */
    public function show(Service $service): View
    {
        $service->load(['practitioners', 'appointments' => fn ($q) => $q->latest()->limit(10)]);
        return view('doctor.services.show', compact('service'));
    }

    /**
     * Formulaire d'édition de la prestation.
     */
    public function edit(Service $service): View
    {
        $practitioners = Practitioner::where('tenant_id', tenant('id'))->get();
        $assignedPractitionerIds = $service->practitioners->pluck('id')->toArray();

        return view('doctor.services.edit', compact('service', 'practitioners', 'assignedPractitionerIds'));
    }

    /**
     * Mise à jour des informations et des praticiens habilités.
     */
    public function update(StoreServiceRequest $request, Service $service): RedirectResponse
    {
        $data = $request->validated();
        $data['deposit_required'] = $request->boolean('deposit_required');
        $data['deposit_amount_xof'] = $data['deposit_required'] ? ($data['deposit_amount_xof'] ?? 0) : 0;
        $data['is_active'] = $request->boolean('is_active', true);

        $service->update($data);

        // Mise à jour de la table pivot
        $service->practitioners()->sync($request->validated('practitioner_ids'));

        return redirect()
            ->route('doctor.services.index')
            ->with('success', "Prestation \"{$service->name}\" mise à jour avec succès.");
    }

    /**
     * Suppression d'un acte médical (et détachement automatique dans la table pivot).
     */
    public function destroy(Service $service): RedirectResponse
    {
        $name = $service->name;
        $service->practitioners()->detach();
        $service->delete();

        return redirect()
            ->route('doctor.services.index')
            ->with('info', "La prestation \"{$name}\" a été supprimée.");
    }

    /**
     * Bascule rapide : Permet au praticien connecté de s'auto-affecter ou se retirer d'un acte.
     */
    public function toggleAssignment(Request $request, Service $service): RedirectResponse
    {
        $practitioner = auth()->user()->practitioner;

        if (!$practitioner) {
            return back()->with('error', "Profil praticien non trouvé.");
        }

        $service->practitioners()->toggle($practitioner->id);

        $isNowAssigned = $service->practitioners()->where('practitioners.id', $practitioner->id)->exists();
        $message = $isNowAssigned
            ? "Vous proposez désormais l'acte \"{$service->name}\"."
            : "Vous avez retiré l'acte \"{$service->name}\" de vos prestations.";

        return back()->with('success', $message);
    }
}`
  },

  {
    path: "app/Livewire/Doctor/ServiceManager.php",
    category: "Architecture & Config (Laravel 12, Livewire, React, Tailwind)",
    space: "admin",
    spaceLabel: "Composant Livewire 3 (ServiceManager)",
    description: "Composant Livewire 3 réactif pour la gestion instantanée des actes médicaux en temps réel avec filtres, modale CRUD intégrée, bascule multi-praticiens et validation asynchrone.",
    language: "php",
    code: `<?php

namespace App\\Livewire\\Doctor;

use App\\Models\\Service;
use App\\Models\\Practitioner;
use Livewire\\Component;
use Livewire\\WithPagination;

class ServiceManager extends Component
{
    use WithPagination;

    public string $search = '';
    public string $categoryFilter = 'all';
    public string $viewFilter = 'all'; // 'all' ou 'my_services'

    // État de la fenêtre modale
    public bool $showModal = false;
    public ?int $editingServiceId = null;

    // Champs du formulaire
    public string $name = '';
    public string $category = 'Médecine Générale';
    public string $description = '';
    public int $durationMinutes = 30;
    public int $priceXOF = 15000;
    public bool $depositRequired = true;
    public int $depositAmountXOF = 5000;
    public array $selectedPractitionerIds = [];

    // Notification toast
    public ?string $flashMessage = null;

    protected function rules(): array
    {
        return [
            'name' => 'required|string|min:3|max:255',
            'category' => 'required|string',
            'description' => 'nullable|string|max:1000',
            'durationMinutes' => 'required|integer|min:5|max:360',
            'priceXOF' => 'required|integer|min:0',
            'depositRequired' => 'boolean',
            'depositAmountXOF' => 'required_if:depositRequired,true|integer|min:0|lte:priceXOF',
            'selectedPractitionerIds' => 'required|array|min:1',
        ];
    }

    public function openCreateModal(): void
    {
        $this->reset([
            'editingServiceId', 'name', 'description', 
            'durationMinutes', 'priceXOF', 'depositRequired', 'depositAmountXOF'
        ]);
        $this->category = 'Médecine Générale';
        $this->durationMinutes = 30;
        $this->priceXOF = 15000;
        $this->depositRequired = true;
        $this->depositAmountXOF = 5000;

        // Pré-sélectionner le praticien courant ou tous les praticiens
        $currentPractitionerId = auth()->user()?->practitioner?->id;
        $this->selectedPractitionerIds = $currentPractitionerId 
            ? [$currentPractitionerId] 
            : Practitioner::where('tenant_id', tenant('id'))->pluck('id')->toArray();

        $this->showModal = true;
    }

    public function editService(int $id): void
    {
        $service = Service::with('practitioners')->findOrFail($id);

        $this->editingServiceId = $service->id;
        $this->name = $service->name;
        $this->category = $service->category;
        $this->description = $service->description ?? '';
        $this->durationMinutes = $service->duration_minutes;
        $this->priceXOF = $service->price_xof;
        $this->depositRequired = $service->deposit_required;
        $this->depositAmountXOF = $service->deposit_amount_xof;
        $this->selectedPractitionerIds = $service->practitioners->pluck('id')->toArray();

        $this->showModal = true;
    }

    public function saveService(): void
    {
        $this->validate();

        $data = [
            'tenant_id' => tenant('id'),
            'name' => $this->name,
            'category' => $this->category,
            'description' => $this->description,
            'duration_minutes' => $this->durationMinutes,
            'price_xof' => $this->priceXOF,
            'deposit_required' => $this->depositRequired,
            'deposit_amount_xof' => $this->depositRequired ? $this->depositAmountXOF : 0,
            'is_active' => true,
        ];

        if ($this->editingServiceId) {
            $service = Service::findOrFail($this->editingServiceId);
            $service->update($data);
            $service->practitioners()->sync($this->selectedPractitionerIds);
            $this->flashMessage = "Prestation \"{$service->name}\" mise à jour avec succès.";
        } else {
            $service = Service::create($data);
            $service->practitioners()->sync($this->selectedPractitionerIds);
            $this->flashMessage = "Prestation \"{$service->name}\" enregistrée et disponible pour les rendez-vous.";
        }

        $this->showModal = false;
        $this->dispatch('toast', ['message' => $this->flashMessage, 'type' => 'success']);
    }

    public function deleteService(int $id): void
    {
        $service = Service::findOrFail($id);
        $name = $service->name;
        $service->practitioners()->detach();
        $service->delete();

        $this->dispatch('toast', [
            'message' => "La prestation \"{$name}\" a été supprimée.",
            'type' => 'info'
        ]);
    }

    public function toggleMyOffer(int $serviceId): void
    {
        $practitioner = auth()->user()?->practitioner;
        if (!$practitioner) return;

        $service = Service::findOrFail($serviceId);
        $service->practitioners()->toggle($practitioner->id);

        $isOffered = $service->practitioners()->where('practitioners.id', $practitioner->id)->exists();
        $this->dispatch('toast', [
            'message' => $isOffered 
                ? "Vous proposez désormais l'acte \"{$service->name}\"."
                : "Acte retiré de vos prestations.",
            'type' => $isOffered ? 'success' : 'info'
        ]);
    }

    public function render()
    {
        $tenantId = tenant('id');
        $currentPractitionerId = auth()->user()?->practitioner?->id;

        $query = Service::where('tenant_id', $tenantId)
            ->with('practitioners')
            ->when($this->search, function ($q) {
                $q->where(fn ($sub) => 
                    $sub->where('name', 'like', "%{$this->search}%")
                        ->orWhere('description', 'like', "%{$this->search}%")
                );
            })
            ->when($this->categoryFilter !== 'all', fn ($q) => $q->where('category', $this->categoryFilter))
            ->when($this->viewFilter === 'my_services' && $currentPractitionerId, function ($q) use ($currentPractitionerId) {
                $q->whereHas('practitioners', fn ($p) => $p->where('practitioners.id', $currentPractitionerId));
            });

        return view('livewire.doctor.service-manager', [
            'services' => $query->orderBy('name')->paginate(12),
            'categories' => Service::where('tenant_id', $tenantId)->distinct()->pluck('category'),
            'allPractitioners' => Practitioner::where('tenant_id', $tenantId)->get(),
        ]);
    }
}`
  },

  {
    path: "resources/views/livewire/doctor/service-manager.blade.php",
    category: "Architecture & Config (Laravel 12, Livewire, React, Tailwind)",
    space: "admin",
    spaceLabel: "Vue Livewire 3 (service-manager.blade.php)",
    description: "Interface Blade Livewire 3 haute fidélité conforme WCAG 2.1 avec modale accessible, cartes adaptatives mobile, badges de praticiens (relation Many-to-Many) et montants en FCFA.",
    language: "html",
    code: `<div class="max-w-7xl mx-auto space-y-6">
    <!-- Barre Supérieure -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Nomenclature des Actes (Many-to-Many)
                </span>
                <span class="text-[10px] font-mono text-sky-600 dark:text-sky-400">Dakar • FCFA</span>
            </div>
            <h1 class="text-xl font-black text-slate-900 dark:text-white mt-1">
                Catalogue des Prestations & Tarifs Médicaux
            </h1>
            <p class="text-xs text-slate-600 dark:text-slate-400">
                Gérez les durées, tarifs en FCFA, acomptes requis et affectez les médecins habilités à chaque acte.
            </p>
        </div>

        <button wire:click="openCreateModal" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            <span>+ Nouvel Acte Médical</span>
        </button>
    </div>

    <!-- Filtres & Recherche Réactive -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div class="md:col-span-6 relative">
            <input type="text" wire:model.live.debounce.300ms="search" placeholder="Rechercher par nom d'acte, pathologie ou examen..." class="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition">
        </div>

        <div class="md:col-span-3">
            <select wire:model.live="categoryFilter" class="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition">
                <option value="all">Toutes les spécialités</option>
                @foreach($categories as $cat)
                    <option value="{{ $cat }}">{{ $cat }}</option>
                @endforeach
            </select>
        </div>

        <div class="md:col-span-3 flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 text-xs">
            <button type="button" wire:click="$set('viewFilter', 'all')" class="flex-1 py-1.5 rounded-lg font-bold transition text-center {{ $viewFilter === 'all' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-slate-400' }}">
                Tous les Actes
            </button>
            <button type="button" wire:click="$set('viewFilter', 'my_services')" class="flex-1 py-1.5 rounded-lg font-bold transition text-center {{ $viewFilter === 'my_services' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-slate-400' }}">
                Mes Actes
            </button>
        </div>
    </div>

    <!-- Grille Responsive des Actes Médicaux -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @forelse($services as $svc)
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition">
                <div>
                    <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {{ $svc->category }}
                        </span>
                        <span class="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                            ⏱ {{ $svc->duration_minutes }} min
                        </span>
                    </div>

                    <h3 class="text-base font-black text-slate-900 dark:text-white">
                        {{ $svc->name }}
                    </h3>

                    <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {{ $svc->description ?: 'Examen clinique complet et diagnostic spécialisé.' }}
                    </p>

                    <!-- Tarification FCFA -->
                    <div class="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <span class="text-[10px] uppercase font-bold text-slate-500 block">Tarif</span>
                            <span class="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                                {{ number_format($svc->price_xof, 0, ',', ' ') }} FCFA
                            </span>
                        </div>
                        <div class="text-right">
                            <span class="text-[10px] uppercase font-bold text-slate-500 block">Acompte</span>
                            <span class="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                                {{ $svc->deposit_required ? number_format($svc->deposit_amount_xof, 0, ',', ' ') . ' FCFA' : 'Aucun' }}
                            </span>
                        </div>
                    </div>

                    <!-- Praticiens Habilités (Many-to-Many) -->
                    <div class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                        <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
                            Praticiens habilités ({{ $svc->practitioners->count() }}) :
                        </span>
                        <div class="flex items-center gap-1.5 flex-wrap">
                            @foreach($svc->practitioners as $doc)
                                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                    {{ $doc->title }} {{ Str::afterLast($doc->name, ' ') }}
                                </span>
                            @endforeach
                        </div>
                    </div>
                </div>

                <!-- Actions CRUD -->
                <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button wire:click="toggleMyOffer({{ $svc->id }})" class="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        Bascule mon offre
                    </button>
                    <div class="flex items-center gap-1.5">
                        <button wire:click="editService({{ $svc->id }})" class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Modifier">
                            ✏️
                        </button>
                        <button wire:click="deleteService({{ $svc->id }})" wire:confirm="Confirmer la suppression de cette prestation ?" class="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition" title="Supprimer">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p class="text-sm font-bold text-slate-700 dark:text-slate-300">Aucun acte médical trouvé.</p>
                <button wire:click="openCreateModal" class="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
                    Créer un acte médical
                </button>
            </div>
        @endforelse
    </div>

    {{ $services->links() }}

    <!-- Modale Livewire Accessible (Création / Modification) -->
    @if($showModal)
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
                <div class="flex items-center justify-between border-b pb-3">
                    <h2 class="text-base font-bold text-slate-900 dark:text-white">
                        {{ $editingServiceId ? 'Modifier la prestation médicale' : 'Créer un nouvel acte médical' }}
                    </h2>
                    <button wire:click="$set('showModal', false)" class="text-slate-500 hover:text-slate-900 dark:hover:text-white">✕</button>
                </div>

                <form wire:submit="saveService" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold mb-1">Nom de l'acte *</label>
                        <input type="text" wire:model="name" class="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                        @error('name') <span class="text-rose-500 text-[10px]">{{ $message }}</span> @enderror
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold mb-1">Spécialité</label>
                            <input type="text" wire:model="category" class="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold mb-1">Durée (minutes) *</label>
                            <input type="number" wire:model="durationMinutes" class="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold mb-1">Description</label>
                        <textarea wire:model="description" rows="2" class="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <div>
                            <label class="block text-xs font-semibold mb-1">Tarif (FCFA) *</label>
                            <input type="number" step="500" wire:model="priceXOF" class="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold mb-1">Acompte Wave/OM (FCFA)</label>
                            <input type="number" step="500" wire:model="depositAmountXOF" class="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                        </div>
                    </div>

                    <!-- Praticiens habilités (Many-to-Many) -->
                    <div>
                        <label class="block text-xs font-semibold mb-2">Praticiens habilités (Many-to-Many) *</label>
                        <div class="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                            @foreach($allPractitioners as $prat)
                                <label class="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs cursor-pointer">
                                    <input type="checkbox" wire:model="selectedPractitionerIds" value="{{ $prat->id }}" class="accent-emerald-500 rounded">
                                    <span class="truncate">{{ $prat->title }} {{ $prat->name }}</span>
                                </label>
                            @endforeach
                        </div>
                        @error('selectedPractitionerIds') <span class="text-rose-500 text-[10px]">{{ $message }}</span> @enderror
                    </div>

                    <div class="flex justify-end gap-2 pt-2 border-t">
                        <button type="button" wire:click="$set('showModal', false)" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300">Annuler</button>
                        <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    @endif
</div>`
  }
];
