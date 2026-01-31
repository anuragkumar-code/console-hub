import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { removeTokens, setTokens } from '@/utils/auth';

// Test component that uses the auth context
function TestComponent() {
  const { user, isAuthenticated, isLoading, login, logout, hasPermission, isGodAdmin } = useAuth();

  const handleLogin = async () => {
    try {
      await login('admin@acme.com', 'password123');
    } catch (e) {
      // Error is handled by context
    }
  };

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="user-email">{user?.email || 'No User'}</div>
      <div data-testid="is-god-admin">{isGodAdmin ? 'Yes' : 'No'}</div>
      <div data-testid="can-view-users">{hasPermission('users', 'view') ? 'Yes' : 'No'}</div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// Wrapper with necessary providers
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  };
}

describe('AuthContext', () => {
  beforeEach(() => {
    removeTokens();
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should start as not authenticated when no token exists', async () => {
      render(<TestComponent />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('Not Loading');
      });

      expect(screen.getByTestId('authenticated').textContent).toBe('Not Authenticated');
      expect(screen.getByTestId('user-email').textContent).toBe('No User');
    });
  });

  describe('Login flow', () => {
    it('should authenticate user on successful login', async () => {
      const user = userEvent.setup();
      render(<TestComponent />, { wrapper: createWrapper() });

      // Wait for initial state
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('Not Loading');
      });

      // Click login button
      await user.click(screen.getByRole('button', { name: /login/i }));

      // Wait for authentication
      await waitFor(() => {
        expect(screen.getByTestId('authenticated').textContent).toBe('Authenticated');
      }, { timeout: 5000 });

      // Check user data
      expect(screen.getByTestId('user-email').textContent).toBe('admin@acme.com');
    });
  });

  describe('Logout flow', () => {
    it('should clear user on logout', async () => {
      const user = userEvent.setup();
      render(<TestComponent />, { wrapper: createWrapper() });

      // Login first
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('Not Loading');
      });

      await user.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByTestId('authenticated').textContent).toBe('Authenticated');
      }, { timeout: 5000 });

      // Now logout
      await user.click(screen.getByRole('button', { name: /logout/i }));

      await waitFor(() => {
        expect(screen.getByTestId('authenticated').textContent).toBe('Not Authenticated');
      });

      expect(screen.getByTestId('user-email').textContent).toBe('No User');
    });
  });
});

describe('useAuth hook', () => {
  it('should throw error when used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});
