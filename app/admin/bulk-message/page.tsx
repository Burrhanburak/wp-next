'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CriticalActionVerification } from '@/components/admin/auth/CriticalActionVerification';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export default function BulkMessagePage() {
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  const handleSendBulkMessage = async () => {
    if (!isVerified) {
      toast({
        title: 'Doğrulama Gerekli',
        description: 'Toplu mesaj göndermek için SMS doğrulaması gerekiyor.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Toplu mesaj gönderme işlemi burada yapılacak
      toast({
        title: 'Başarılı',
        description: 'Toplu mesaj gönderme işlemi başlatıldı.',
      });
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error.message || 'Bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Toplu Mesaj Gönderimi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="min-h-[200px]"
          />
          
          {!isVerified ? (
            <CriticalActionVerification
              userId={session.user.id}
              action={{
                type: 'BULK_ACTION',
                metadata: {
                  messageLength: message.length,
                  timestamp: new Date().toISOString()
                }
              }}
              onVerificationComplete={() => setIsVerified(true)}
              onCancel={() => setIsVerified(false)}
            />
          ) : (
            <Button 
              onClick={handleSendBulkMessage}
              className="w-full"
            >
              Toplu Mesaj Gönder
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
