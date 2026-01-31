// API Client
export { default as api, storage, apiHelpers } from './api';
export type { ApiResponse, ApiError } from './api';

// Auth Service
export { authService } from './auth';
export type {
  ApiPermission,
  ApiRole,
  ApiUser,
  LoginRequest,
  LoginResponseData,
  StoredAuthUser,
} from './auth';

// Organization Service
export { organizationService } from './organizations';
export type {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationListParams,
  OrganizationStats,
  OrganizationSettings,
  PlanType,
  OrganizationStatus,
} from './organizations';

// User Service
export { userService } from './users';
export type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserListParams,
  UserStatus,
  UserPreferences,
} from './users';

// Role & Permission Service
export { roleService, permissionService } from './roles';
export type {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
  RoleListParams,
  PermissionListParams,
  GroupedPermissions,
} from './roles';

// Contact Service
export { contactService } from './contacts';
export type {
  Contact,
  CreateContactRequest,
  UpdateContactRequest,
  ContactListParams,
  ContactStatus,
  ContactSource,
  ContactCustomFields,
} from './contacts';

// Account Service
export { accountService } from './accounts';
export type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  AccountListParams,
  AccountStatus,
  AccountType,
  AccountIndustry,
  AccountCustomFields,
} from './accounts';

// Deal Service
export { dealService } from './deals';
export type {
  Deal,
  CreateDealRequest,
  UpdateDealRequest,
  DealListParams,
  DealStats,
  DealStage,
  DealPriority,
  DealCustomFields,
  Pipeline,
  PipelineStage,
} from './deals';

// Ticket Service
export { ticketService } from './tickets';
export type {
  Ticket,
  TicketComment,
  CreateTicketRequest,
  UpdateTicketRequest,
  AddCommentRequest,
  TicketListParams,
  TicketStats,
  TicketStatus,
  TicketPriority,
  TicketType,
  TicketChannel,
  TicketSLA,
  TicketCustomFields,
} from './tickets';

// Conversation Service
export { conversationService } from './conversations';
export type {
  Conversation,
  Message,
  CreateConversationRequest,
  UpdateConversationRequest,
  SendMessageRequest,
  ConversationListParams,
  MessageListParams,
  ConversationStats,
  ConversationStatus,
  ConversationChannel,
  MessageDirection,
  MessageStatus,
  MessageType,
  MessageAttachment,
  ConversationParticipant,
} from './conversations';

// Team Service
export { teamService } from './teams';
export type {
  Team,
  TeamMember,
  CreateTeamRequest,
  UpdateTeamRequest,
  TeamMemberRequest,
  TeamListParams,
  TeamStats,
  TeamStatus,
} from './teams';

// Channel Service
export { channelService } from './channels';
export type {
  Channel,
  CreateChannelRequest,
  UpdateChannelRequest,
  ChannelListParams,
  ChannelStats,
  ChannelType,
  ChannelStatus,
  ChannelConfig,
} from './channels';

// Dashboard Service
export { dashboardService } from './dashboard';
export type {
  PlatformStats,
  OrganizationDashboardStats,
  DashboardChartData,
  ActivityItem,
  DashboardOverview,
  PlatformOverview,
  DashboardParams,
  TimeSeriesPoint,
} from './dashboard';

// Audit Service
export { auditService } from './audit';
export type {
  AuditLog,
  AuditLogListParams,
  AuditLogStats,
  AuditAction,
  AuditResource,
} from './audit';

// Settings Service
export { settingsService } from './settings';
export type {
  OrganizationSettings as OrgSettings,
  GeneralSettings,
  NotificationSettings,
  SecuritySettings,
  BrandingSettings,
  IntegrationSettings,
  UserProfileSettings,
  UpdateSettingsRequest,
  UpdateProfileRequest,
  CreateApiKeyRequest,
  ApiKeyResponse,
  WebhookRequest,
} from './settings';

// Common types
export type { PaginatedResponse } from './organizations/types';
