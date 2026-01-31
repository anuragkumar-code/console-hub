import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useOrganizations, useOrganization } from './useOrganizations';
import { QueryClientWrapper } from '@/test/utils';
import { setTokens, removeTokens } from '@/utils/auth';

describe('useOrganizations', () => {
  beforeEach(() => {
    setTokens('mock-access-token', 'mock-refresh-token');
  });

  afterEach(() => {
    removeTokens();
  });

  describe('useOrganizations hook', () => {
    it('should fetch organizations list', async () => {
      const { result } = renderHook(() => useOrganizations(), {
        wrapper: QueryClientWrapper,
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      // Wait for data
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check data
      expect(result.current.data).toBeDefined();
      expect(result.current.data?.items).toBeInstanceOf(Array);
      expect(result.current.data?.items.length).toBeGreaterThan(0);
    });

    it('should return organizations with correct structure', async () => {
      const { result } = renderHook(() => useOrganizations(), {
        wrapper: QueryClientWrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const firstOrg = result.current.data?.items[0];
      expect(firstOrg).toHaveProperty('id');
      expect(firstOrg).toHaveProperty('name');
      expect(firstOrg).toHaveProperty('slug');
      expect(firstOrg).toHaveProperty('status');
    });
  });

  describe('useOrganization hook', () => {
    it('should fetch single organization by ID', async () => {
      const { result } = renderHook(() => useOrganization('org-1'), {
        wrapper: QueryClientWrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.id).toBe('org-1');
      expect(result.current.data?.name).toBe('Acme Corp');
    });

    it('should not fetch when ID is empty', async () => {
      const { result } = renderHook(() => useOrganization(''), {
        wrapper: QueryClientWrapper,
      });

      // Should not make a request when ID is empty
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });
});
