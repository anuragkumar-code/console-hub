import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useContacts, useContact } from './useContacts';
import { QueryClientWrapper } from '@/test/utils';
import { setTokens, removeTokens } from '@/utils/auth';

describe('useContacts', () => {
  beforeEach(() => {
    setTokens('mock-access-token', 'mock-refresh-token');
  });

  afterEach(() => {
    removeTokens();
  });

  describe('useContacts hook', () => {
    it('should fetch contacts list', async () => {
      const { result } = renderHook(() => useContacts(), {
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

    it('should return contacts with correct structure', async () => {
      const { result } = renderHook(() => useContacts(), {
        wrapper: QueryClientWrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const firstContact = result.current.data?.items[0];
      expect(firstContact).toHaveProperty('id');
      expect(firstContact).toHaveProperty('first_name');
      expect(firstContact).toHaveProperty('email');
      expect(firstContact).toHaveProperty('status');
    });
  });

  describe('useContact hook', () => {
    it('should fetch single contact by ID', async () => {
      const { result } = renderHook(() => useContact('contact-1'), {
        wrapper: QueryClientWrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.id).toBe('contact-1');
      expect(result.current.data?.first_name).toBe('Jane');
      expect(result.current.data?.email).toBe('jane@example.com');
    });

    it('should not fetch when ID is empty', async () => {
      const { result } = renderHook(() => useContact(''), {
        wrapper: QueryClientWrapper,
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });
});
