import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

interface AuthGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AuthGate({ children, fallback }: AuthGateProps) {
  const { identity, login, loginStatus } = useInternetIdentity();

  if (!identity) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert className="m-4">
        <Lock className="h-4 w-4" />
        <AlertTitle>Sign in required</AlertTitle>
        <AlertDescription className="mt-2 space-y-3">
          <p>You need to sign in to access this feature.</p>
          <Button onClick={login} disabled={loginStatus === 'logging-in'} size="sm">
            {loginStatus === 'logging-in' ? 'Logging in...' : 'Sign in'}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}
