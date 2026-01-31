import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { CardGrid } from '@/components/ui/card-grid';
import { DataCard } from '@/components/ui/data-card';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CardSkeleton } from '@/components/ui/page-loader';
import { MessageSquare, Mail, Phone, Globe, Search, RefreshCw, AlertCircle, Hash, Smartphone } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';
import { 
  useChannels, 
  useDeleteChannel,
  useActivateChannel,
  useDeactivateChannel,
  useTestChannelConnection,
} from '@/hooks/queries';
import type { Channel, ChannelType, ChannelStatus } from '@/services/channels';

const channelTypeIcons: Record<ChannelType, React.ComponentType<{ className?: string }>> = {
  whatsapp: Smartphone,
  email: Mail,
  sms: Phone,
  chat: MessageSquare,
  facebook: Hash,
  instagram: Hash,
  twitter: Hash,
  api: Globe,
};

const channelTypeLabels: Record<ChannelType, string> = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  sms: 'SMS',
  chat: 'Live Chat',
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'Twitter',
  api: 'API',
};

export default function Channels() {
  const [searchQuery, setSearchQuery] = useState('');
  const { canCreate, canUpdate, canDelete } = usePermission();

  // Fetch channels from API
  const { 
    data: channelsData, 
    isLoading, 
    isError, 
    error,
    refetch,
  } = useChannels({ search: searchQuery || undefined });

  // Mutations
  const deleteMutation = useDeleteChannel();
  const activateMutation = useActivateChannel();
  const deactivateMutation = useDeactivateChannel();
  const testConnectionMutation = useTestChannelConnection();

  // Get channels list
  const channels = channelsData?.items || [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleToggleStatus = (channel: Channel) => {
    if (channel.status === 'active') {
      deactivateMutation.mutate(channel.id);
    } else {
      activateMutation.mutate(channel.id);
    }
  };

  // Build actions array based on permissions
  const getChannelActions = (channel: Channel) => {
    const actions: Array<{ label: string; onClick: () => void; destructive?: boolean }> = [];

    if (canUpdate('channels')) {
      actions.push({ label: 'Configure', onClick: () => console.log('Configure', channel.id) });
      actions.push({ 
        label: 'Test Connection', 
        onClick: () => testConnectionMutation.mutate(channel.id),
      });
      actions.push({ 
        label: channel.status === 'active' ? 'Deactivate' : 'Activate', 
        onClick: () => handleToggleStatus(channel),
        destructive: channel.status === 'active',
      });
    }

    if (canDelete('channels')) {
      actions.push({ 
        label: 'Delete', 
        onClick: () => {
          if (window.confirm('Are you sure you want to delete this channel?')) {
            deleteMutation.mutate(channel.id);
          }
        }, 
        destructive: true 
      });
    }

    return actions;
  };

  return (
    <div>
      <PageHeader
        title="Channels"
        description="Manage communication channels"
        action={canCreate('channels') ? {
          label: 'Add Channel',
          onClick: () => console.log('Add channel'),
        } : undefined}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </PageHeader>

      <div className="p-6">
        {/* Error State */}
        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load channels. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && <CardSkeleton count={6} />}

        {/* Data Grid */}
        {!isLoading && !isError && (
          <>
            <CardGrid>
              {channels.map((channel) => {
                const Icon = channelTypeIcons[channel.type] || MessageSquare;
                return (
                  <DataCard
                    key={channel.id}
                    title={channel.name}
                    subtitle={channelTypeLabels[channel.type] || channel.type}
                    icon={<Icon className="h-5 w-5 text-muted-foreground" />}
                    badges={
                      <>
                        <StatusBadge variant={getStatusVariant(channel.status as ChannelStatus)}>
                          {channel.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </StatusBadge>
                        {channel.is_default && (
                          <StatusBadge variant="info">Default</StatusBadge>
                        )}
                      </>
                    }
                    metadata={[
                      { label: 'Team', value: channel.default_team_name || 'Unassigned' },
                      { label: 'Conversations', value: channel.conversation_count ?? 0 },
                      { label: 'Created', value: formatDate(channel.created_at) },
                    ]}
                    onClick={() => console.log('View channel', channel.id)}
                    actions={getChannelActions(channel)}
                  />
                );
              })}
            </CardGrid>

            {/* Empty State */}
            {channels.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No channels found matching your search' : 'No channels found'}
                </p>
                {!searchQuery && canCreate('channels') && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => console.log('Add channel')}
                  >
                    Add your first channel
                  </Button>
                )}
              </div>
            )}

            {/* Pagination info */}
            {channelsData && channelsData.total > 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Showing {channels.length} of {channelsData.total} channels
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
