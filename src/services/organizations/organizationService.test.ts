import { describe, it, expect, beforeEach } from 'vitest';
import { organizationService } from './organizationService';
import { setTokens, removeTokens } from '@/utils/auth';

describe('organizationService', () => {
  beforeEach(() => {
    // Set auth token for authenticated requests
    setTokens('mock-access-token', 'mock-refresh-token');
  });

  afterEach(() => {
    removeTokens();
  });

  describe('getAll', () => {
    it('should fetch all organizations', async () => {
      const result = await organizationService.getAll();

      expect(result).toBeDefined();
      expect(result.items).toBeInstanceOf(Array);
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items[0]).toHaveProperty('id');
      expect(result.items[0]).toHaveProperty('name');
      expect(result.items[0]).toHaveProperty('slug');
    });

    it('should return paginated results', async () => {
      const result = await organizationService.getAll();

      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
      expect(result).toHaveProperty('total_pages');
    });
  });

  describe('getById', () => {
    it('should fetch organization by ID', async () => {
      const result = await organizationService.getById('org-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('org-1');
      expect(result.name).toBe('Acme Corp');
      expect(result.slug).toBe('acme-corp');
    });

    it('should throw error for non-existent organization', async () => {
      await expect(
        organizationService.getById('non-existent-id')
      ).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new organization', async () => {
      const newOrg = {
        name: 'New Organization',
        slug: 'new-org',
        plan_type: 'starter' as const,
      };

      const result = await organizationService.create(newOrg);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe('New Organization');
      expect(result.slug).toBe('new-org');
    });
  });
});
