import React, { useState, useRef, useEffect } from 'react';
import { Tenant, SpaceType, ThemeMode } from '../types';
import { 
  Building2, 
  Code2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  MapPin, 
  ChevronDown, 
  Search, 
  X, 
  Sun, 
  Moon, 
  Menu, 
  ShieldCheck, 
  Stethoscope, 
  PhoneCall, 
  User, 
  Layers,
  FolderTree
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'demo' | 'dev-guide' | 'roadmap' | 'laravel-files';
  setCurrentTab: (tab: 'demo' | 'dev-guide' | 'roadmap' | 'laravel-files') => void;
  activeTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  allTenants: Tenant[];
  currentSpace: SpaceType;
  setCurrentSpace: (space: SpaceType) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  activeTenant,
  onSelectTenant,
  allTenants,
  currentSpace,
  setCurrentSpace,
  themeMode,
  setThemeMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const isDark = themeMode === 'dark';

  // Filter tenants based on search query
  const filteredTenants = allTenants.filter((tenant) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      tenant.name.toLowerCase().includes(query) ||
      tenant.city.toLowerCase().includes(query) ||
      tenant.tagline.toLowerCase().includes(query) ||
      tenant.slug.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTenant = (tenant: Tenant) => {
    onSelectTenant(tenant);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const spacesList: { id: SpaceType; label: string; icon: React.ReactNode; color: string; badge: string }[] = [
    { id: 'patient', label: 'Espace Patient (Public)', icon: <User className="w-3.5 h-3.5" />, color: 'bg-emerald-600', badge: 'Public' },
    { id: 'reception', label: 'Espace Réception & Guichet', icon: <PhoneCall className="w-3.5 h-3.5" />, color: 'bg-amber-600', badge: 'Accueil' },
    { id: 'doctor', label: 'Espace Médecin', icon: <Stethoscope className="w-3.5 h-3.5" />, color: 'bg-sky-600', badge: 'Consultation' },
    { id: 'clinic_admin', label: 'Espace Admin Cabinet', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'bg-indigo-600', badge: 'Direction' },
    { id: 'saas_superadmin', label: 'Espace SuperAdmin SaaS', icon: <Layers className="w-3.5 h-3.5" />, color: 'bg-purple-600', badge: 'Plateforme' },
  ];

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-200 ${
      isDark 
        ? 'bg-slate-900/95 border-slate-800 text-white' 
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      {/* Top Micro-Bar: Senegal Context, GMT, DarkMode Toggle */}
      <div className={`px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b ${
        isDark 
          ? 'bg-emerald-950/80 border-emerald-800/50 text-emerald-300' 
          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
      }`}>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold">SunuRDV • Sénégal SaaS</span>
          <span className="text-emerald-500 hidden sm:inline">•</span>
          <span className="hidden sm:flex items-center gap-1 font-mono text-[11px]">
            <Clock className="w-3 h-3" /> Africa/Dakar (GMT+0)
          </span>
          <span className="text-emerald-500 hidden sm:inline">•</span>
          <span className="font-medium text-[11px] hidden sm:inline">FCFA (XOF)</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick theme mode toggle */}
          <button
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
              isDark 
                ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700' 
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 shadow-xs'
            }`}
            title="Basculer entre Mode Sombre (Dark) et Mode Clair (Light)"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">Mode Clair</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden xs:inline">Mode Sombre</span>
              </>
            )}
          </button>

          <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] ${
            isDark ? 'bg-emerald-900/60 border-emerald-700/50 text-emerald-200' : 'bg-emerald-100 border-emerald-300 text-emerald-800'
          }`}>
            <span className="font-bold uppercase tracking-wider text-[10px]">Étape :</span>
            <span className="font-semibold">1 / 17 (Architecture Multi-tenant)</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-lg lg:hidden transition ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
            aria-label="Menu Mobile"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-black text-lg sm:text-xl tracking-tighter border border-emerald-400/30 shrink-0">
            SR
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-base sm:text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                SunuRDV
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                Sénégal
              </span>
            </div>
            <p className={`text-[10px] sm:text-xs truncate max-w-[170px] sm:max-w-none ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Cliniques, cabinets & SaaS multi-tenant
            </p>
          </div>
        </div>

        {/* Desktop View Navigation */}
        <nav className={`hidden lg:flex items-center p-1 rounded-xl border shadow-inner ${
          isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setCurrentTab('demo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'demo'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Démo Live Espaces</span>
          </button>

          <button
            onClick={() => setCurrentTab('laravel-files')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'laravel-files'
                ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Fichiers Laravel 11 🇸🇳</span>
          </button>

          <button
            onClick={() => setCurrentTab('dev-guide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'dev-guide'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Guide Étape 1</span>
          </button>

          <button
            onClick={() => setCurrentTab('roadmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'roadmap'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Roadmap (17 Étapes)</span>
          </button>
        </nav>

        {/* Global Search & Clinic Switcher */}
        <div className="flex items-center gap-2">
          <div ref={searchContainerRef} className="relative">
            <div className="flex items-center gap-1.5">
              <div className="relative flex items-center">
                <Search className={`w-3.5 h-3.5 absolute left-2.5 pointer-events-none ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="text"
                  placeholder="Rechercher clinique..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className={`rounded-lg pl-8 pr-7 py-1 text-xs focus:outline-none w-36 sm:w-48 md:w-56 transition border shadow-inner ${
                    isDark 
                      ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-400 focus:border-emerald-500' 
                      : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-emerald-600'
                  }`}
                />
                {searchQuery ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-2 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="absolute right-2 text-slate-400 hover:text-slate-200"
                  >
                    <ChevronDown className={`w-3 h-3 transition-transform ${isSearchOpen ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>

              {/* Active Clinic quick badge */}
              <div 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`hidden md:flex items-center gap-1.5 border rounded-lg px-2 py-1 text-xs cursor-pointer select-none transition ${
                  isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600 text-white' : 'bg-slate-100 border-slate-300 hover:border-slate-400 text-slate-900'
                }`}
                title={`${activeTenant.name} (${activeTenant.city})`}
              >
                <span className="text-sm">{activeTenant.logo}</span>
                <span className="max-w-[100px] truncate font-medium">
                  {activeTenant.name}
                </span>
              </div>
            </div>

            {/* Filtered Dropdown Popover */}
            {isSearchOpen && (
              <div className={`absolute right-0 mt-1.5 w-72 sm:w-80 rounded-xl shadow-2xl z-50 overflow-hidden divide-y border animate-in fade-in duration-150 ${
                isDark ? 'bg-slate-900 border-slate-700 divide-slate-800 text-white' : 'bg-white border-slate-300 divide-slate-200 text-slate-900'
              }`}>
                <div className={`p-2 flex items-center justify-between text-[11px] ${isDark ? 'bg-slate-950/80 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
                  <span>
                    {filteredTenants.length} établissement{filteredTenants.length > 1 ? 's' : ''} trouvé{filteredTenants.length > 1 ? 's' : ''}
                  </span>
                  {searchQuery && (
                    <span className="text-emerald-500 font-medium">Filtre: "{searchQuery}"</span>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
                  {filteredTenants.length > 0 ? (
                    filteredTenants.map((t) => {
                      const isSelected = t.id === activeTenant.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => handleSelectTenant(t)}
                          className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-emerald-950/40 border border-emerald-500/50'
                              : isDark ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <span className={`text-xl p-1 rounded-lg border shrink-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                            {t.logo}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold truncate">{t.name}</span>
                              {isSelected && (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.2 rounded font-semibold shrink-0">
                                  Actif
                                </span>
                              )}
                            </div>
                            <p className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.tagline}</p>
                            <div className="flex items-center gap-2 mt-1 text-[10px]">
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-emerald-500" /> {t.city}
                              </span>
                              <span>•</span>
                              <span className="font-mono text-emerald-500">/e/{t.slug}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-6 px-4 text-center text-xs text-slate-400 space-y-1">
                      <p>Aucun établissement trouvé.</p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-emerald-500 hover:underline text-[11px] font-semibold"
                      >
                        Effacer la recherche
                      </button>
                    </div>
                  )}
                </div>

                <div className={`p-2 text-[10px] flex items-center justify-between ${isDark ? 'bg-slate-950/90 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                  <span>Routing: <code className="text-emerald-500">/e/{activeTenant.slug}</code></span>
                  <span>Sénégal 🇸🇳</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Bar: Distinct Role/Space Switcher (Patient, Reception, Doctor, Clinic Admin, Superadmin) */}
      <div className={`border-t px-4 py-2 overflow-x-auto ${isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs min-w-[700px]">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Espace actif :
            </span>
            <div className={`flex items-center p-0.5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
              {spacesList.map((space) => {
                const isActive = currentSpace === space.id;
                return (
                  <button
                    key={space.id}
                    onClick={() => {
                      setCurrentSpace(space.id);
                      if (currentTab !== 'demo') setCurrentTab('demo');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      isActive 
                        ? `${space.color} text-white shadow-sm` 
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {space.icon}
                    <span>{space.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>URL Laravel :</span>
            <code className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-mono font-bold border border-emerald-500/20">
              {currentSpace === 'patient' && `/e/${activeTenant.slug}`}
              {currentSpace === 'reception' && `/e/${activeTenant.slug}/reception`}
              {currentSpace === 'doctor' && `/e/${activeTenant.slug}/praticien`}
              {currentSpace === 'clinic_admin' && `/e/${activeTenant.slug}/admin`}
              {currentSpace === 'saas_superadmin' && `/superadmin`}
            </code>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Mobile-first) */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden border-t p-4 space-y-4 animate-in slide-in-from-top-2 duration-200 ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Changer d'espace :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {spacesList.map((space) => (
                <button
                  key={space.id}
                  onClick={() => {
                    setCurrentSpace(space.id);
                    setCurrentTab('demo');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold ${
                    currentSpace === space.id
                      ? `${space.color} text-white border-transparent`
                      : isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {space.icon}
                    {space.label}
                  </span>
                  <span className="text-[10px] opacity-80 uppercase">{space.badge}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700/50 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigation Générale :
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setCurrentTab('demo'); setIsMobileMenuOpen(false); }}
                className={`py-2 rounded-lg text-xs font-bold ${currentTab === 'demo' ? 'bg-emerald-600 text-white' : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
              >
                Démo Espaces
              </button>
              <button
                onClick={() => { setCurrentTab('laravel-files'); setIsMobileMenuOpen(false); }}
                className={`py-2 rounded-lg text-xs font-bold ${currentTab === 'laravel-files' ? 'bg-red-600 text-white' : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
              >
                Fichiers Laravel 🇸🇳
              </button>
              <button
                onClick={() => { setCurrentTab('dev-guide'); setIsMobileMenuOpen(false); }}
                className={`py-2 rounded-lg text-xs font-bold ${currentTab === 'dev-guide' ? 'bg-blue-600 text-white' : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
              >
                Guide Étape 1
              </button>
              <button
                onClick={() => { setCurrentTab('roadmap'); setIsMobileMenuOpen(false); }}
                className={`py-2 rounded-lg text-xs font-bold ${currentTab === 'roadmap' ? 'bg-purple-600 text-white' : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
              >
                Roadmap
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
