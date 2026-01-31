import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '@/services/tickets';
import type {
  Ticket,
  CreateTicketRequest,
  UpdateTicketRequest,
  AddCommentRequest,
  TicketListParams,
  TicketStatus,
} from '@/services/tickets';
import { apiHelpers } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (params?: TicketListParams) => [...ticketKeys.lists(), params] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
  comments: (id: string) => [...ticketKeys.detail(id), 'comments'] as const,
  stats: (params?: { assignee_id?: string; team_id?: string }) => 
    [...ticketKeys.all, 'stats', params] as const,
  activity: (id: string) => [...ticketKeys.detail(id), 'activity'] as const,
};

/**
 * Hook to fetch paginated tickets
 */
export function useTickets(params?: TicketListParams) {
  return useQuery({
    queryKey: ticketKeys.list(params),
    queryFn: () => ticketService.getAll(params),
  });
}

/**
 * Hook to fetch a single ticket
 */
export function useTicket(id: string) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => ticketService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch ticket comments
 */
export function useTicketComments(id: string) {
  return useQuery({
    queryKey: ticketKeys.comments(id),
    queryFn: () => ticketService.getComments(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch ticket statistics
 */
export function useTicketStats(params?: { assignee_id?: string; team_id?: string }) {
  return useQuery({
    queryKey: ticketKeys.stats(params),
    queryFn: () => ticketService.getStats(params),
  });
}

/**
 * Hook to create a new ticket
 */
export function useCreateTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateTicketRequest) => ticketService.create(data),
    onSuccess: (newTicket) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
      toast({
        title: 'Ticket created',
        description: `Ticket #${newTicket.ticket_number} has been created.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating ticket',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update a ticket
 */
export function useUpdateTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketRequest }) =>
      ticketService.update(id, data),
    onSuccess: (updatedTicket) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(updatedTicket.id) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
      toast({
        title: 'Ticket updated',
        description: `Ticket #${updatedTicket.ticket_number} has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating ticket',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete a ticket
 */
export function useDeleteTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => ticketService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
      toast({
        title: 'Ticket deleted',
        description: 'The ticket has been deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting ticket',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update ticket status
 */
export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      ticketService.updateStatus(id, status),
    onSuccess: (updatedTicket) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(updatedTicket.id) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
      toast({
        title: 'Status updated',
        description: `Ticket #${updatedTicket.ticket_number} is now ${updatedTicket.status.replace('_', ' ')}.`,
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
 * Hook to assign ticket
 */
export function useAssignTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, assigneeId }: { id: string; assigneeId: string }) =>
      ticketService.assign(id, assigneeId),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticket.id) });
      toast({
        title: 'Ticket assigned',
        description: `Ticket #${ticket.ticket_number} has been assigned.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error assigning ticket',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to add comment to ticket
 */
export function useAddTicketComment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddCommentRequest }) =>
      ticketService.addComment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.comments(variables.id) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(variables.id) });
      toast({
        title: 'Comment added',
        description: 'Your comment has been added to the ticket.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error adding comment',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to resolve ticket
 */
export function useResolveTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => ticketService.resolve(id),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticket.id) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
      toast({
        title: 'Ticket resolved',
        description: `Ticket #${ticket.ticket_number} has been resolved.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error resolving ticket',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to close ticket
 */
export function useCloseTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => ticketService.close(id),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticket.id) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
      toast({
        title: 'Ticket closed',
        description: `Ticket #${ticket.ticket_number} has been closed.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error closing ticket',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to reopen ticket
 */
export function useReopenTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => ticketService.reopen(id),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticket.id) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
      toast({
        title: 'Ticket reopened',
        description: `Ticket #${ticket.ticket_number} has been reopened.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error reopening ticket',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}
