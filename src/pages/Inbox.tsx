import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Send, 
  MessageSquare, 
  Mail, 
  Phone,
  MoreHorizontal,
  StickyNote,
  RefreshCw,
  AlertCircle,
  Loader2,
  Check,
  CheckCheck,
  Hash
} from 'lucide-react';
import { 
  useConversations, 
  useConversationMessages,
  useSendMessage,
  useMarkConversationAsRead,
  useResolveConversation,
} from '@/hooks/queries';
import type { Conversation, Message, ConversationChannel, ConversationStatus } from '@/services/conversations';

const channelIcons: Record<ConversationChannel, React.ComponentType<{ className?: string }>> = {
  whatsapp: MessageSquare,
  email: Mail,
  sms: Phone,
  chat: MessageSquare,
  social: Hash,
  phone: Phone,
};

export default function Inbox() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const { 
    data: conversationsData, 
    isLoading: conversationsLoading, 
    isError: conversationsError,
    refetch: refetchConversations,
  } = useConversations({ search: searchQuery || undefined });

  // Get selected conversation
  const conversations = conversationsData?.items || [];
  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null;

  // Fetch messages for selected conversation
  const { 
    data: messagesData, 
    isLoading: messagesLoading,
    isError: messagesError,
  } = useConversationMessages(selectedConversationId || '');

  const messages = messagesData?.items || [];

  // Mutations
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkConversationAsRead();
  const resolveMutation = useResolveConversation();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark as read when selecting a conversation
  useEffect(() => {
    if (selectedConversationId && selectedConversation?.unread_count > 0) {
      markAsReadMutation.mutate(selectedConversationId);
    }
  }, [selectedConversationId]);

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversationId) return;

    await sendMessageMutation.mutateAsync({
      conversationId: selectedConversationId,
      data: { content: messageInput.trim() },
    });

    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStatusIcon = (message: Message) => {
    switch (message.status) {
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Conversation List */}
      <div className="w-80 flex-shrink-0 border-r border-border bg-background">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold">Inbox</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetchConversations()}
              disabled={conversationsLoading}
            >
              <RefreshCw className={`h-4 w-4 ${conversationsLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Error State */}
        {conversationsError && (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to load conversations</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Loading State */}
        {conversationsLoading && (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Conversation List */}
        {!conversationsLoading && !conversationsError && (
          <div className="overflow-y-auto scrollbar-thin">
            {conversations.map((conversation) => {
              const ChannelIcon = channelIcons[conversation.channel_type] || MessageSquare;
              const isSelected = selectedConversationId === conversation.id;

              return (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  className={cn(
                    'flex cursor-pointer gap-3 border-b border-border p-4 transition-colors',
                    isSelected ? 'bg-secondary' : 'hover:bg-secondary/50'
                  )}
                >
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(conversation.contact_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm truncate">
                        {conversation.contact_name || conversation.contact_email || 'Unknown'}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatTime(conversation.last_message_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <ChannelIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.last_message || 'No messages yet'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge variant={getStatusVariant(conversation.status as ConversationStatus)}>
                        {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
                      </StatusBadge>
                      {conversation.unread_count > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground px-1.5">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {conversations.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Thread */}
      <div className="flex flex-1 flex-col">
        {selectedConversation ? (
          <>
            {/* Thread Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(selectedConversation.contact_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">
                    {selectedConversation.contact_name || selectedConversation.contact_email || 'Unknown'}
                  </h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    via {selectedConversation.channel_type.replace('_', ' ')}
                    {selectedConversation.assignee_name && (
                      <span> · Assigned to {selectedConversation.assignee_name}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedConversation.status === 'open' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => resolveMutation.mutate(selectedConversation.id)}
                    disabled={resolveMutation.isPending}
                  >
                    {resolveMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Resolve'
                    )}
                  </Button>
                )}
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
              {messagesLoading && (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={cn('flex gap-3', i % 2 === 0 && 'flex-row-reverse')}>
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-16 w-64 rounded-lg" />
                    </div>
                  ))}
                </div>
              )}

              {messagesError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Failed to load messages</AlertDescription>
                </Alert>
              )}

              {!messagesLoading && !messagesError && messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.direction === 'outbound' && 'flex-row-reverse'
                  )}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={cn(
                      'text-xs',
                      message.direction === 'outbound' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    )}>
                      {getInitials(message.sender_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    'max-w-md space-y-1',
                    message.direction === 'outbound' && 'items-end'
                  )}>
                    <div className={cn(
                      'rounded-lg px-4 py-2',
                      message.type === 'system'
                        ? 'bg-warning/10 border border-warning/20' 
                        : message.direction === 'outbound'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    )}>
                      {message.type === 'system' && (
                        <div className="flex items-center gap-1 text-warning text-xs font-medium mb-1">
                          <StickyNote className="h-3 w-3" />
                          Internal Note
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className={cn(
                      'flex items-center gap-1 text-xs text-muted-foreground',
                      message.direction === 'outbound' && 'justify-end'
                    )}>
                      <span>{message.sender_name} · {formatTime(message.created_at)}</span>
                      {message.direction === 'outbound' && getMessageStatusIcon(message)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={sendMessageMutation.isPending}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sendMessageMutation.isPending}
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a conversation to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
