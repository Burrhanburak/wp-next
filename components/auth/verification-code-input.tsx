'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface VerificationCodeInputProps {
  email: string;
}

export function VerificationCodeInput({ email }: VerificationCodeInputProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleVerification = async () => {
    if (!verificationCode) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter the verification code",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      toast({
        title: "Success",
        description: "Email verified successfully!",
      });

      // Redirect to dashboard after successful verification
      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Verification failed',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification code');
      }

      toast({
        title: "Success",
        description: "New verification code sent to your email",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to resend verification code',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              We've sent a verification code to
            </p>
            <p className="font-medium">{email}</p>
          </div>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length <= 6) {
                  setVerificationCode(value);
                }
              }}
              className="text-center text-lg tracking-[0.5em] font-medium h-12"
              maxLength={6}
            />
            <p className="text-xs text-center text-muted-foreground">
              Enter the 6-digit code sent to your email
            </p>
          </div>
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={handleVerification}
              disabled={isVerifying || verificationCode.length !== 6}
            >
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Code
            </Button>
            <div className="text-center">
              <Button
                variant="link"
                className="text-xs"
                onClick={handleResendCode}
                disabled={isResending}
              >
                {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Didn't receive the code? Send again
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
