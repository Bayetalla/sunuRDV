/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Step1GuideView } from './components/dev-guide/Step1GuideView';
import { RoadmapView } from './components/dev-guide/RoadmapView';
import { LaravelFilesView } from './components/dev-guide/LaravelFilesView';
import { BookingPortal } from './components/demo/BookingPortal';
import { ClinicDashboard } from './components/demo/ClinicDashboard';
import { ClinicAdminSpace } from './components/spaces/ClinicAdminSpace';
import { DoctorSpace } from './components/spaces/DoctorSpace';
import { SuperAdminSpace } from './components/spaces/SuperAdminSpace';
import { ToastProvider } from './components/ui/Toast';
import { 
  tenants, 
  practitioners as initialPractitioners, 
  services as initialServices, 
  initialAppointments, 
  senegalHolidays 
} from './data/mockData';
import { Tenant, Appointment, AppointmentStatus, SpaceType, ThemeMode } from './types';
import { Sparkles, Code2, HeartHandshake, Shield, User, PhoneCall, Stethoscope, ShieldCheck, Layers } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'demo' | 'dev-guide' | 'roadmap' | 'laravel-files'>('demo');
  const [activeTenant, setActiveTenant] = useState<Tenant>(tenants[0]);
  const [currentSpace, setCurrentSpace] = useState<SpaceType>('patient');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const isDark = themeMode === 'dark';

  // Apply dark mode class to document body / html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
      document.body.classList.add('bg-slate-950', 'text-slate-100');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-slate-950', 'text-slate-100');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
    }
  }, [isDark]);

  // Filter practitioners and services for the active tenant
  const tenantPractitioners = initialPractitioners.filter((p) => p.tenantId === activeTenant.id);
  const tenantServices = initialServices.filter((s) => s.tenantId === activeTenant.id);
  const tenantAppointments = appointments.filter((a) => a.tenantId === activeTenant.id);

  const handleUpdateStatus = (aptId: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: newStatus } : a))
    );
  };

  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  return (
    <ToastProvider>
      <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        {/* Top Application Header with DarkMode toggle, global search & space switcher */}
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          activeTenant={activeTenant}
          onSelectTenant={setActiveTenant}
          allTenants={tenants}
          currentSpace={currentSpace}
          setCurrentSpace={setCurrentSpace}
          themeMode={themeMode}
          setThemeMode={setThemeMode}
        />

        {/* Main Content Area */}
        <main className={`flex-1 ${currentTab === 'demo' ? 'pb-20 md:pb-6' : ''}`}>
          {currentTab === 'laravel-files' && <LaravelFilesView isDark={isDark} />}

          {currentTab === 'dev-guide' && <Step1GuideView isDark={isDark} />}

          {currentTab === 'roadmap' && (
            <RoadmapView onGoToStep1={() => setCurrentTab('dev-guide')} isDark={isDark} />
          )}

          {currentTab === 'demo' && (
            <div>
              {/* Space banner reminder with Laravel URL and mobile-friendly pills */}
              <div className={`border-b py-2 px-4 text-xs transition-colors ${
                isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${
                      currentSpace === 'patient' ? 'bg-emerald-400' :
                      currentSpace === 'reception' ? 'bg-amber-400' :
                      currentSpace === 'doctor' ? 'bg-sky-400' :
                      currentSpace === 'clinic_admin' ? 'bg-indigo-400' : 'bg-purple-400'
                    }`} />
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      Vue sélectionnée :{' '}
                      <strong className={
                        currentSpace === 'patient' ? 'text-emerald-500' :
                        currentSpace === 'reception' ? 'text-amber-500' :
                        currentSpace === 'doctor' ? 'text-sky-500' :
                        currentSpace === 'clinic_admin' ? 'text-indigo-500' : 'text-purple-500'
                      }>
                        {currentSpace === 'patient' && `Espace Patient Public (Réservation en ligne /e/${activeTenant.slug})`}
                        {currentSpace === 'reception' && `Espace Réceptionniste (Guichet & Appels +221)`}
                        {currentSpace === 'doctor' && `Espace Praticien (Consultations & Ordonnances)`}
                        {currentSpace === 'clinic_admin' && `Espace Direction / Admin du Cabinet (/e/${activeTenant.slug}/admin)`}
                        {currentSpace === 'saas_superadmin' && `Espace SuperAdmin Central SunuRDV Platform (/superadmin)`}
                      </strong>
                    </span>
                  </div>

                  {/* Desktop / tablet quick jump pills */}
                  <div className="hidden sm:flex items-center gap-1">
                    <button
                      onClick={() => setCurrentSpace('patient')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition ${
                        currentSpace === 'patient'
                          ? 'bg-emerald-600 text-white'
                          : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      👤 Patient
                    </button>
                    <button
                      onClick={() => setCurrentSpace('reception')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition ${
                        currentSpace === 'reception'
                          ? 'bg-amber-600 text-white'
                          : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📞 Guichet
                    </button>
                    <button
                      onClick={() => setCurrentSpace('doctor')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition ${
                        currentSpace === 'doctor'
                          ? 'bg-sky-600 text-white'
                          : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🩺 Médecin
                    </button>
                    <button
                      onClick={() => setCurrentSpace('clinic_admin')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition ${
                        currentSpace === 'clinic_admin'
                          ? 'bg-indigo-600 text-white'
                          : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ⚙️ Admin
                    </button>
                    <button
                      onClick={() => setCurrentSpace('saas_superadmin')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition ${
                        currentSpace === 'saas_superadmin'
                          ? 'bg-purple-600 text-white'
                          : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      👑 SuperAdmin
                    </button>
                  </div>
                </div>
              </div>

              {/* Render Distinct Spaces */}
              {currentSpace === 'patient' && (
                <BookingPortal
                  tenant={activeTenant}
                  practitioners={tenantPractitioners}
                  services={tenantServices}
                  onAppointmentCreated={handleAddAppointment}
                  isDark={isDark}
                />
              )}

              {currentSpace === 'reception' && (
                <ClinicDashboard
                  tenant={activeTenant}
                  practitioners={tenantPractitioners}
                  services={tenantServices}
                  appointments={tenantAppointments}
                  holidays={senegalHolidays}
                  onUpdateStatus={handleUpdateStatus}
                  onAddQuickAppointment={handleAddAppointment}
                  isDark={isDark}
                />
              )}

              {currentSpace === 'doctor' && (
                <DoctorSpace
                  doctor={tenantPractitioners[0] || initialPractitioners[0]}
                  appointments={tenantAppointments}
                  services={tenantServices}
                  isDark={isDark}
                  onUpdateStatus={handleUpdateStatus}
                />
              )}

              {currentSpace === 'clinic_admin' && (
                <ClinicAdminSpace
                  tenant={activeTenant}
                  practitioners={tenantPractitioners}
                  services={tenantServices}
                  appointments={tenantAppointments}
                  isDark={isDark}
                />
              )}

              {currentSpace === 'saas_superadmin' && (
                <SuperAdminSpace
                  tenants={tenants}
                  isDark={isDark}
                />
              )}
            </div>
          )}
        </main>

        {/* Mobile Fluid Bottom Navigation Bar (Visible only on mobile during demo) */}
        {currentTab === 'demo' && (
          <nav className={`sm:hidden fixed bottom-3 left-3 right-3 z-40 rounded-2xl p-1.5 shadow-2xl backdrop-blur-lg border transition-all ${
            isDark 
              ? 'bg-slate-900/90 border-slate-700/80 shadow-black/40' 
              : 'bg-white/95 border-slate-200/90 shadow-slate-300/50'
          }`}>
            <div className="grid grid-cols-5 gap-1 text-[10px] font-semibold">
              <button
                onClick={() => setCurrentSpace('patient')}
                className={`py-1.5 px-1 rounded-xl flex flex-col items-center gap-0.5 transition ${
                  currentSpace === 'patient'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Patient</span>
              </button>

              <button
                onClick={() => setCurrentSpace('reception')}
                className={`py-1.5 px-1 rounded-xl flex flex-col items-center gap-0.5 transition ${
                  currentSpace === 'reception'
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Guichet</span>
              </button>

              <button
                onClick={() => setCurrentSpace('doctor')}
                className={`py-1.5 px-1 rounded-xl flex flex-col items-center gap-0.5 transition ${
                  currentSpace === 'doctor'
                    ? 'bg-sky-600 text-white font-bold shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Médecin</span>
              </button>

              <button
                onClick={() => setCurrentSpace('clinic_admin')}
                className={`py-1.5 px-1 rounded-xl flex flex-col items-center gap-0.5 transition ${
                  currentSpace === 'clinic_admin'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>

              <button
                onClick={() => setCurrentSpace('saas_superadmin')}
                className={`py-1.5 px-1 rounded-xl flex flex-col items-center gap-0.5 transition ${
                  currentSpace === 'saas_superadmin'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Super</span>
              </button>
            </div>
          </nav>
        )}

        {/* Footer */}
        <footer className={`border-t py-6 text-xs transition-colors ${
          isDark ? 'bg-slate-950 border-slate-800/80 text-slate-500' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>SunuRDV</span>
              <span>— SaaS de prise de RDV au Sénégal (Mobile-First, Dark Mode & Espaces Multi-rôles).</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Dakar • FCFA • Wave • Orange Money</span>
              <span>•</span>
              <span className="text-emerald-500 font-mono">Laravel 11 Multi-tenant</span>
            </div>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}

