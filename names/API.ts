/**
 * API Endpoint Names - Hierarchical ID Contracts
 * 
 * This file defines stable, hierarchical ID constants for API endpoints.
 * Services import these IDs before tools are generated, establishing
 * a contract between the API layer and the tool system.
 * 
 * Pattern: API.Resource.Action
 */

export const API = {
  /**
   * User Management Endpoints
   */
  Users: {
    list: 'api-users-list',
    get: 'api-users-get',
    create: 'api-users-create',
    update: 'api-users-update',
    delete: 'api-users-delete',
    search: 'api-users-search',
  },

  /**
   * Authentication Endpoints
   */
  Auth: {
    login: 'api-auth-login',
    logout: 'api-auth-logout',
    register: 'api-auth-register',
    refreshToken: 'api-auth-refresh-token',
    verifyEmail: 'api-auth-verify-email',
    resetPassword: 'api-auth-reset-password',
  },

  /**
   * Data Management Endpoints
   */
  Data: {
    fetch: 'api-data-fetch',
    save: 'api-data-save',
    sync: 'api-data-sync',
    export: 'api-data-export',
    import: 'api-data-import',
  },

  /**
   * Settings Endpoints
   */
  Settings: {
    get: 'api-settings-get',
    update: 'api-settings-update',
    reset: 'api-settings-reset',
  },

  /**
   * Notification Endpoints
   */
  Notifications: {
    list: 'api-notifications-list',
    markRead: 'api-notifications-mark-read',
    markAllRead: 'api-notifications-mark-all-read',
    delete: 'api-notifications-delete',
  },
} as const;

/**
 * Helper function to get all API IDs as a flat array
 */
export function getAllAPIIds(): string[] {
  const ids: string[] = [];
  
  function collectIds(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        ids.push(obj[key]);
      } else if (typeof obj[key] === 'object') {
        collectIds(obj[key]);
      }
    }
  }
  
  collectIds(API);
  return ids;
}

/**
 * Helper function to validate API ID uniqueness
 */
export function validateAPIIds(): { valid: boolean; duplicates: string[] } {
  const ids = getAllAPIIds();
  const seen = new Set<string>();
  const duplicates: string[] = [];
  
  for (const id of ids) {
    if (seen.has(id)) {
      duplicates.push(id);
    } else {
      seen.add(id);
    }
  }
  
  return {
    valid: duplicates.length === 0,
    duplicates,
  };
}

/**
 * Type-safe API ID access
 */
export type APIPath = typeof API;
export type APIId = ReturnType<typeof getAllAPIIds>[number];

