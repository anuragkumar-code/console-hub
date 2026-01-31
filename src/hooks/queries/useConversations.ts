import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { conversationService } from '@/services/conversations';
import type {
  Conversation,
  Message,
  CreateConversationRequest,
  UpdateConversationRequest,
  SendMessageRequest,
  ConversationListParams,
  ConversationStatus,
} from '@/services/conversations';
import { apiHelpers } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: (params?: ConversationListParams) => [...conversationKeys.lists(), params] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
  messages: (id: string) => [...conversationKeys.detail(id), 'messages'] as const,
  stats: (params?: { assignee_id?: string; team_id?: string }) => 
    [...conversationKeys.all, 'stats', params] as const,
};

/**
 * Hook to fetch paginated conversations
 */
export function useConversations(params?: ConversationListParams) {
  return useQuery({
    queryKey: conversationKeys.list(params),
    queryFn: () => conversationService.getAll(params),
  });
}

/**
 * Hook to fetch a single conversation
 */
export function useConversation(id: string) {
  return useQuery({
    queryKey: conversationKeys.detail(id),
    queryFn: () => conversationService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch messages for a conversation with infinite scroll
 */
export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn: () => conversationService.getMessages(conversationId),
    enabled: !!conversationId,
  });
}

/**
 * Hook to fetch conversation statistics
 */
export function useConversationStats(params?: { assignee_id?: string; team_id?: string }) {
  return useQuery({
    queryKey: conversationKeys.stats(params),
    queryFn: () => conversationService.getStats(params),
  });
}

/**
 * Hook to create a new conversation
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateConversationRequest) => conversationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: conversationKeys.stats() });
      toast({
        title: 'Conversation created',
        description: 'New conversation has been started.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating conversation',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update a conversation
 */
export function useUpdateConversation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConversationRequest }) =>
      conversationService.update(id, data),
    onSuccess: (updatedConversation) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(updatedConversation.id) });
      toast({
        title: 'Conversation updated',
        description: 'Conversation has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating conversation',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update conversation status
 */
export function useUpdateConversationStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ConversationStatus }) =>
      conversationService.updateStatus(id, status),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(conversation.id) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.stats() });
      toast({
        title: 'Status updated',
        description: `Conversation marked as ${conversation.status}.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating status',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to assign conversation
 */
export function useAssignConversation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, assigneeId }: { id: string; assigneeId: string | null }) =>
      conversationService.assign(id, assigneeId),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(conversation.id) });
      toast({
        title: 'Conversation assigned',
        description: conversation.assignee_name 
          ? `Assigned to ${conversation.assignee_name}.`
          : 'Conversation unassigned.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error assigning conversation',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to resolve conversation
 */
export function useResolveConversation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => conversationService.resolve(id),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(conversation.id) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.stats() });
      toast({
        title: 'Conversation resolved',
        description: 'Conversation has been marked as resolved.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error resolving conversation',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to close conversation
 */
export function useCloseConversation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => conversationService.close(id),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(conversation.id) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.stats() });
      toast({
        title: 'Conversation closed',
        description: 'Conversation has been closed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error closing conversation',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to mark conversation as read
 */
export function useMarkConversationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => conversationService.markAsRead(id),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(conversation.id) });
    },
  });
}

/**
 * Hook to send a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ conversationId, data }: { conversationId: string; data: SendMessageRequest }) =>
      conversationService.sendMessage(conversationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.messages(variables.conversationId) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(variables.conversationId) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
    onError: (error) => {
      toast({
        title: 'Error sending message',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}
