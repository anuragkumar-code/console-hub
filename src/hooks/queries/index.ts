// Organization hooks
export {
  useOrganizations,
  useOrganization,
  useOrganizationStats,
  useCreateOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
  useSuspendOrganization,
  useActivateOrganization,
  organizationKeys,
} from './useOrganizations';

// User hooks
export {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useDeactivateUser,
  useActivateUser,
  useResendInvite,
  userKeys,
} from './useUsers';

// Role hooks
export {
  useRoles,
  useRole,
  useRolePermissions,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useAssignPermissions,
  roleKeys,
} from './useRoles';

// Permission hooks
export {
  usePermissions,
  useGroupedPermissions,
  usePermission,
  permissionKeys,
} from './useRoles';

// Contact hooks
export {
  useContacts,
  useContact,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useArchiveContact,
  useRestoreContact,
  contactKeys,
} from './useContacts';

// Account hooks
export {
  useAccounts,
  useAccount,
  useAccountContacts,
  useAccountDeals,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
  useMergeAccounts,
  accountKeys,
} from './useAccounts';

// Deal hooks
export {
  useDeals,
  useDeal,
  useDealStats,
  usePipelines,
  useCreateDeal,
  useUpdateDeal,
  useDeleteDeal,
  useUpdateDealStage,
  useMarkDealAsWon,
  useMarkDealAsLost,
  dealKeys,
} from './useDeals';

// Ticket hooks
export {
  useTickets,
  useTicket,
  useTicketComments,
  useTicketStats,
  useCreateTicket,
  useUpdateTicket,
  useDeleteTicket,
  useUpdateTicketStatus,
  useAssignTicket,
  useAddTicketComment,
  useResolveTicket,
  useCloseTicket,
  useReopenTicket,
  ticketKeys,
} from './useTickets';

// Conversation hooks
export {
  useConversations,
  useConversation,
  useConversationMessages,
  useConversationStats,
  useCreateConversation,
  useUpdateConversation,
  useUpdateConversationStatus,
  useAssignConversation,
  useResolveConversation,
  useCloseConversation,
  useMarkConversationAsRead,
  useSendMessage,
  conversationKeys,
} from './useConversations';

// Team hooks
export {
  useTeams,
  useTeam,
  useTeamMembers,
  useTeamStats,
  useCreateTeam,
  useUpdateTeam,
  useDeleteTeam,
  useAddTeamMember,
  useRemoveTeamMember,
  useActivateTeam,
  useDeactivateTeam,
  teamKeys,
} from './useTeams';

// Channel hooks
export {
  useChannels,
  useChannel,
  useChannelStats,
  useCreateChannel,
  useUpdateChannel,
  useDeleteChannel,
  useActivateChannel,
  useDeactivateChannel,
  useTestChannelConnection,
  useSetDefaultChannel,
  channelKeys,
} from './useChannels';

// Dashboard hooks
export {
  usePlatformOverview,
  usePlatformStats,
  useOrganizationOverview,
  useOrganizationStats as useDashboardOrgStats,
  useDashboardCharts,
  useRecentActivity,
  dashboardKeys,
} from './useDashboard';

// Audit log hooks
export {
  useAuditLogs,
  useAuditLog,
  useAuditLogStats,
  useAuditLogsByResource,
  useAuditLogsByUser,
  useExportAuditLogs,
  auditLogKeys,
} from './useAuditLogs';

// Settings hooks
export {
  useOrganizationSettings,
  useUpdateOrganizationSettings,
  useGeneralSettings,
  useUpdateGeneralSettings,
  useNotificationSettings,
  useUpdateNotificationSettings,
  useSecuritySettings,
  useUpdateSecuritySettings,
  useProfile,
  useUpdateProfile,
  useChangePassword,
  useUploadAvatar,
  useApiKeys,
  useCreateApiKey,
  useDeleteApiKey,
  useWebhooks,
  useCreateWebhook,
  useDeleteWebhook,
  useTestWebhook,
  settingsKeys,
} from './useSettings';
