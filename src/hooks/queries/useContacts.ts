import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '@/services/contacts';
import type {
  Contact,
  CreateContactRequest,
  UpdateContactRequest,
  ContactListParams,
} from '@/services/contacts';
import { apiHelpers } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const contactKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: (params?: ContactListParams) => [...contactKeys.lists(), params] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
  activity: (id: string) => [...contactKeys.detail(id), 'activity'] as const,
};

/**
 * Hook to fetch paginated contacts
 */
export function useContacts(params?: ContactListParams) {
  return useQuery({
    queryKey: contactKeys.list(params),
    queryFn: () => contactService.getAll(params),
  });
}

/**
 * Hook to fetch a single contact
 */
export function useContact(id: string) {
  return useQuery({
    queryKey: contactKeys.detail(id),
    queryFn: () => contactService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new contact
 */
export function useCreateContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateContactRequest) => contactService.create(data),
    onSuccess: (newContact) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      toast({
        title: 'Contact created',
        description: `${newContact.first_name} ${newContact.last_name || ''} has been created.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating contact',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update a contact
 */
export function useUpdateContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactRequest }) =>
      contactService.update(id, data),
    onSuccess: (updatedContact) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.detail(updatedContact.id) });
      toast({
        title: 'Contact updated',
        description: `${updatedContact.first_name} ${updatedContact.last_name || ''} has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating contact',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete a contact
 */
export function useDeleteContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => contactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      toast({
        title: 'Contact deleted',
        description: 'The contact has been deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting contact',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to archive a contact
 */
export function useArchiveContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => contactService.archive(id),
    onSuccess: (contact) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.detail(contact.id) });
      toast({
        title: 'Contact archived',
        description: `${contact.first_name} ${contact.last_name || ''} has been archived.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error archiving contact',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to restore an archived contact
 */
export function useRestoreContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => contactService.restore(id),
    onSuccess: (contact) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.detail(contact.id) });
      toast({
        title: 'Contact restored',
        description: `${contact.first_name} ${contact.last_name || ''} has been restored.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error restoring contact',
        description: apiHelpers.getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
}
