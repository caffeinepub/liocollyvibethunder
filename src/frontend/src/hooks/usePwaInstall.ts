import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const checkInstalled = () => {
      // Check for display-mode: standalone
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      // Check for iOS standalone
      const isIosStandalone = (window.navigator as any).standalone === true;
      
      setIsInstalled(isStandalone || isIosStandalone);
    };

    checkInstalled();

    // Listen for beforeinstallprompt event (Android Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Install prompt error:', error);
      return false;
    } finally {
      setIsInstalling(false);
    }
  };

  return {
    canInstall: !!deferredPrompt && !isInstalled,
    isInstalled,
    isInstalling,
    install,
  };
}
