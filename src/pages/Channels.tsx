import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { CardGrid } from '@/components/ui/card-grid';
import { DataCard } from '@/components/ui/data-card';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { channels } from '@/data/mockData';
import { MessageSquare, Mail, Phone, Globe, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const channelTypeIcons = {
  whatsapp: MessageSquare,
  email: Mail,
  sms: Phone,
  web_chat: Globe,
};

const channelTypeLabels = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  sms: 'SMS',
  web_chat: 'Web Chat',
};

export default function Channels() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Channels"
        description="Manage communication channels"
        action={{
          label: 'Add Channel',
          onClick: () => console.log('Add channel'),
        }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9"
          />
        </div>
      </PageHeader>

      <div className="p-6">
        <CardGrid>
          {filteredChannels.map((channel) => {
            const Icon = channelTypeIcons[channel.type];
            return (
              <DataCard
                key={channel.id}
                title={channel.name}
                subtitle={channelTypeLabels[channel.type]}
                icon={<Icon className="h-5 w-5 text-muted-foreground" />}
                badges={
                  <StatusBadge variant={getStatusVariant(channel.status)}>
                    {channel.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </StatusBadge>
                }
                metadata={[
                  { label: 'Team', value: channel.assignedTeam || 'Unassigned' },
                  { label: 'Created', value: new Date(channel.createdAt).toLocaleDateString() },
                ]}
                onClick={() => console.log('View channel', channel.id)}
                actions={[
                  { label: 'Configure', onClick: () => console.log('Configure', channel.id) },
                  { label: 'Test Connection', onClick: () => console.log('Test', channel.id) },
                  { label: 'Deactivate', onClick: () => console.log('Deactivate', channel.id), destructive: true },
                ]}
              />
            );
          })}
        </CardGrid>

        {filteredChannels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No channels found</p>
          </div>
        )}
      </div>
    </div>
  );
}
