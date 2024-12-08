import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SecuritySettingsProps {
  userId: string;
}

export function SecuritySettings({ userId }: SecuritySettingsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [apiKeys, setApiKeys] = useState<Array<{ id: string; name: string; lastUsed: string }>>([]);

  // Fetch security settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/user/security-settings');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch security settings');
        }

        setMfaEnabled(data.mfaEnabled);
        setApiKeys(data.apiKeys || []);
      } catch (error) {
        console.error('Failed to fetch security settings:', error);
        toast.error('Failed to load security settings');
      }
    };

    fetchSettings();
  }, []);

  // Handle MFA toggle
  const handleMFAToggle = async () => {
    if (mfaEnabled) {
      // Show confirmation dialog for disabling MFA
      if (!confirm('Are you sure you want to disable Two-Factor Authentication? This will make your account less secure.')) {
        return;
      }

      router.push('/auth/mfa/disable');
    } else {
      router.push('/auth/mfa/setup');
    }
  };

  // Generate new API key
  const generateApiKey = async () => {
    try {
      setIsLoading(true);
      const keyName = prompt('Enter a name for this API key:');
      
      if (!keyName) return;

      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: keyName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate API key');
      }

      // Show the API key to the user (only shown once)
      toast.success(
        <div className="space-y-2">
          <p>API Key generated successfully!</p>
          <p className="text-xs">Make sure to copy your API key now. You won't be able to see it again:</p>
          <code className="block p-2 bg-gray-800 rounded text-xs">{data.key}</code>
        </div>,
        { duration: 10000 }
      );

      // Refresh API keys list
      setApiKeys([...apiKeys, { id: data.id, name: keyName, lastUsed: 'Never' }]);
    } catch (error) {
      console.error('Failed to generate API key:', error);
      toast.error('Failed to generate API key');
    } finally {
      setIsLoading(false);
    }
  };

  // Revoke API key
  const revokeApiKey = async (keyId: string) => {
    try {
      if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
        return;
      }

      setIsLoading(true);
      const response = await fetch(`/api/user/api-keys/${keyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to revoke API key');
      }

      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      toast.success('API key revoked successfully');
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      toast.error('Failed to revoke API key');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account by requiring both your password and an authentication code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500">
                {mfaEnabled
                  ? 'Your account is protected with two-factor authentication.'
                  : 'Protect your account with two-factor authentication.'}
              </p>
            </div>
            <Switch
              checked={mfaEnabled}
              onCheckedChange={handleMFAToggle}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage API keys for programmatic access to the WhatsApp Bulk Messaging Platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={generateApiKey}
              disabled={isLoading}
            >
              Generate New API Key
            </Button>

            {apiKeys.length > 0 ? (
              <div className="border rounded-lg divide-y">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{key.name}</p>
                      <p className="text-sm text-gray-500">
                        Last used: {key.lastUsed}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => revokeApiKey(key.id)}
                      disabled={isLoading}
                    >
                      Revoke
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No API keys generated yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
