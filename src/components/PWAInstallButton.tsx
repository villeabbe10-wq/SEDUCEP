import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white shadow-lg hover:bg-emerald-700 transition uppercase tracking-widest"
      >
        <Download size={14} />
        Installer l'App
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white shadow-lg hover:bg-slate-800 transition uppercase tracking-widest"
        >
          <Download size={14} />
          Installer
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl relative text-center">
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all"
              >
                <X size={20} />
              </button>
              
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Download size={32} />
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-2">Installer sur iOS</h3>
              <p className="text-sm text-slate-500 font-medium mb-8">
                Installez l'application SEDUCEP pour un accès direct depuis votre écran d'accueil.
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-4">
                <p className="text-sm text-slate-700 font-medium">
                  <span className="inline-block w-6 h-6 rounded-full bg-slate-200 text-center font-bold mr-2 text-slate-900">1</span> 
                  Appuyez sur le bouton <strong>Partager</strong> dans la barre Safari.
                </p>
                <p className="text-sm text-slate-700 font-medium">
                  <span className="inline-block w-6 h-6 rounded-full bg-slate-200 text-center font-bold mr-2 text-slate-900">2</span> 
                  Faites défiler et choisissez <strong>Sur l'écran d'accueil</strong>.
                </p>
              </div>
              
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-8 w-full rounded-2xl bg-slate-900 py-4 text-sm font-black text-white hover:bg-slate-800 transition"
              >
                J'ai compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
