import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Terminal, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  Play, 
  Send, 
  Eye, 
  Clock, 
  Trash2, 
  FileCode, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles,
  ArrowRight,
  Database,
  Building2,
  UserCheck,
  Zap,
  Info
} from 'lucide-react';
import { getThemeTokens } from '../../utils/themeTokens';
import { useToast } from '../ui/Toast';

export interface HttpLogEntry {
  id: string;
  requestId: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  url: string;
  ip: string;
  tenantId: string;
  tenantSlug?: string;
  userId: number | null;
  userRole: 'guest' | 'client' | 'receptionist' | 'doctor' | 'clinic_admin' | 'superadmin';
  statusCode: number;
  durationMs: number;
  memoryMb: number;
  inputs?: Record<string, any>;
  level: 'info' | 'warning' | 'error';
  matchedRoute: string;
}

const initialSampleLogs: HttpLogEntry[] = [
  {
    id: 'log-1',
    requestId: '9a8b1c2d-3e4f-40a1-89ab-123456789abc',
    timestamp: '2026-11-04 16:15:32',
    method: 'POST',
    path: '/e/clinique-de-la-madeleine/reserver/valider',
    url: 'https://sunurdv.sn/e/clinique-de-la-madeleine/reserver/valider',
    ip: '41.82.164.21',
    tenantId: 'tenant-1',
    tenantSlug: 'clinique-de-la-madeleine',
    userId: null,
    userRole: 'guest',
    statusCode: 200,
    durationMs: 24.6,
    memoryMb: 14.8,
    inputs: { service_id: 's-1', practitioner_id: 'p-1', date: '2026-11-05', slot: '10:00' },
    level: 'info',
    matchedRoute: 'public.booking.submit'
  },
  {
    id: 'log-2',
    requestId: 'b7c8d9e0-1f2a-43b2-90cd-234567890def',
    timestamp: '2026-11-04 16:15:45',
    method: 'GET',
    path: '/client/ticket/file-attente?id=492',
    url: 'https://sunurdv.sn/client/ticket/file-attente?id=492',
    ip: '154.124.78.10',
    tenantId: 'tenant-1',
    tenantSlug: 'clinique-de-la-madeleine',
    userId: 104,
    userRole: 'client',
    statusCode: 200,
    durationMs: 12.3,
    memoryMb: 11.2,
    inputs: { id: '492' },
    level: 'info',
    matchedRoute: 'client.queue.ticket'
  },
  {
    id: 'log-3',
    requestId: 'c3d4e5f6-7a8b-4c9d-01ef-345678901234',
    timestamp: '2026-11-04 16:16:01',
    method: 'POST',
    path: '/reception/patients/recherche-rapide',
    url: 'https://sunurdv.sn/reception/patients/recherche-rapide',
    ip: '196.207.240.5',
    tenantId: 'tenant-1',
    tenantSlug: 'clinique-de-la-madeleine',
    userId: 18,
    userRole: 'receptionist',
    statusCode: 200,
    durationMs: 18.9,
    memoryMb: 16.5,
    inputs: { query: 'Fall' },
    level: 'info',
    matchedRoute: 'reception.patients.search'
  },
  {
    id: 'log-4',
    requestId: 'd5e6f7a8-9b0c-4d1e-23fa-456789012345',
    timestamp: '2026-11-04 16:16:18',
    method: 'POST',
    path: '/medecin/consultations/42/ordonnance',
    url: 'https://sunurdv.sn/medecin/consultations/42/ordonnance',
    ip: '196.207.240.12',
    tenantId: 'tenant-1',
    tenantSlug: 'clinique-de-la-madeleine',
    userId: 7,
    userRole: 'doctor',
    statusCode: 200,
    durationMs: 38.4,
    memoryMb: 19.1,
    inputs: { prescription: 'Amoxicilline 500mg 3x/jour pendant 6 jours' },
    level: 'info',
    matchedRoute: 'doctor.consultation.save'
  },
  {
    id: 'log-5',
    requestId: 'e7f8a9b0-1c2d-4e3f-45ab-567890123456',
    timestamp: '2026-11-04 16:16:40',
    method: 'GET',
    path: '/admin/parametres/caisse',
    url: 'https://sunurdv.sn/admin/parametres/caisse',
    ip: '154.124.78.10',
    tenantId: 'tenant-1',
    tenantSlug: 'clinique-de-la-madeleine',
    userId: 104,
    userRole: 'client',
    statusCode: 403,
    durationMs: 8.7,
    memoryMb: 10.4,
    inputs: {},
    level: 'warning',
    matchedRoute: 'admin.cash.settings'
  },
  {
    id: 'log-6',
    requestId: 'f9a0b1c2-3d4e-4f5a-67bc-678901234567',
    timestamp: '2026-11-04 16:17:02',
    method: 'POST',
    path: '/api/webhooks/wave',
    url: 'https://sunurdv.sn/api/webhooks/wave',
    ip: '185.199.110.153',
    tenantId: 'global',
    tenantSlug: undefined,
    userId: null,
    userRole: 'guest',
    statusCode: 200,
    durationMs: 41.2,
    memoryMb: 21.3,
    inputs: { event: 'checkout.session.completed', client_reference: 'CMD-94821', amount: 5000 },
    level: 'info',
    matchedRoute: 'api.webhooks.wave'
  },
  {
    id: 'log-7',
    requestId: '0a1b2c3d-4e5f-4a6b-89cd-789012345678',
    timestamp: '2026-11-04 16:17:28',
    method: 'GET',
    path: '/e/clinique-inconnue-dakar/reserver',
    url: 'https://sunurdv.sn/e/clinique-inconnue-dakar/reserver',
    ip: '41.82.164.88',
    tenantId: 'non-trouve',
    tenantSlug: 'clinique-inconnue-dakar',
    userId: null,
    userRole: 'guest',
    statusCode: 404,
    durationMs: 9.1,
    memoryMb: 9.8,
    inputs: {},
    level: 'warning',
    matchedRoute: 'public.clinic'
  }
];

export const HttpLoggingInspector: React.FC<{ isDark?: boolean }> = ({ isDark = true }) => {
  const { showToast } = useToast();
  const theme = getThemeTokens(isDark);

  const [logs, setLogs] = useState<HttpLogEntry[]>(initialSampleLogs);
  const [selectedLog, setSelectedLog] = useState<HttpLogEntry | null>(initialSampleLogs[0]);
  const [filterTenant, setFilterTenant] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'console' | 'code' | 'repair'>('console');
  const [copiedLogJson, setCopiedLogJson] = useState<boolean>(false);
  const [copiedMiddlewareCode, setCopiedMiddlewareCode] = useState<boolean>(false);

  // Form State for Request Simulator
  const [simMethod, setSimMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('POST');
  const [simTenant, setSimTenant] = useState<string>('tenant-1');
  const [simRole, setSimRole] = useState<HttpLogEntry['userRole']>('client');
  const [simPath, setSimPath] = useState<string>('/client/ticket/file-attente');
  const [simStatus, setSimStatus] = useState<number>(200);

  const cardBg = theme.cardBg;
  const subBg = theme.subBg;
  const textPrimary = theme.textPrimary;
  const textSecondary = theme.textSecondary;

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchTenant = filterTenant === 'all' || l.tenantId === filterTenant;
      const matchRole = filterRole === 'all' || l.userRole === filterRole;
      const matchStatus = 
        filterStatus === 'all' ||
        (filterStatus === '2xx' && l.statusCode >= 200 && l.statusCode < 300) ||
        (filterStatus === '4xx' && l.statusCode >= 400 && l.statusCode < 500) ||
        (filterStatus === '5xx' && l.statusCode >= 500);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        l.path.toLowerCase().includes(q) || 
        l.requestId.toLowerCase().includes(q) ||
        l.ip.includes(q) ||
        l.userRole.toLowerCase().includes(q);
      return matchTenant && matchRole && matchStatus && matchSearch;
    });
  }, [logs, filterTenant, filterRole, filterStatus, searchQuery]);

  const handleSimulateRequest = () => {
    const randomDuration = Number((Math.random() * 35 + 8).toFixed(1));
    const randomMemory = Number((Math.random() * 8 + 12).toFixed(1));
    const randomUuid = 'req-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const level: HttpLogEntry['level'] = simStatus >= 500 ? 'error' : simStatus >= 400 ? 'warning' : 'info';

    const newEntry: HttpLogEntry = {
      id: `log-${Date.now()}`,
      requestId: randomUuid,
      timestamp: nowStr,
      method: simMethod,
      path: simPath,
      url: `https://sunurdv.sn${simPath}`,
      ip: '41.82.164.' + Math.floor(Math.random() * 200 + 10),
      tenantId: simTenant,
      tenantSlug: simTenant === 'tenant-1' ? 'clinique-de-la-madeleine' : simTenant === 'tenant-2' ? 'cabinet-dentaire-almadies' : 'global',
      userId: simRole === 'guest' ? null : Math.floor(Math.random() * 90 + 10),
      userRole: simRole,
      statusCode: simStatus,
      durationMs: randomDuration,
      memoryMb: randomMemory,
      inputs: simMethod === 'POST' ? { action: 'simulation', timestamp: Date.now() } : {},
      level,
      matchedRoute: simPath.split('/')[1] + '.' + (simPath.split('/')[2] || 'index')
    };

    setLogs((prev) => [newEntry, ...prev]);
    setSelectedLog(newEntry);

    showToast({
      type: simStatus >= 400 ? 'warning' : 'success',
      title: `Requête ${simMethod} tracée par LoggingMiddleware !`,
      message: `Tenant: ${simTenant} • Rôle: ${simRole} • Status: ${simStatus} (${randomDuration} ms)`
    });
  };

  const handleClearLogs = () => {
    setLogs([]);
    setSelectedLog(null);
    showToast({
      type: 'info',
      title: 'Console réinitialisée',
      message: 'L\'historique des requêtes a été vidé.'
    });
  };

  const handleCopyLogJson = (entry: HttpLogEntry) => {
    const payload = {
      request_id: entry.requestId,
      timestamp: entry.timestamp + ' GMT+0 (Africa/Dakar)',
      method: entry.method,
      url: entry.url,
      path: entry.path,
      ip: entry.ip,
      tenant_id: entry.tenantId,
      tenant_slug: entry.tenantSlug,
      user_id: entry.userId,
      user_role: entry.userRole,
      status_code: entry.statusCode,
      duration_ms: entry.durationMs,
      memory_mb: entry.memoryMb,
      inputs: entry.inputs,
      level: entry.level
    };

    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedLogJson(true);
    showToast({
      type: 'success',
      title: 'JSON copié ! 📋',
      message: 'Format structuré compatible Monolog & CloudWatch/Datadog.'
    });
    setTimeout(() => setCopiedLogJson(false), 2000);
  };

  const middlewareSourceCode = `<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Symfony\\Component\\HttpFoundation\\Response;
use Illuminate\\Support\\Facades\\Log;
use Illuminate\\Support\\Str;

class LoggingMiddleware
{
    /**
     * Intercepte chaque requête entrante, calcule la latence,
     * et journalise avec l'ID du Tenant et le Rôle Utilisateur.
     * Compatible Laravel 12 & Multi-Tenancy SunuRDV Sénégal.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        $requestId = (string) Str::uuid();

        // Injecter le X-Request-Id pour traçabilité de bout en bout
        $request->headers->set('X-Request-Id', $requestId);

        // Passer au middleware / contrôleur suivant
        $response = $next($request);

        // Durée exacte d'exécution en millisecondes
        $durationMs = round((microtime(true) - $startTime) * 1000, 2);

        // 1. RÉSOLDRE L'ID DU TENANT (Multi-sources prioritaires)
        $tenantId = null;
        $tenantSlug = null;
        if (app()->bound('currentTenant')) {
            $tenant = app('currentTenant');
            $tenantId = $tenant->id ?? null;
            $tenantSlug = $tenant->slug ?? null;
        } elseif ($request->attributes->has('tenant')) {
            $tenant = $request->attributes->get('tenant');
            $tenantId = is_object($tenant) ? ($tenant->id ?? null) : $tenant;
        } elseif ($request->route('slug')) {
            $tenantSlug = $request->route('slug');
            $tenantId = $tenantSlug;
        } elseif ($request->user() && $request->user()->tenant_id) {
            $tenantId = $request->user()->tenant_id;
        }

        // 2. RÉSOLDRE LE RÔLE UTILISATEUR
        $user = $request->user();
        $userId = $user ? $user->id : null;
        $userRole = 'guest';

        if ($user) {
            if (!empty($user->is_super_admin)) {
                $userRole = 'superadmin';
            } elseif (method_exists($user, 'getRoleNames') && $user->getRoleNames()->isNotEmpty()) {
                $userRole = $user->getRoleNames()->first();
            } elseif (!empty($user->role)) {
                $userRole = $user->role;
            } elseif (!empty($user->is_patient)) {
                $userRole = 'client';
            } else {
                $userRole = 'authenticated';
            }
        }

        // 3. SÉCURITÉ : Masquer les données sensibles
        $cleanInputs = collect($request->except(['password', 'password_confirmation', 'otp', 'token', 'secret', 'card_number']))
            ->map(fn($v) => is_string($v) && strlen($v) > 120 ? substr($v, 0, 120) . '...' : $v)
            ->toArray();

        // 4. PAYLOAD STRUCTURÉ JSON POUR STORAGE/LOGS/LARAVEL.LOG
        $statusCode = $response->getStatusCode();
        $logPayload = [
            'request_id'   => $requestId,
            'timestamp'    => now('Africa/Dakar')->toIso8601String(),
            'method'       => $request->method(),
            'url'          => $request->fullUrl(),
            'path'         => $request->path(),
            'ip'           => $request->ip(),
            'tenant_id'    => $tenantId ?? 'global',
            'tenant_slug'  => $tenantSlug,
            'user_id'      => $userId,
            'user_role'    => $userRole,
            'status_code'  => $statusCode,
            'duration_ms'  => $durationMs,
            'memory_mb'    => round(memory_get_peak_usage(true) / 1024 / 1024, 2),
            'inputs'       => $cleanInputs,
        ];

        $logMessage = sprintf(
            '[%s] %s /%s - Status: %d (%s ms) | Tenant: %s | Role: %s',
            $requestId,
            $request->method(),
            ltrim($request->path(), '/'),
            $statusCode,
            $durationMs,
            $tenantId ?? 'none',
            $userRole
        );

        // 5. ÉCHELONNAGE DES NIVEAUX DE LOG
        if ($statusCode >= 500) {
            Log::channel('daily')->error($logMessage, $logPayload);
        } elseif ($statusCode >= 400) {
            Log::channel('daily')->warning($logMessage, $logPayload);
        } else {
            Log::channel('daily')->info($logMessage, $logPayload);
        }

        // 6. ATTACHER LES HEADERS DIAGNOSTIQUES DANS LA RÉPONSE HTTP
        $response->headers->set('X-Request-Id', $requestId);
        $response->headers->set('X-Response-Time-Ms', (string) $durationMs);
        $response->headers->set('X-SunuRDV-Tenant', (string) ($tenantId ?? 'none'));

        return $response;
    }
}`;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Context */}
      <div className={`p-6 sm:p-7 rounded-2xl border shadow-xl relative overflow-hidden transition-all ${
        isDark 
          ? 'bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/40 border-purple-900/40' 
          : 'bg-gradient-to-r from-purple-50 via-indigo-50/40 to-slate-50 border-purple-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">
              <Activity className="w-3.5 h-3.5" />
              <span>LoggingMiddleware • Traçabilité & Observabilité HTTP</span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-black ${textPrimary}`}>
              Console de Journalisation & Tracing en Direct
            </h2>
            <p className={`text-xs sm:text-sm max-w-3xl leading-relaxed ${textSecondary}`}>
              Toutes les requêtes entrantes de la plateforme SunuRDV sont interceptées par le <code>LoggingMiddleware</code>. 
              Chaque log embarque automatiquement l'<strong>ID du Tenant actif</strong>, le <strong>rôle utilisateur</strong>, 
              le temps de réponse en millisecondes et un UUID <code>X-Request-Id</code> unique pour isoler et réparer les anomalies.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => setActiveSubTab('console')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeSubTab === 'console'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                  : `${subBg} ${textSecondary} hover:${textPrimary}`
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Console & Simulateur</span>
            </button>

            <button
              onClick={() => setActiveSubTab('code')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeSubTab === 'code'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                  : `${subBg} ${textSecondary} hover:${textPrimary}`
              }`}
            >
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>Code PHP du Middleware</span>
            </button>

            <button
              onClick={() => setActiveSubTab('repair')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeSubTab === 'repair'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                  : `${subBg} ${textSecondary} hover:${textPrimary}`
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Guide Débogage</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: CONSOLE & SIMULATOR */}
      {activeSubTab === 'console' && (
        <div className="space-y-6">
          {/* Request Simulator Card */}
          <div className={`p-5 rounded-2xl border shadow-md space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-700/20">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Play className="w-4 h-4" />
                </span>
                <div>
                  <h3 className={`text-sm font-bold ${textPrimary}`}>Simulateur de Requête Entrante</h3>
                  <p className={`text-[11px] ${textSecondary}`}>Testez l'interception et le formatage JSON du LoggingMiddleware</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                bootstrap/app.php ➔ LoggingMiddleware::class
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Method */}
              <div className="space-y-1">
                <label className={`text-[11px] font-bold uppercase tracking-wider block ${textSecondary}`}>
                  Méthode HTTP
                </label>
                <select
                  value={simMethod}
                  onChange={(e) => setSimMethod(e.target.value as any)}
                  className={`w-full rounded-xl px-3 py-2 text-xs border font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme.inputBg}`}
                >
                  <option value="GET">GET (Lecture)</option>
                  <option value="POST">POST (Action / Création)</option>
                  <option value="PUT">PUT (Mise à jour)</option>
                  <option value="DELETE">DELETE (Suppression)</option>
                </select>
              </div>

              {/* Tenant ID */}
              <div className="space-y-1">
                <label className={`text-[11px] font-bold uppercase tracking-wider block ${textSecondary}`}>
                  Tenant ID (Clinique)
                </label>
                <select
                  value={simTenant}
                  onChange={(e) => setSimTenant(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs border font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme.inputBg}`}
                >
                  <option value="tenant-1">tenant-1 (Madeleine)</option>
                  <option value="tenant-2">tenant-2 (Almadies)</option>
                  <option value="tenant-3">tenant-3 (Fann)</option>
                  <option value="global">global (SaaS / Webhook)</option>
                </select>
              </div>

              {/* User Role */}
              <div className="space-y-1">
                <label className={`text-[11px] font-bold uppercase tracking-wider block ${textSecondary}`}>
                  Rôle Utilisateur
                </label>
                <select
                  value={simRole}
                  onChange={(e) => setSimRole(e.target.value as any)}
                  className={`w-full rounded-xl px-3 py-2 text-xs border font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme.inputBg}`}
                >
                  <option value="guest">guest (Visiteur)</option>
                  <option value="client">client (Patient)</option>
                  <option value="receptionist">receptionist (Guichet)</option>
                  <option value="doctor">doctor (Médecin)</option>
                  <option value="clinic_admin">clinic_admin (Admin)</option>
                  <option value="superadmin">superadmin (Plateforme)</option>
                </select>
              </div>

              {/* Endpoint Path */}
              <div className="space-y-1">
                <label className={`text-[11px] font-bold uppercase tracking-wider block ${textSecondary}`}>
                  URL de Destination
                </label>
                <select
                  value={simPath}
                  onChange={(e) => setSimPath(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs border font-mono truncate focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme.inputBg}`}
                >
                  <option value="/e/clinique-de-la-madeleine/reserver">/e/madeleine/reserver</option>
                  <option value="/client/ticket/file-attente">/client/ticket/file-attente</option>
                  <option value="/reception/patients/recherche">/reception/patients/recherche</option>
                  <option value="/medecin/consultations/ordonnance">/medecin/consultations/ordonnance</option>
                  <option value="/admin/caisse/encaissement">/admin/caisse/encaissement</option>
                  <option value="/superadmin/cliniques/provisionner">/superadmin/cliniques/provisionner</option>
                  <option value="/api/webhooks/wave">/api/webhooks/wave</option>
                </select>
              </div>

              {/* Status Code */}
              <div className="space-y-1">
                <label className={`text-[11px] font-bold uppercase tracking-wider block ${textSecondary}`}>
                  Code Réponse HTTP
                </label>
                <select
                  value={simStatus}
                  onChange={(e) => setSimStatus(Number(e.target.value))}
                  className={`w-full rounded-xl px-3 py-2 text-xs border font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme.inputBg}`}
                >
                  <option value={200}>200 OK (Succès)</option>
                  <option value={201}>201 Created (Ressource créée)</option>
                  <option value={401}>401 Unauthorized (Non connecté)</option>
                  <option value={403}>403 Forbidden (Rôle invalide)</option>
                  <option value={404}>404 Not Found (Cabinet inexistant)</option>
                  <option value={500}>500 Error (Erreur serveur)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className={`text-xs ${textSecondary}`}>
                Le middleware calculera automatiquement la latence en millisecondes et enregistrera le JSON structuré.
              </span>

              <button
                onClick={handleSimulateRequest}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/30 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Exécuter la Requête & Journaliser</span>
              </button>
            </div>
          </div>

          {/* Filters & Actions Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {/* Filter by Tenant */}
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] font-bold ${textSecondary}`}>Tenant :</span>
                <select
                  value={filterTenant}
                  onChange={(e) => setFilterTenant(e.target.value)}
                  className={`rounded-lg px-2.5 py-1 text-xs border focus:outline-none ${theme.inputBg}`}
                >
                  <option value="all">Tous les tenants</option>
                  <option value="tenant-1">tenant-1</option>
                  <option value="tenant-2">tenant-2</option>
                  <option value="global">global</option>
                </select>
              </div>

              {/* Filter by Role */}
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] font-bold ${textSecondary}`}>Rôle :</span>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className={`rounded-lg px-2.5 py-1 text-xs border focus:outline-none ${theme.inputBg}`}
                >
                  <option value="all">Tous les rôles</option>
                  <option value="guest">guest</option>
                  <option value="client">client</option>
                  <option value="receptionist">receptionist</option>
                  <option value="doctor">doctor</option>
                  <option value="clinic_admin">clinic_admin</option>
                  <option value="superadmin">superadmin</option>
                </select>
              </div>

              {/* Filter by Status */}
              <div className="flex items-center gap-1.5">
                <span className={`text-[11px] font-bold ${textSecondary}`}>Status :</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`rounded-lg px-2.5 py-1 text-xs border focus:outline-none ${theme.inputBg}`}
                >
                  <option value="all">Tous statuts</option>
                  <option value="2xx">2xx (Succès)</option>
                  <option value="4xx">4xx (Client/Auth)</option>
                  <option value="5xx">5xx (Serveur)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${textSecondary}`} />
                <input
                  type="text"
                  placeholder="Filtrer par URL, IP, UUID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full rounded-xl pl-8 pr-3 py-1.5 text-xs border focus:outline-none focus:ring-1 focus:ring-purple-500 ${theme.inputBg}`}
                />
              </div>

              <button
                onClick={handleClearLogs}
                title="Vider l'historique de log"
                className={`p-2 rounded-xl border text-xs text-rose-400 hover:bg-rose-500/10 transition cursor-pointer ${subBg}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Logs Split: Left Table List, Right JSON Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Logs Table (7 cols) */}
            <div className={`lg:col-span-7 rounded-2xl border overflow-hidden shadow-lg ${cardBg}`}>
              <div className={`p-3.5 border-b flex items-center justify-between text-xs font-bold ${subBg}`}>
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span className={textPrimary}>Flux des Requêtes Journalisées ({filteredLogs.length})</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">storage/logs/laravel.log</span>
              </div>

              <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className={`text-[10px] uppercase font-bold tracking-wider border-b ${subBg} ${textSecondary}`}>
                    <tr>
                      <th className="p-3">Status</th>
                      <th className="p-3">Méthode & Chemin</th>
                      <th className="p-3">Tenant ID</th>
                      <th className="p-3">Rôle</th>
                      <th className="p-3 text-right">Latence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/10">
                    {filteredLogs.map((log) => {
                      const isSelected = selectedLog?.id === log.id;
                      return (
                        <tr
                          key={log.id}
                          onClick={() => setSelectedLog(log)}
                          className={`cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-purple-500/15 ring-1 ring-inset ring-purple-500/30' 
                              : 'hover:bg-slate-500/5'
                          }`}
                        >
                          <td className="p-3 font-mono font-bold whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                              log.statusCode >= 500 ? 'bg-rose-500/20 text-rose-400' :
                              log.statusCode >= 400 ? 'bg-amber-500/20 text-amber-400' :
                              'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {log.statusCode}
                            </span>
                          </td>
                          <td className="p-3 min-w-[200px]">
                            <div className="flex items-center gap-1.5 font-mono">
                              <span className={`font-bold text-[10px] ${
                                log.method === 'POST' ? 'text-indigo-400' :
                                log.method === 'DELETE' ? 'text-rose-400' :
                                log.method === 'PUT' ? 'text-amber-400' : 'text-sky-400'
                              }`}>
                                {log.method}
                              </span>
                              <span className={`truncate text-xs ${isSelected ? 'text-purple-300 font-bold' : textPrimary}`}>
                                {log.path}
                              </span>
                            </div>
                            <span className={`text-[10px] block font-mono ${textSecondary}`}>
                              {log.ip} • {log.timestamp.split(' ')[1]}
                            </span>
                          </td>
                          <td className="p-3 whitespace-nowrap font-mono text-xs">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.tenantId === 'global' ? 'bg-slate-500/20 text-slate-300' :
                              log.tenantId.includes('tenant-1') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            }`}>
                              {log.tenantId}
                            </span>
                          </td>
                          <td className="p-3 whitespace-nowrap font-mono text-[11px]">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                              log.userRole === 'doctor' ? 'bg-sky-500/20 text-sky-400' :
                              log.userRole === 'receptionist' ? 'bg-amber-500/20 text-amber-400' :
                              log.userRole === 'clinic_admin' ? 'bg-indigo-500/20 text-indigo-400' :
                              log.userRole === 'client' ? 'bg-emerald-500/20 text-emerald-400' :
                              log.userRole === 'superadmin' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-slate-500/20 text-slate-400'
                            }`}>
                              {log.userRole}
                            </span>
                          </td>
                          <td className="p-3 text-right whitespace-nowrap font-mono text-xs font-semibold text-slate-300">
                            {log.durationMs} ms
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Selected Log JSON Inspector (5 cols) */}
            <div className={`lg:col-span-5 rounded-2xl border overflow-hidden shadow-xl ${cardBg}`}>
              {selectedLog ? (
                <div className="space-y-0">
                  <div className={`p-3.5 border-b flex items-center justify-between text-xs ${subBg}`}>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-400" />
                      <span className={`font-bold ${textPrimary}`}>Détail Structuré du Log</span>
                    </div>

                    <button
                      onClick={() => handleCopyLogJson(selectedLog)}
                      className={`px-3 py-1 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        copiedLogJson ? 'bg-emerald-600 text-white' : `${subBg} ${textPrimary} hover:border-purple-500`
                      }`}
                    >
                      {copiedLogJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLogJson ? 'Copié' : 'Copier JSON'}</span>
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`p-2.5 rounded-xl border ${subBg}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block ${textSecondary}`}>
                          Tenant Identifié
                        </span>
                        <strong className="text-emerald-400 font-mono text-xs block mt-0.5">
                          {selectedLog.tenantId}
                        </strong>
                        <span className={`text-[10px] ${textSecondary}`}>
                          {selectedLog.tenantSlug || 'Contexte Global'}
                        </span>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${subBg}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block ${textSecondary}`}>
                          Rôle Utilisateur
                        </span>
                        <strong className="text-purple-400 font-mono text-xs block mt-0.5">
                          {selectedLog.userRole}
                        </strong>
                        <span className={`text-[10px] ${textSecondary}`}>
                          User ID : {selectedLog.userId ?? 'Anonyme'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className={`p-2 rounded-xl border text-center ${subBg}`}>
                        <span className={`text-[9px] font-bold block ${textSecondary}`}>Latence</span>
                        <span className="font-mono text-xs font-bold text-slate-200">{selectedLog.durationMs} ms</span>
                      </div>
                      <div className={`p-2 rounded-xl border text-center ${subBg}`}>
                        <span className={`text-[9px] font-bold block ${textSecondary}`}>Mémoire</span>
                        <span className="font-mono text-xs font-bold text-slate-200">{selectedLog.memoryMb} MB</span>
                      </div>
                      <div className={`p-2 rounded-xl border text-center ${subBg}`}>
                        <span className={`text-[9px] font-bold block ${textSecondary}`}>HTTP Status</span>
                        <span className={`font-mono text-xs font-bold ${
                          selectedLog.statusCode >= 400 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {selectedLog.statusCode}
                        </span>
                      </div>
                    </div>

                    {/* Formatted JSON Box */}
                    <div className="space-y-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>
                        Payload JSON (Monolog / Graylog / Datadog)
                      </span>
                      <pre className="p-3 rounded-xl bg-slate-950 text-purple-300 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed max-h-[320px] overflow-y-auto">
                        {JSON.stringify({
                          request_id: selectedLog.requestId,
                          timestamp: selectedLog.timestamp,
                          method: selectedLog.method,
                          path: selectedLog.path,
                          ip: selectedLog.ip,
                          tenant_id: selectedLog.tenantId,
                          tenant_slug: selectedLog.tenantSlug,
                          user_id: selectedLog.userId,
                          user_role: selectedLog.userRole,
                          status_code: selectedLog.statusCode,
                          duration_ms: selectedLog.durationMs,
                          memory_mb: selectedLog.memoryMb,
                          inputs: selectedLog.inputs,
                          matched_route: selectedLog.matchedRoute
                        }, null, 2)}
                      </pre>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>En-tête de réponse HTTP :</span>
                      </div>
                      <p className="font-mono text-[11px] text-slate-300">
                        <code>X-Request-Id: {selectedLog.requestId}</code><br />
                        <code>X-Response-Time-Ms: {selectedLog.durationMs}</code><br />
                        <code>X-SunuRDV-Tenant: {selectedLog.tenantId}</code>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs space-y-2 text-slate-400">
                  <Terminal className="w-8 h-8 mx-auto opacity-30" />
                  <p>Sélectionnez une requête dans la liste pour inspecter son payload JSON.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PHP CODE OF LOGGINGMIDDLEWARE */}
      {activeSubTab === 'code' && (
        <div className={`p-6 rounded-2xl border shadow-xl space-y-6 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-700/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  app/Http/Middleware/LoggingMiddleware.php
                </span>
                <span className={`text-xs ${textSecondary}`}>Laravel 12 Native</span>
              </div>
              <h3 className={`text-lg font-bold ${textPrimary} mt-1`}>
                Code Source Complet du Middleware de Journalisation
              </h3>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(middlewareSourceCode);
                setCopiedMiddlewareCode(true);
                showToast({
                  type: 'success',
                  title: 'Code PHP copié ! 🇸🇳',
                  message: 'Prêt à coller dans app/Http/Middleware/LoggingMiddleware.php'
                });
                setTimeout(() => setCopiedMiddlewareCode(false), 2000);
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/30 transition cursor-pointer"
            >
              {copiedMiddlewareCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedMiddlewareCode ? 'Copié !' : 'Copier le Code PHP'}</span>
            </button>
          </div>

          <pre className="p-5 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-[580px] overflow-y-auto">
            {middlewareSourceCode}
          </pre>

          {/* Registration in bootstrap/app.php */}
          <div className={`p-4 rounded-xl border space-y-3 ${subBg} border-purple-500/30`}>
            <div className="flex items-center gap-2 font-bold text-purple-400 text-xs">
              <Zap className="w-4 h-4" />
              <span>Comment l'enregistrer dans Laravel 12 (bootstrap/app.php) :</span>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 text-purple-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`->withMiddleware(function (Middleware $middleware) {
    // Enregistrement global automatique pour 100% des requêtes web & api :
    $middleware->append(\\App\\Http\\Middleware\\LoggingMiddleware::class);
})`}
            </pre>
          </div>
        </div>
      )}

      {/* VIEW 3: REPAIR & TROUBLESHOOTING GUIDE */}
      {activeSubTab === 'repair' && (
        <div className={`p-6 rounded-2xl border shadow-xl space-y-6 ${cardBg}`}>
          <div className="border-b pb-4 border-slate-700/20">
            <h3 className={`text-lg font-bold ${textPrimary}`}>
              Guide de Dépannage & Bonnes Pratiques du LoggingMiddleware
            </h3>
            <p className={`text-xs ${textSecondary} mt-1`}>
              Résolvez les cas complexes : requêtes asynchrones, données masquées et performances sous fort trafic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Issue 1 */}
            <div className={`p-4 rounded-xl border space-y-3 ${subBg}`}>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`text-xs font-bold ${textPrimary}`}>
                    L'ID du tenant apparaît vide (null) dans les logs
                  </h4>
                  <span className="text-[10px] text-purple-400 font-mono">Cause : Ordre d'exécution des middlewares</span>
                </div>
              </div>
              <p className={`text-[11px] leading-relaxed ${textSecondary}`}>
                Si le <code>LoggingMiddleware</code> tente de lire le tenant avant que <code>IdentifyTenant</code> ne soit exécuté, l'instance sera introuvable.
              </p>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider block">Solution :</span>
                <p className="font-mono text-[11px]">
                  Placez le code de journalisation après <code>$response = $next($request);</code>. À ce moment, le tenant a été injecté par les middlewares précédents.
                </p>
              </div>
            </div>

            {/* Issue 2 */}
            <div className={`p-4 rounded-xl border space-y-3 ${subBg}`}>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`text-xs font-bold ${textPrimary}`}>
                    Fuite de données médicales ou de codes OTP SMS dans les logs
                  </h4>
                  <span className="text-[10px] text-purple-400 font-mono">Cause : $request-&gt;all() sans filtrage</span>
                </div>
              </div>
              <p className={`text-[11px] leading-relaxed ${textSecondary}`}>
                Enregistrez toujours les paramètres via <code>$request-&gt;except(['password', 'otp', 'token'])</code> pour respecter la confidentialité médicale et la conformité CDP Sénégal.
              </p>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider block">Solution :</span>
                <p className="font-mono text-[11px]">
                  Utiliser la méthode <code>collect($request-&gt;except([...]))</code> intégrée dans notre LoggingMiddleware.
                </p>
              </div>
            </div>

            {/* Issue 3 */}
            <div className={`p-4 rounded-xl border space-y-3 ${subBg}`}>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`text-xs font-bold ${textPrimary}`}>
                    Traçabilité de bout en bout (Frontend &lt;=&gt; Backend)
                  </h4>
                  <span className="text-[10px] text-purple-400 font-mono">Pratique : Header X-Request-Id</span>
                </div>
              </div>
              <p className={`text-[11px] leading-relaxed ${textSecondary}`}>
                Chaque requête génère un UUID unique renvoyé dans l'en-tête <code>X-Request-Id</code>. En cas d'erreur côté client (Toast ou alerte), affichez cet identifiant au patient ou au médecin pour retrouver la ligne de log en 2 secondes.
              </p>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider block">Recherche rapide CLI :</span>
                <p className="font-mono text-[11px]">
                  grep '9a8b1c2d-...' storage/logs/laravel-*.log
                </p>
              </div>
            </div>

            {/* Issue 4 */}
            <div className={`p-4 rounded-xl border space-y-3 ${subBg}`}>
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`text-xs font-bold ${textPrimary}`}>
                    Rotation automatique des logs pour éviter la saturation du disque VPS
                  </h4>
                  <span className="text-[10px] text-purple-400 font-mono">Configuration : config/logging.php</span>
                </div>
              </div>
              <p className={`text-[11px] leading-relaxed ${textSecondary}`}>
                Utilisez le driver <code>daily</code> avec une rétention de 14 ou 30 jours pour que Laravel supprime automatiquement les anciens fichiers.
              </p>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider block">Configuration :</span>
                <p className="font-mono text-[11px]">
                  'channels' =&gt; ['daily' =&gt; ['driver' =&gt; 'daily', 'days' =&gt; 14]]
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
