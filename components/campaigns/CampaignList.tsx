import React from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Pause, BarChart2 } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  progress: number;
  totalContacts: number;
  successCount: number;
  scheduledTime?: string;
}

interface CampaignListProps {
  campaigns: Campaign[];
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onViewStats: (id: string) => void;
  isLoading?: boolean;
}

const statusConfig = {
  draft: { color: 'bg-gray-500', text: 'Draft' },
  scheduled: { color: 'bg-blue-500', text: 'Scheduled' },
  running: { color: 'bg-green-500', text: 'Running' },
  completed: { color: 'bg-purple-500', text: 'Completed' },
  paused: { color: 'bg-yellow-500', text: 'Paused' },
};

export function CampaignList({
  campaigns,
  onStart,
  onPause,
  onViewStats,
  isLoading,
}: CampaignListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <h3 className="text-lg font-semibold">No Campaigns</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first campaign to start sending messages.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {campaigns.map((campaign) => {
        const status = statusConfig[campaign.status];
        const isActive = campaign.status === 'running';
        const showProgress = campaign.status !== 'draft' && campaign.status !== 'scheduled';

        return (
          <GradientCard
            key={campaign.id}
            gradient={isActive ? 'success' : 'primary'}
            className="p-6"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{campaign.name}</h3>
                  {campaign.description && (
                    <p className="mt-1 text-sm text-white/80">{campaign.description}</p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className={status.color}>{status.text}</Badge>
                    {campaign.scheduledTime && (
                      <span className="text-xs text-white/60">
                        Scheduled: {new Date(campaign.scheduledTime).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {campaign.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant={isActive ? 'destructive' : 'secondary'}
                      onClick={() => (isActive ? onPause(campaign.id) : onStart(campaign.id))}
                      className="bg-white/20 hover:bg-white/30"
                    >
                      {isActive ? (
                        <>
                          <Pause className="mr-1 h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-1 h-4 w-4" />
                          Start
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewStats(campaign.id)}
                    className="bg-white/20 hover:bg-white/30"
                  >
                    <BarChart2 className="mr-1 h-4 w-4" />
                    Stats
                  </Button>
                </div>
              </div>

              {showProgress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{campaign.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <span>{campaign.successCount} delivered</span>
                    <span>{campaign.totalContacts} total</span>
                  </div>
                </div>
              )}
            </div>
          </GradientCard>
        );
      })}
    </div>
  );
}
