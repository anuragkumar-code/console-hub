import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import { removeTokens } from '@/utils/auth';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Page', () => {
  beforeEach(() => {
    removeTokens();
    mockNavigate.mockClear();
  });

  describe('Rendering', () => {
    it('should render login form elements', () => {
      render(<Login />);

      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render forgot password link', () => {
      render(<Login />);

      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });

    it('should render remember me checkbox', () => {
      render(<Login />);

      expect(screen.getByText(/remember me/i)).toBeInTheDocument();
    });
  });

  describe('Form interactions', () => {
    it('should allow typing in email and password fields', async () => {
      const user = userEvent.setup();
      render(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, 'admin@acme.com');
      await user.type(passwordInput, 'password123');

      expect(emailInput).toHaveValue('admin@acme.com');
      expect(passwordInput).toHaveValue('password123');
    });
  });

  describe('Navigation', () => {
    it('should have link to forgot password page', () => {
      render(<Login />);

      const forgotPasswordLink = screen.getByText(/forgot password/i);
      expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
    });

    it('should have link to register page', () => {
      render(<Login />);

      const registerLink = screen.getByText(/contact your admin/i);
      expect(registerLink).toHaveAttribute('href', '/register');
    });
  });
});
