import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './stat-card';
import { Users } from 'lucide-react';

describe('StatCard Component', () => {
  it('should render title and value', () => {
    render(
      <StatCard
        title="Total Users"
        value="1,234"
        icon={<Users data-testid="icon" />}
      />
    );

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('should render icon', () => {
    render(
      <StatCard
        title="Total Users"
        value="1,234"
        icon={<Users data-testid="icon" />}
      />
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should render positive change indicator', () => {
    render(
      <StatCard
        title="Total Users"
        value="1,234"
        change={{ value: '12%', positive: true }}
        icon={<Users />}
      />
    );

    // The component adds + prefix for positive changes, so we look for +12%
    expect(screen.getByText(/\+12%/)).toBeInTheDocument();
  });

  it('should render negative change indicator', () => {
    render(
      <StatCard
        title="Total Users"
        value="1,234"
        change={{ value: '-5%', positive: false }}
        icon={<Users />}
      />
    );

    expect(screen.getByText('-5%')).toBeInTheDocument();
  });

  it('should render without change indicator', () => {
    render(
      <StatCard
        title="Active Channels"
        value="18"
        icon={<Users />}
      />
    );

    expect(screen.getByText('Active Channels')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
  });

  it('should format large numbers', () => {
    render(
      <StatCard
        title="Revenue"
        value="$1,234,567"
        icon={<Users />}
      />
    );

    expect(screen.getByText('$1,234,567')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <StatCard
        title="Test"
        value="123"
        className="custom-class"
        icon={<Users />}
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
