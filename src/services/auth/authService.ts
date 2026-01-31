import api, { ApiResponse, storage, apiHelpers } from '@/services/api';
import type {
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponseData,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  OtpLoginRequest,
  OtpVerifyRequest,
  ProfileResponseData,
  StoredAuthUser,
  ApiUser,
} from './types';

// ============================================
// Helper Functions
// ============================================

/**
 * Check if user is god admin based on role slug
 * God admin slugs: 'god_admin', 'super_admin', 'platform_admin'
 */
const isGodAdminRole = (roleSlug: string): boolean => {
  const godAdminSlugs = ['god_admin', 'super_admin', 'platform_admin'];
  return godAdminSlugs.includes(roleSlug.toLowerCase());
};

/**
 * Transform API user to stored auth user with computed fields
 */
const transformApiUserToStoredUser = (apiUser: ApiUser): StoredAuthUser => {
  return {
    ...apiUser,
    isGodAdmin: isGodAdminRole(apiUser.role.slug),
  };
};

// ============================================
// Auth Service
// ============================================

export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginRequest): Promise<StoredAuthUser> => {
    const response = await api.post<ApiResponse<LoginResponseData>>(
      '/auth/login',
      credentials
    );

    const { user, token, refreshToken } = response.data.data;

    // Transform user with computed fields
    const storedUser = transformApiUserToStoredUser(user);

    // Store auth data
    storage.setAccessToken(token);
    if (refreshToken) {
      storage.setRefreshToken(refreshToken);
    }
    storage.setUser(storedUser);

    return storedUser;
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      '/auth/register',
      data
    );
    return response.data.data;
  },

  /**
   * Logout - clear tokens and notify server
   */
  logout: async (): Promise<void> => {
    try {
      // Notify server (optional - may fail if token already expired)
      await api.post('/auth/logout');
    } catch {
      // Ignore errors - we're logging out anyway
    } finally {
      storage.clearAuth();
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<string> => {
    const currentRefreshToken = storage.getRefreshToken();
    if (!currentRefreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<ApiResponse<RefreshTokenResponseData>>(
      '/auth/refresh-token',
      { refreshToken: currentRefreshToken } as RefreshTokenRequest
    );

    const { token, refreshToken: newRefreshToken } = response.data.data;

    storage.setAccessToken(token);
    if (newRefreshToken) {
      storage.setRefreshToken(newRefreshToken);
    }

    return token;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<StoredAuthUser> => {
    const response = await api.get<ApiResponse<ProfileResponseData>>(
      '/auth/profile'
    );

    const storedUser = transformApiUserToStoredUser(response.data.data.user);
    storage.setUser(storedUser);

    return storedUser;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      '/auth/forgot-password',
      data
    );
    return response.data.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      '/auth/reset-password',
      data
    );
    return response.data.data;
  },

  /**
   * Request OTP for login
   */
  requestOtp: async (data: OtpLoginRequest): Promise<{ message: string }> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      '/auth/login/otp/request',
      data
    );
    return response.data.data;
  },

  /**
   * Verify OTP and login
   */
  verifyOtp: async (data: OtpVerifyRequest): Promise<StoredAuthUser> => {
    const response = await api.post<ApiResponse<LoginResponseData>>(
      '/auth/login/otp/verify',
      data
    );

    const { user, token, refreshToken } = response.data.data;
    const storedUser = transformApiUserToStoredUser(user);

    storage.setAccessToken(token);
    if (refreshToken) {
      storage.setRefreshToken(refreshToken);
    }
    storage.setUser(storedUser);

    return storedUser;
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser: (): StoredAuthUser | null => {
    return storage.getUser<StoredAuthUser>();
  },

  /**
   * Check if user is authenticated (has valid token in storage)
   */
  isAuthenticated: (): boolean => {
    return storage.isAuthenticated();
  },

  /**
   * Clear all auth data
   */
  clearAuth: (): void => {
    storage.clearAuth();
  },
};

// Export helpers for use in components
export { apiHelpers };

export default authService;
