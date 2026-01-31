import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { channelService } from '@/services/channels';
import type {
  Channel,
  CreateChannelRequest,
  UpdateChannelRequest,
  ChannelListParams,
} from '@/services/channels';
import { apiHelpers } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const channelKeys = {
  all: ['channels'] as const,
  lists: () => [...channelKeys.all, 'list'] as const,
  list: (params?: ChannelListParams) => [...channelKeys.lists(), params] as const,
  details: () => [...channelKeys.all, 'detail'] as const,
  detail: (id: string) => [...channelKeys.details(), id] as const,
  stats: (id: string) => [...channelKeys.detail(id), 'stats'] as const,
};

/**
 * Hook to fetch paginated channels
 */
export function useChannels(params?: ChannelListParams) {
  return useQuery({
    queryKey: channelKeys.list(params),
    queryFn: () => channelService.getAll(params),
  });
}

/**
 * Hook to fetch a single channel
 */
export function useChannel(id: string) {
  return useQuery({
    queryKey: channelKeys.detail(id),
    queryFn: () => channelService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch channel statistics
 */
export function useChannelStats(id: string) {
  return useQuery({
    queryKey: channelKeys.stats(id),
    queryFn: () => channelService.getStats(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new channel
 */
export function useCreateChannel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateChannelRequest) => channelService.create(data),
    onSuccess: (newChannel) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
      toast({
        title: 'Channel created',
        description: `${newChannel.name} has been created.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating channel',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update a channel
 */
export function useUpdateChannel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChannelRequest }) =>
      channelService.update(id, data),
    onSuccess: (updatedChannel) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(updatedChannel.id) });
      toast({
        title: 'Channel updated',
        description: `${updatedChannel.name} has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating channel',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete a channel
 */
export function useDeleteChannel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => channelService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
      toast({
        title: 'Channel deleted',
        description: 'The channel has been deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting channel',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to activate a channel
 */
export function useActivateChannel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => channelService.activate(id),
    onSuccess: (channel) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channel.id) });
      toast({
        title: 'Channel activated',
        description: `${channel.name} has been activated.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error activating channel',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to deactivate a channel
 */
export function useDeactivateChannel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => channelService.deactivate(id),
    onSuccess: (channel) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channel.id) });
      toast({
        title: 'Channel deactivated',
        description: `${channel.name} has been deactivated.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deactivating channel',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to test channel connection
 */
export function useTestChannelConnection() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => channelService.testConnection(id),
    onSuccess: (result) => {
      toast({
        title: result.success ? 'Connection successful' : 'Connection failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error testing connection',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to set channel as default
 */
export function useSetDefaultChannel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => channelService.setAsDefault(id),
    onSuccess: (channel) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channel.id) });
      toast({
        title: 'Default channel set',
        description: `${channel.name} is now the default channel.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error setting default channel',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}
