import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPassword() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Reset link sent',
      description: 'Check your email for password reset instructions.',
    });

    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleResend = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Email resent',
      description: 'A new reset link has been sent to your email.',
    });
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-xl mb-4">
            CRM
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {isSubmitted ? 'Check your email' : 'Forgot password?'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isSubmitted 
              ? "We've sent you a password reset link" 
              : "No worries, we'll send you reset instructions"
            }
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl">Reset password</CardTitle>
                <CardDescription>
                  Enter the email associated with your account
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </Button>

                <Link 
                  to="/login" 
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </Link>
              </CardFooter>
            </form>
          ) : (
            <>
              <CardHeader className="space-y-1 pb-4 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center animate-scale-in">
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  </div>
                </div>
                <CardTitle className="text-xl">Email sent!</CardTitle>
                <CardDescription>
                  We sent a password reset link to
                  <br />
                  <span className="font-medium text-foreground">{email}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleResend}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    'Resend email'
                  )}
                </Button>

                <Link 
                  to="/login" 
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </Link>
              </CardFooter>
            </>
          )}
        </Card>

        {/* Help text */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Need help?{' '}
          <a href="#" className="text-primary hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  );
}
