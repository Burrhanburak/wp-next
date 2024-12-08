import React from 'react';
import { Button } from '@/components/ui/button';
import { GradientCard } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface WhatsAppConnection {
  id: string;
  phoneNumber: string;
  businessName: string;
  status: 'pending' | 'active' | 'disconnected';
  lastSync?: string;
}

interface ConnectionListProps {
  connections: WhatsAppConnection[];
  onVerify: (id: string) => void;
  onDisconnect: (id: string) => void;
  isLoading?: boolean;
}

const statusConfig = {
  pending: {
    color: 'bg-yellow-500',
    icon: AlertCircle,
    text: 'Pending Verification',
  },
  active: {
    color: 'bg-green-500',
    icon: CheckCircle,
    text: 'Active',
  },
  disconnected: {
    color: 'bg-red-500',
    icon: XCircle,
    text: 'Disconnected',
  },
};

export const ConnectionList = ({
  connections,
  onVerify,
  onDisconnect,
  isLoading,
}: ConnectionListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <h3 className="text-lg font-semibold">No WhatsApp Connections</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Add your first WhatsApp connection to start sending messages.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {connections.map((connection) => {
        const status = statusConfig[connection.status];
        const StatusIcon = status.icon;

        return (
          <GradientCard
            key={connection.id}
            gradient={connection.status === 'active' ? 'success' : 'primary'}
            className="p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{connection.businessName}</h3>
                <p className="mt-1 text-sm text-white/80">{connection.phoneNumber}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className={status.color}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {status.text}
                  </Badge>
                  {connection.lastSync && (
                    <span className="text-xs text-white/60">
                      Last synced: {connection.lastSync}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {connection.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => onVerify(connection.id)}
                    className="bg-white/20 hover:bg-white/30"
                  >
                    Verify
                  </Button>
                )}
                {connection.status === 'active' && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDisconnect(connection.id)}
                    className="bg-white/20 hover:bg-white/30"
                  >
                    Disconnect
                  </Button>
                )}
              </div>
            </div>
          </GradientCard>
        );
      })}
    </div>
  );
};
