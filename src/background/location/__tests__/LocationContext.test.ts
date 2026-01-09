import { LocationContext, AppLocation, LocationScope } from '../LocationContext';

describe('LocationContext', () => {
  beforeEach(() => {
    LocationContext.reset();
  });
  
  describe('Basic Location Management', () => {
    it('should start with no location', () => {
      expect(LocationContext.getCurrent()).toBeNull();
    });
    
    it('should set and retrieve current location', () => {
      const location: AppLocation = {
        page: '/blog',
        route: '/blog',
        components: ['blog-header', 'blog-list']
      };
      
      LocationContext.setCurrent(location);
      expect(LocationContext.getCurrent()).toEqual(location);
    });
    
    it('should update location', () => {
      LocationContext.setCurrent({ page: '/blog' });
      LocationContext.setCurrent({ page: '/dashboard' });
      
      expect(LocationContext.getCurrent()).toEqual({ page: '/dashboard' });
    });
  });
  
  describe('Location Change Listeners', () => {
    it('should notify listeners on location change', () => {
      const listener = jest.fn();
      LocationContext.onLocationChange(listener);
      
      const newLocation = { page: '/blog' };
      LocationContext.setCurrent(newLocation);
      
      expect(listener).toHaveBeenCalledWith(null, newLocation);
    });
    
    it('should pass old and new locations to listeners', () => {
      const listener = jest.fn();
      
      const oldLocation = { page: '/blog' };
      LocationContext.setCurrent(oldLocation);
      
      LocationContext.onLocationChange(listener);
      
      const newLocation = { page: '/dashboard' };
      LocationContext.setCurrent(newLocation);
      
      expect(listener).toHaveBeenCalledWith(oldLocation, newLocation);
    });
    
    it('should unsubscribe listeners', () => {
      const listener = jest.fn();
      const unsub = LocationContext.onLocationChange(listener);
      
      unsub();
      
      LocationContext.setCurrent({ page: '/blog' });
      expect(listener).not.toHaveBeenCalled();
    });
    
    it('should handle multiple listeners', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      LocationContext.onLocationChange(listener1);
      LocationContext.onLocationChange(listener2);
      
      const location = { page: '/blog' };
      LocationContext.setCurrent(location);
      
      expect(listener1).toHaveBeenCalledWith(null, location);
      expect(listener2).toHaveBeenCalledWith(null, location);
    });
    
    it('should handle listener errors gracefully', () => {
      const errorListener = jest.fn(() => {
        throw new Error('Listener error');
      });
      const goodListener = jest.fn();
      
      LocationContext.onLocationChange(errorListener);
      LocationContext.onLocationChange(goodListener);
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      LocationContext.setCurrent({ page: '/blog' });
      
      expect(consoleSpy).toHaveBeenCalled();
      expect(goodListener).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
  
  describe('Scope Matching', () => {
    describe('Global Scope', () => {
      it('should match global scope when no location set', () => {
        const scope: LocationScope = { global: true };
        expect(LocationContext.matchesScope(scope)).toBe(true);
      });
      
      it('should match global scope with any location', () => {
        LocationContext.setCurrent({ page: '/blog' });
        const scope: LocationScope = { global: true };
        expect(LocationContext.matchesScope(scope)).toBe(true);
      });
      
      it('should not match non-global scope when no location', () => {
        const scope: LocationScope = { pages: ['/blog'] };
        expect(LocationContext.matchesScope(scope)).toBe(false);
      });
    });
    
    describe('Page Matching', () => {
      beforeEach(() => {
        LocationContext.setCurrent({ page: '/blog' });
      });
      
      it('should match when page is in allowed pages', () => {
        const scope: LocationScope = { pages: ['/blog', '/posts'] };
        expect(LocationContext.matchesScope(scope)).toBe(true);
      });
      
      it('should not match when page is not in allowed pages', () => {
        const scope: LocationScope = { pages: ['/dashboard', '/settings'] };
        expect(LocationContext.matchesScope(scope)).toBe(false);
      });
      
      it('should match when no page constraint', () => {
        const scope: LocationScope = {};
        expect(LocationContext.matchesScope(scope)).toBe(true);
      });
    });
    
    describe('Route Matching', () => {
      beforeEach(() => {
        LocationContext.setCurrent({
          page: '/blog/my-post',
          route: '/blog/[slug]'
        });
      });
      
      it('should match when route is in allowed routes', () => {
        const scope: LocationScope = { routes: ['/blog/[slug]'] };
        expect(LocationContext.matchesScope(scope)).toBe(true);
      });
      
      it('should not match when route is not in allowed routes', () => {
        const scope: LocationScope = { routes: ['/dashboard/[id]'] };
        expect(LocationContext.matchesScope(scope)).toBe(false);
      });
    });
    
    describe('Component Matching', () => {
      beforeEach(() => {
        LocationContext.setCurrent({
          page: '/blog',
          components: ['blog-header', 'blog-list', 'blog-footer']
        });
      });
      
      it('should match when all required components are present', () => {
        const scope: LocationScope = { components: ['blog-header', 'blog-list'] };
        expect(LocationContext.matchesScope(scope)).toBe(true);
      });
      
      it('should not match when required component is missing', () => {
        const scope: LocationScope = { components: ['blog-sidebar'] };
        expect(LocationContext.matchesScope(scope)).toBe(false);
      });
      
      it('should not match when no components in location', () => {
        LocationContext.setCurrent({ page: '/blog' });
        const scope: LocationScope = { components: ['blog-header'] };
        expect(LocationContext.matchesScope(scope)).toBe(false);
      });
    });
    
    describe('Element Matching', () => {
      beforeEach(() => {
        LocationContext.setCurrent({
          page: '/blog',
          elements: ['#post-1', '#post-2', '.edit-button']
        });
      });
      
      it('should match when all required elements are present', () => {
        const scope: LocationScope = { elements: ['#post-1', '.edit-button'] };
        expect(LocationContext.matchesScope(scope)).toBe(true);
      });
      
      it('should not match when required element is missing', () => {
        const scope: LocationScope = { elements: ['#delete-button'] };
        expect(LocationContext.matchesScope(scope)).toBe(false);
      });
    });
    
    describe('Custom Matcher', () => {
      it('should use custom matcher function', () => {
        LocationContext.setCurrent({
          page: '/blog',
          metadata: { userRole: 'admin' }
        });
        
        const scope: LocationScope = {
          custom: (loc) => loc.metadata?.userRole === 'admin'
        };
        
        expect(LocationContext.matchesScope(scope)).toBe(true);
      });
      
      it('should fail when custom matcher returns false', () => {
        LocationContext.setCurrent({ page: '/blog' });
        
        const scope: LocationScope = {
          custom: () => false
        };
        
        expect(LocationContext.matchesScope(scope)).toBe(false);
      });
    });
    
    describe('Combined Constraints', () => {
      it('should match when all constraints are satisfied', () => {
        LocationContext.setCurrent({
          page: '/blog',
          route: '/blog',
          components: ['blog-header']
        });
        
        const scope: LocationScope = {
          pages: ['/blog'],
          routes: ['/blog'],
          components: ['blog-header']
        };
        
        expect(LocationContext.matchesScope(scope)).toBe(true);
      });
      
      it('should not match if any constraint fails', () => {
        LocationContext.setCurrent({
          page: '/blog',
          components: ['blog-header']
        });
        
        const scope: LocationScope = {
          pages: ['/blog'],
          components: ['blog-sidebar']  // Missing!
        };
        
        expect(LocationContext.matchesScope(scope)).toBe(false);
      });
    });
  });
});
