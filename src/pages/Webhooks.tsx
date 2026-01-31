import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Webhook, 
  Plus, 
  Copy, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  Loader2,
  CheckCircle2,
  Play,
  Globe,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';
import { useWebhooks, useCreateWebhook, useDeleteWebhook, useTestWebhook } from '@/hooks/queries';

// Available webhook events
const WEBHOOK_EVENTS = [
  { id: 'contact.created', label: 'Contact Created', category: 'Contacts' },
  { id: 'contact.updated', label: 'Contact Updated', category: 'Contacts' },
  { id: 'contact.deleted', label: 'Contact Deleted', category: 'Contacts' },
  { id: 'deal.created', label: 'Deal Created', category: 'Deals' },
  { id: 'deal.updated', label: 'Deal Updated', category: 'Deals' },
  { id: 'deal.won', label: 'Deal Won', category: 'Deals' },
  { id: 'deal.lost', label: 'Deal Lost', category: 'Deals' },
  { id: 'ticket.created', label: 'Ticket Created', category: 'Tickets' },
  { id: 'ticket.updated', label: 'Ticket Updated', category: 'Tickets' },
  { id: 'ticket.resolved', label: 'Ticket Resolved', category: 'Tickets' },
  { id: 'conversation.created', label: 'Conversation Created', category: 'Conversations' },
  { id: 'conversation.message', label: 'New Message', category: 'Conversations' },
  { id: 'user.created', label: 'User Created', category: 'Users' },
  { id: 'user.updated', label: 'User Updated', category: 'Users' },
];

// Group events by category
const groupedEvents = WEBHOOK_EVENTS.reduce((acc, event) => {
  if (!acc[event.category]) {
    acc[event.category] = [];
  }
  acc[event.category].push(event);
  return acc;
}, {} as Record<string, typeof WEBHOOK_EVENTS>);

export default function Webhooks() {
  const { hasPermission } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([]);
  const [newlyCreatedSecret, setNewlyCreatedSecret] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null);

  // Fetch webhooks
  const { data: webhooks, isLoading, isError, refetch } = useWebhooks();

  // Mutations
  const createMutation = useCreateWebhook();
  const deleteMutation = useDeleteWebhook();
  const testMutation = useTestWebhook();

  const canManageWebhooks = hasPermission('settings', 'update');

  const handleCreateWebhook = async () => {
    if (!newWebhookUrl.trim() || newWebhookEvents.length === 0) return;

    try {
      const result = await createMutation.mutateAsync({
        url: newWebhookUrl.trim(),
        events: newWebhookEvents,
        is_active: true,
      });
      setNewlyCreatedSecret(result.secret);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleTestWebhook = async (id: string) => {
    setTestingWebhookId(id);
    try {
      await testMutation.mutateAsync(id);
    } finally {
      setTestingWebhookId(null);
    }
  };

  const handleCopySecret = async () => {
    if (!newlyCreatedSecret) return;
    await navigator.clipboard.writeText(newlyCreatedSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const toggleEvent = (eventId: string) => {
    setNewWebhookEvents(prev => 
      prev.includes(eventId)
        ? prev.filter(e => e !== eventId)
        : [...prev, eventId]
    );
  };

  const selectAllEvents = () => {
    setNewWebhookEvents(WEBHOOK_EVENTS.map(e => e.id));
  };

  const clearAllEvents = () => {
    setNewWebhookEvents([]);
  };

  const resetCreateForm = () => {
    setNewWebhookUrl('');
    setNewWebhookEvents([]);
    setNewlyCreatedSecret(null);
    setCopiedSecret(false);
    setShowSecret(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Webhooks"
          description="Manage webhook endpoints for real-time event notifications"
        />
        <div className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-60" />
                    <Skeleton className="h-4 w-80" />
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div>
        <PageHeader
          title="Webhooks"
          description="Manage webhook endpoints for real-time event notifications"
        />
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load webhooks. Please try again.
            </AlertDescription>
          </Alert>
          <Button onClick={() => refetch()} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Webhooks"
        description="Receive real-time notifications when events happen in your workspace"
        action={canManageWebhooks ? {
          label: 'Add Webhook',
          onClick: () => setIsCreateDialogOpen(true),
          icon: <Plus className="h-4 w-4" />,
        } : undefined}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </PageHeader>

      <div className="p-6 space-y-6">
        {/* Info Card */}
        <Alert>
          <Webhook className="h-4 w-4" />
          <AlertDescription>
            Webhooks allow you to receive HTTP POST requests when specific events occur. 
            Use them to integrate with external services or automate workflows.
          </AlertDescription>
        </Alert>

        {/* Webhooks List */}
        {webhooks && webhooks.length > 0 ? (
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {webhook.url}
                        </code>
                        <Badge variant={webhook.is_active ? 'default' : 'secondary'}>
                          {webhook.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {webhook.events.slice(0, 5).map(event => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                        {webhook.events.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{webhook.events.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {canManageWebhooks && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestWebhook(webhook.id)}
                            disabled={testingWebhookId === webhook.id}
                          >
                            {testingWebhookId === webhook.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                            <span className="ml-2">Test</span>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                disabled={deleteMutation.isPending}
                              >
                                {deleteMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this webhook? 
                                  Your external service will stop receiving notifications immediately.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteWebhook(webhook.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete Webhook
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Webhook className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Webhooks</h3>
              <p className="text-muted-foreground text-center mb-4">
                You haven't configured any webhooks yet. Add one to start receiving event notifications.
              </p>
              {canManageWebhooks && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Webhook
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Webhook Dialog */}
      <Dialog 
        open={isCreateDialogOpen} 
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) resetCreateForm();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Webhook</DialogTitle>
            <DialogDescription>
              Configure a webhook endpoint to receive event notifications.
            </DialogDescription>
          </DialogHeader>

          {newlyCreatedSecret ? (
            <div className="space-y-4">
              <Alert className="bg-success/10 text-success border-success/20">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Your webhook has been created successfully! Copy the signing secret below - you'll need it to verify webhook signatures.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Webhook Signing Secret</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showSecret ? 'text' : 'password'}
                      value={newlyCreatedSecret}
                      readOnly
                      className="pr-10 font-mono"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    onClick={handleCopySecret}
                    variant={copiedSecret ? 'default' : 'outline'}
                  >
                    {copiedSecret ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Store this secret securely. You won't be able to see it again.
                </p>
              </div>

              <DialogFooter>
                <Button
                  onClick={() => {
                    resetCreateForm();
                    setIsCreateDialogOpen(false);
                  }}
                >
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {/* URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Endpoint URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://your-server.com/webhook"
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The URL where webhook events will be sent via HTTP POST.
                  </p>
                </div>

                {/* Events Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Events to Subscribe</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={selectAllEvents}
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearAllEvents}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-4 max-h-60 overflow-y-auto">
                    {Object.entries(groupedEvents).map(([category, events]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Zap className="h-3 w-3" />
                          {category}
                        </h4>
                        <div className="grid gap-2 pl-5">
                          {events.map(event => (
                            <div key={event.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={event.id}
                                checked={newWebhookEvents.includes(event.id)}
                                onCheckedChange={() => toggleEvent(event.id)}
                              />
                              <Label
                                htmlFor={event.id}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {event.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Selected: {newWebhookEvents.length} event{newWebhookEvents.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetCreateForm();
                    setIsCreateDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateWebhook}
                  disabled={!newWebhookUrl.trim() || newWebhookEvents.length === 0 || createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Webhook className="h-4 w-4 mr-2" />
                  )}
                  Create Webhook
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
