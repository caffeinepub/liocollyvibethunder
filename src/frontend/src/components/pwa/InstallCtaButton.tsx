import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

interface InstallCtaButtonProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
}

export default function InstallCtaButton({ 
  variant = 'ghost', 
  size = 'icon',
  showText = false 
}: InstallCtaButtonProps) {
  const { canInstall, isInstalled, isInstalling, install } = usePwaInstall();
  const navigate = useNavigate();

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    // If native install prompt is available (Android Chrome, etc.)
    if (canInstall) {
      const success = await install();
      if (success) {
        toast.success('App installed successfully!');
      }
    } else {
      // Fallback for iOS and other browsers - navigate to help page
      navigate({ to: '/help' });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleInstall}
      disabled={isInstalling}
      aria-label="Install app"
      className="transition-colors"
    >
      <Download className={showText ? 'h-4 w-4 mr-2' : 'h-5 w-5'} />
      {showText && (isInstalling ? 'Installing...' : 'Install')}
    </Button>
  );
}
