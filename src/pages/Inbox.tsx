import { useState } from 'react';
import { conversations, messages } from '@/data/mockData';
import { Conversation, Message } from '@/types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { 
  Search, 
  Send, 
  MessageSquare, 
  Mail, 
  Phone,
  MoreHorizontal,
  StickyNote
} from 'lucide-react';

const channelIcons = {
  whatsapp: MessageSquare,
  email: Mail,
  web_chat: MessageSquare,
};

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations[1] // Select Michael Chen's conversation by default
  );
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => 
    name.split(' ').map(n => n[0]).join('').toUpperCase();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Conversation List */}
      <div className="w-80 flex-shrink-0 border-r border-border bg-background">
        <div className="border-b border-border p-4">
          <h1 className="text-lg font-semibold mb-3">Inbox</h1>
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

        <div className="overflow-y-auto scrollbar-thin">
          {filteredConversations.map((conversation) => {
            const ChannelIcon = channelIcons[conversation.channel];
            const isSelected = selectedConversation?.id === conversation.id;

            return (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={cn(
                  'flex cursor-pointer gap-3 border-b border-border p-4 transition-colors',
                  isSelected ? 'bg-secondary' : 'hover:bg-secondary/50'
                )}
              >
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(conversation.contactName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">
                      {conversation.contactName}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatTime(conversation.lastMessageAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <ChannelIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge variant={getStatusVariant(conversation.status)}>
                      {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
                    </StatusBadge>
                    {conversation.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground px-1.5">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
                    {getInitials(selectedConversation.contactName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{selectedConversation.contactName}</h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    via {selectedConversation.channel.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.sender === 'agent' && 'flex-row-reverse'
                  )}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={cn(
                      'text-xs',
                      message.sender === 'agent' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    )}>
                      {getInitials(message.senderName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    'max-w-md space-y-1',
                    message.sender === 'agent' && 'items-end'
                  )}>
                    <div className={cn(
                      'rounded-lg px-4 py-2',
                      message.isInternalNote 
                        ? 'bg-warning/10 border border-warning/20' 
                        : message.sender === 'agent'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    )}>
                      {message.isInternalNote && (
                        <div className="flex items-center gap-1 text-warning text-xs font-medium mb-1">
                          <StickyNote className="h-3 w-3" />
                          Internal Note
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className={cn(
                      'text-xs text-muted-foreground',
                      message.sender === 'agent' && 'text-right'
                    )}>
                      {message.senderName} · {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1"
                />
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send
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
