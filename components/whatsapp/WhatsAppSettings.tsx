import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Validation schema for WhatsApp settings
const whatsappSettingsSchema = z.object({
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  businessName: z.string().min(1, 'Business name is required'),
  webhookUrl: z.string().url('Invalid webhook URL').optional(),
  messageTemplate: z.string().min(1, 'Message template is required'),
  dailyLimit: z.number().min(1, 'Daily limit must be at least 1'),
  retryAttempts: z.number().min(0, 'Retry attempts must be non-negative'),
});

type WhatsAppSettingsData = z.infer<typeof whatsappSettingsSchema>;

interface WhatsAppConnection {
  id: string;
  phoneNumber: string;
  businessName: string;
  status: 'active' | 'pending' | 'disconnected';
  lastSync: string;
}

export function WhatsAppSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [connections, setConnections] = useState<WhatsAppConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [autoRetry, setAutoRetry] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WhatsAppSettingsData>({
    resolver: zodResolver(whatsappSettingsSchema),
  });

  // Fetch WhatsApp connections
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch('/api/whatsapp/connections');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch WhatsApp connections');
        }

        setConnections(data.connections);
        if (data.connections.length > 0) {
          setSelectedConnection(data.connections[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch WhatsApp connections:', error);
        toast.error('Failed to load WhatsApp connections');
      }
    };

    fetchConnections();
  }, []);

  // Handle form submission
  const onSubmit = async (data: WhatsAppSettingsData) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/whatsapp/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update WhatsApp settings');
      }

      toast.success('WhatsApp settings updated successfully');
      reset(data);
    } catch (error) {
      console.error('WhatsApp settings update error:', error);
      toast.error('Failed to update WhatsApp settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle connection verification
  const verifyConnection = async (connectionId: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/whatsapp/verify/${connectionId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      toast.success('WhatsApp connection verified successfully');
      
      // Update connection status
      setConnections(connections.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'active' as const } 
          : conn
      ));
    } catch (error) {
      console.error('WhatsApp verification error:', error);
      toast.error('Failed to verify WhatsApp connection');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle connection removal
  const removeConnection = async (connectionId: string) => {
    try {
      if (!confirm('Are you sure you want to remove this WhatsApp connection?')) {
        return;
      }

      setIsLoading(true);

      const response = await fetch(`/api/whatsapp/connections/${connectionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove connection');
      }

      setConnections(connections.filter(conn => conn.id !== connectionId));
      toast.success('WhatsApp connection removed successfully');
    } catch (error) {
      console.error('Failed to remove WhatsApp connection:', error);
      toast.error('Failed to remove WhatsApp connection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* WhatsApp Connections */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Connections</CardTitle>
          <CardDescription>
            Manage your WhatsApp Business API connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connections.length > 0 ? (
              <div className="space-y-4">
                {connections.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{connection.businessName}</p>
                      <p className="text-sm text-gray-500">
                        {connection.phoneNumber}
                      </p>
                      <p className="text-xs text-gray-400">
                        Last sync: {connection.lastSync}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        connection.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : connection.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {connection.status}
                      </div>
                      {connection.status !== 'active' && (
                        <Button
                          size="sm"
                          onClick={() => verifyConnection(connection.id)}
                          disabled={isLoading}
                        >
                          Verify
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeConnection(connection.id)}
                        disabled={isLoading}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No WhatsApp connections configured.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Settings */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Settings</CardTitle>
          <CardDescription>
            Configure your WhatsApp messaging settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1234567890"
                  {...register('phoneNumber')}
                  disabled={isLoading}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Your Business Name"
                  {...register('businessName')}
                  disabled={isLoading}
                />
                {errors.businessName && (
                  <p className="text-sm text-red-500">
                    {errors.businessName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
              <Input
                id="webhookUrl"
                placeholder="https://your-webhook-url.com"
                {...register('webhookUrl')}
                disabled={isLoading}
              />
              {errors.webhookUrl && (
                <p className="text-sm text-red-500">
                  {errors.webhookUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="messageTemplate">Default Message Template</Label>
              <Input
                id="messageTemplate"
                placeholder="Enter your default message template"
                {...register('messageTemplate')}
                disabled={isLoading}
              />
              {errors.messageTemplate && (
                <p className="text-sm text-red-500">
                  {errors.messageTemplate.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dailyLimit">Daily Message Limit</Label>
                <Input
                  id="dailyLimit"
                  type="number"
                  min="1"
                  {...register('dailyLimit', { valueAsNumber: true })}
                  disabled={isLoading}
                />
                {errors.dailyLimit && (
                  <p className="text-sm text-red-500">
                    {errors.dailyLimit.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="retryAttempts">Retry Attempts</Label>
                <Input
                  id="retryAttempts"
                  type="number"
                  min="0"
                  {...register('retryAttempts', { valueAsNumber: true })}
                  disabled={isLoading}
                />
                {errors.retryAttempts && (
                  <p className="text-sm text-red-500">
                    {errors.retryAttempts.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoRetry"
                checked={autoRetry}
                onCheckedChange={setAutoRetry}
                disabled={isLoading}
              />
              <Label htmlFor="autoRetry">Enable automatic retry for failed messages</Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
