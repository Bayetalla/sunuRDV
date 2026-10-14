import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, MessageSquare, X, CalendarCheck2, Bell } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'whatsapp' | 'appointment';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Web Audio API subtle chime
const playNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // First note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.25);

    // Second higher note (harmonious confirmation chime)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
    gain2.gain.setValueAtTime(0.08, ctx.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.1);
    osc2.stop(ctx.currentTime + 0.4);
  } catch {
    // Audio might be blocked by browser policy until interaction
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const duration = toast.duration || (toast.type === 'appointment' ? 6000 : 4000);
    
    // Play pleasant chime
    playNotificationSound();

    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Floating fluid Toast container */}
      <div 
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto rounded-2xl p-4 shadow-2xl backdrop-blur-md border text-xs flex items-start gap-3.5 transition-all duration-300 animate-slideUp ${
              toast.type === 'appointment'
                ? 'bg-slate-900/95 dark:bg-slate-900/95 text-white border-emerald-500/80 shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                : toast.type === 'whatsapp'
                ? 'bg-slate-900/95 dark:bg-slate-900/95 text-white border-emerald-500/50 shadow-emerald-950/40'
                : toast.type === 'success'
                ? 'bg-slate-900/95 dark:bg-slate-900/95 text-white border-emerald-500/50 shadow-emerald-950/30'
                : toast.type === 'warning'
                ? 'bg-slate-900/95 dark:bg-slate-900/95 text-white border-amber-500/50 shadow-amber-950/30'
                : 'bg-slate-900/95 dark:bg-slate-900/95 text-white border-sky-500/50 shadow-sky-950/30'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'appointment' ? (
                <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-md animate-pulse">
                  <CalendarCheck2 className="w-5 h-5" />
                </div>
              ) : toast.type === 'whatsapp' ? (
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
              ) : toast.type === 'success' ? (
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : toast.type === 'warning' ? (
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                  <Info className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">{toast.title}</span>
                {toast.type === 'appointment' && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 uppercase">
                    🇸🇳 Temps Réel
                  </span>
                )}
              </div>
              {toast.message && (
                <div className="text-slate-300 text-xs leading-relaxed break-words">{toast.message}</div>
              )}
              {toast.action && (
                <div className="pt-1.5">
                  <button
                    onClick={() => {
                      toast.action?.onClick();
                      removeToast(toast.id);
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition shadow-xs"
                  >
                    {toast.action.label}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition shrink-0"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
