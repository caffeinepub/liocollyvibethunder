import { ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Music, FileText, MessageCircle, User } from 'lucide-react';
import AuthButton from '../auth/AuthButton';

interface MobileShellProps {
  children: ReactNode;
}

export default function MobileShell({ children }: MobileShellProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="safe-top border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/generated/app-logo.dim_512x512.png" alt="LioCollyVibeThunder" className="h-8 w-8" />
            <span className="font-bold text-lg text-primary">LioCollyVibeThunder</span>
          </Link>
          <AuthButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="safe-bottom border-t border-border bg-card/80 backdrop-blur-sm sticky bottom-0 z-50">
        <div className="flex items-center justify-around px-2 py-2">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              isActive('/') && currentPath === '/'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Music className="h-5 w-5" />
            <span className="text-xs font-medium">Discover</span>
          </Link>
          <Link
            to="/lyrics"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              isActive('/lyrics')
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs font-medium">Lyrics</span>
          </Link>
          <Link
            to="/messages"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              isActive('/messages')
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs font-medium">Messages</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              isActive('/profile')
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
