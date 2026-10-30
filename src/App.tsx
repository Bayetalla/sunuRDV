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
import { Tenant, Practitioner, MedicalService, Appointment, AppointmentStatus, SpaceType, ThemeMode } from './types';
import { Sparkles, Code2, HeartHandshake, Shield, User, PhoneCall, Stethoscope, ShieldCheck, Layers } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'demo' | 'dev-guide' | 'roadmap' | 'laravel-files'>('demo');
  const [activeTenant, setActiveTenant] = useState<Tenant>(tenants[0]);
  const [currentSpace, setCurrentSpace] = useState<SpaceType>('patient');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  // Appointments, Practitioners & Services state
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [practitioners, setPractitioners] = useState<Practitioner[]>(initialPractitioners);
  const [services, setServices] = useState<MedicalService[]>(initialServices);

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
  const tenantPractitioners = practitioners.filter((p) => p.tenantId === activeTenant.id);
  const tenantServices = services.filter((s) => s.tenantId === activeTenant.id);
  const tenantAppointments = appointments.filter((a) => a.tenantId === activeTenant.id);

  const handleUpdateStatus = (aptId: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: newStatus } : a))
    );
  };

  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  // Practitioners CRUD handlers
  const handleSavePractitioner = (docData: Omit<Practitioner, 'id'> & { id?: string }) => {
    if (docData.id) {
      setPractitioners((prev) =>
        prev.map((p) => (p.id === docData.id ? ({ ...p, ...docData } as Practitioner) : p))
      );
    } else {
      const newDoc: Practitioner = {
        ...docData,
        id: `p-${Date.now()}`,
      } as Practitioner;
      setPractitioners((prev) => [...prev, newDoc]);
    }
  };

  const handleDeletePractitioner = (docId: string) => {
    setPractitioners((prev) => prev.filter((p) => p.id !== docId));
  };

  // Services CRUD handlers
  const handleSaveService = (serviceData: Omit<MedicalService, 'id'> & { id?: string }) => {
    if (serviceData.id) {
      // Update
      setServices((prev) =>
        prev.map((s) => (s.id === serviceData.id ? ({ ...s, ...serviceData } as MedicalService) : s))
      );
    } else {
      // Create
      const newService: MedicalService = {
        ...serviceData,
        id: `s-${Date.now()}`,
      } as MedicalService;
      setServices((prev) => [newService, ...prev]);
    }
  };

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  const handleTogglePractitionerService = (serviceId: string, practitionerId: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== serviceId) return s;
        const exists = s.practitionerIds.includes(practitionerId);
        return {
          ...s,
          practitionerIds: exists
            ? s.practitionerIds.filter((id: string) => id !== practitionerId)
            : [...s.practitionerIds, practitionerId],
        };
      })
    );
  };

  return (
    <ToastProvider>
      <div className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col font-sans transition-colors duration-200 ${
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
        <main className={`flex-1 w-full max-w-full overflow-x-hidden ${currentTab === 'demo' ? 'pb-24 sm:pb-8' : 'pb-8'}`}>
          {currentTab === 'laravel-files' && <LaravelFilesView isDark={isDark} />}

          {currentTab === 'dev-guide' && <Step1GuideView isDark={isDark} />}

          {currentTab === 'roadmap' && (
            <RoadmapView onGoToStep1={() => setCurrentTab('dev-guide')} isDark={isDark} />
          )}

          {currentTab === 'demo' && (
            <div className="w-full max-w-full overflow-x-hidden">
              {/* Space banner reminder with Laravel URL and mobile-friendly pills */}
              <div className={`border-b py-2 px-3 sm:px-4 text-xs transition-colors ${
                isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${
                      currentSpace === 'patient' ? 'bg-emerald-400' :
                      currentSpace === 'reception' ? 'bg-amber-400' :
                      currentSpace === 'doctor' ? 'bg-sky-400' :
                      currentSpace === 'clinic_admin' ? 'bg-indigo-400' : 'bg-purple-400'
                    }`} />
                    <span className={`break-words min-w-0 text-[11px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Vue :{' '}
                      <strong className={
                        currentSpace === 'patient' ? 'text-emerald-500' :
                        currentSpace === 'reception' ? 'text-amber-500' :
                        currentSpace === 'doctor' ? 'text-sky-500' :
                        currentSpace === 'clinic_admin' ? 'text-indigo-500' : 'text-purple-500'
                      }>
                        {currentSpace === 'patient' && `Espace Patient (/e/${activeTenant.slug})`}
                        {currentSpace === 'reception' && `Espace Réceptionniste (Guichet +221)`}
                        {currentSpace === 'doctor' && `Espace Praticien (Consultations)`}
                        {currentSpace === 'clinic_admin' && `Admin Cabinet (/e/${activeTenant.slug}/admin)`}
                        {currentSpace === 'saas_superadmin' && `SuperAdmin SaaS SunuRDV (/superadmin)`}
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
                  allPractitioners={tenantPractitioners}
                  appointments={tenantAppointments}
                  services={tenantServices}
                  isDark={isDark}
                  onUpdateStatus={handleUpdateStatus}
                  onSaveService={handleSaveService}
                  onDeleteService={handleDeleteService}
                  onTogglePractitionerService={handleTogglePractitionerService}
                />
              )}

              {currentSpace === 'clinic_admin' && (
                <ClinicAdminSpace
                  tenant={activeTenant}
                  practitioners={tenantPractitioners}
                  services={tenantServices}
                  appointments={tenantAppointments}
                  isDark={isDark}
                  onSavePractitioner={handleSavePractitioner}
                  onDeletePractitioner={handleDeletePractitioner}
                  onSaveService={handleSaveService}
                  onDeleteService={handleDeleteService}
                  onTogglePractitionerService={handleTogglePractitionerService}
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
          <nav className={`sm:hidden fixed bottom-2 left-2 right-2 xs:bottom-3 xs:left-3 xs:right-3 z-40 rounded-2xl p-1 shadow-2xl backdrop-blur-lg border transition-all ${
            isDark 
              ? 'bg-slate-900/95 border-slate-700/80 shadow-black/50' 
              : 'bg-white/95 border-slate-200/90 shadow-slate-300/50'
          }`}>
            <div className="grid grid-cols-5 gap-0.5 text-[9px] xs:text-[10px] font-semibold">
              <button
                onClick={() => setCurrentSpace('patient')}
                className={`py-1.5 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition min-w-0 ${
                  currentSpace === 'patient'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 xs:w-4 xs:h-4 shrink-0" />
                <span className="truncate max-w-full">Patient</span>
              </button>

              <button
                onClick={() => setCurrentSpace('reception')}
                className={`py-1.5 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition min-w-0 ${
                  currentSpace === 'reception'
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5 xs:w-4 xs:h-4 shrink-0" />
                <span className="truncate max-w-full">Guichet</span>
              </button>

              <button
                onClick={() => setCurrentSpace('doctor')}
                className={`py-1.5 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition min-w-0 ${
                  currentSpace === 'doctor'
                    ? 'bg-sky-600 text-white font-bold shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 xs:w-4 xs:h-4 shrink-0" />
                <span className="truncate max-w-full">Médecin</span>
              </button>

              <button
                onClick={() => setCurrentSpace('clinic_admin')}
                className={`py-1.5 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition min-w-0 ${
                  currentSpace === 'clinic_admin'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 xs:w-4 xs:h-4 shrink-0" />
                <span className="truncate max-w-full">Admin</span>
              </button>

              <button
                onClick={() => setCurrentSpace('saas_superadmin')}
                className={`py-1.5 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition min-w-0 ${
                  currentSpace === 'saas_superadmin'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 xs:w-4 xs:h-4 shrink-0" />
                <span className="truncate max-w-full">Super</span>
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

