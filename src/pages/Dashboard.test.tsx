import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import Dashboard from './Dashboard';
import { setTokens, removeTokens } from '@/utils/auth';

// Mock useAuth to control user state
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
        role: { slug: 'org_admin', name: 'Organization Admin' },
      },
      isAuthenticated: true,
      isLoading: false,
      isGodAdmin: false,
      hasPermission: () => true,
      setUserRole: vi.fn(),
    })),
  };
});

describe('Dashboard Page', () => {
  beforeEach(() => {
    setTokens('mock-access-token', 'mock-refresh-token');
  });

  afterEach(() => {
    removeTokens();
    vi.clearAllMocks();
  });

  describe('Organization Dashboard (non-God Admin)', () => {
    it('should render dashboard heading', async () => {
      render(<Dashboard />);

      // Look for dashboard-related heading
      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
      });
    });

    it('should show welcome message with user name', async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });
    });

    it('should render stat cards', async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText(/total contacts/i)).toBeInTheDocument();
        expect(screen.getByText(/active accounts/i)).toBeInTheDocument();
        expect(screen.getByText(/open tickets/i)).toBeInTheDocument();
        expect(screen.getByText(/pipeline value/i)).toBeInTheDocument();
      });
    });

    it('should render pipeline overview section', async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText(/pipeline overview/i)).toBeInTheDocument();
      });
    });

    it('should render recent activity section', async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
      });
    });
  });
});
