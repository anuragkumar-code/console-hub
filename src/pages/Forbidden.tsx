import { useNavigate } from 'react-router-dom';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Forbidden() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
          <ShieldX className="h-12 w-12 text-destructive" />
        </div>

        {/* Error Code */}
        <h1 className="mb-2 text-6xl font-bold text-foreground">403</h1>

        {/* Title */}
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          Access Denied
        </h2>

        {/* Description */}
        <p className="mb-8 text-muted-foreground">
          Sorry, you don't have permission to access this page. 
          {user?.role?.name && (
            <span className="block mt-2">
              Your current role is <strong>{user.role.name}</strong>.
            </span>
          )}
          If you believe this is an error, please contact your administrator.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </div>

        {/* Additional Help */}
        <p className="mt-8 text-sm text-muted-foreground">
          Need help?{' '}
          <a
            href="mailto:support@example.com"
            className="text-primary underline-offset-4 hover:underline"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
