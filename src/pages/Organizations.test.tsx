import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import Organizations from './Organizations';
import { setTokens, removeTokens } from '@/utils/auth';

// Mock useAuth
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(() => ({
      user: {
        id: 'user-1',
        email: 'admin@acme.com',
        firstName: 'John',
        lastName: 'Doe',
        role: { slug: 'god_admin', name: 'God Admin' },
      },
      isAuthenticated: true,
      isLoading: false,
      isGodAdmin: true,
      hasPermission: () => true,
    })),
  };
});

describe('Organizations Page', () => {
  beforeEach(() => {
    setTokens('mock-access-token', 'mock-refresh-token');
  });

  afterEach(() => {
    removeTokens();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render search input', async () => {
      render(<Organizations />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
      });
    });

    it('should render add organization button', async () => {
      render(<Organizations />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add organization/i })).toBeInTheDocument();
      });
    });

    it('should render organizations list after loading', async () => {
      render(<Organizations />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Acme Corp')).toBeInTheDocument();
      }, { timeout: 5000 });

      // Check that other organization is also present
      expect(screen.getByText('Tech Startup')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should open create organization form when clicking add button', async () => {
      const user = userEvent.setup();
      render(<Organizations />);

      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add organization/i })).toBeInTheDocument();
      });

      // Click add button
      const addButton = screen.getByRole('button', { name: /add organization/i });
      await user.click(addButton);

      // Form should appear (check for form title or input)
      await waitFor(() => {
        expect(screen.getByText(/create organization/i)).toBeInTheDocument();
      });
    });
  });
});
