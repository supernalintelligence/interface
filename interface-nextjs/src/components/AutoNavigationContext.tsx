'use client';

import React, { useEffect, useState } from 'react';
import { NavigationContextProvider } from '../hooks/useNavigationGraph';

export interface AutoNavigationContextProps {
  children: React.ReactNode;
  routes?: Record<string, string>;
  onNavigate?: (context: string) => void;
}

export function AutoNavigationContext({
  children,
  routes,
  onNavigate,
}: AutoNavigationContextProps) {
  // Get pathname - works in both App Router and Pages Router
  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);

  // Auto-detect context from pathname ONLY if routes are provided
  // If routes is undefined, don't try to set context - let pages do it via useContainer
  const context = routes ? inferContextFromPath(pathname, routes) : null;

  // Notify parent on context change
  useEffect(() => {
    if (onNavigate && context) {
      onNavigate(context);
    }
  }, [context, onNavigate]);

  // If no routes provided, don't wrap in NavigationContextProvider
  // This allows pages to set their own context via useContainer
  if (!context) {
    return <>{children}</>;
  }

  return (
    <NavigationContextProvider value={context}>
      {children}
    </NavigationContextProvider>
  );
}

function inferContextFromPath(path: string, customRoutes?: Record<string, string>): string {
  // If custom routes provided, try to match them first
  if (customRoutes) {
    for (const [name, routePath] of Object.entries(customRoutes)) {
      if (path === routePath || path.startsWith(routePath + '/')) {
        return name;
      }
    }
  }

  // Auto-detection rules (default)
  const patterns: Record<string, string> = {
    '/': 'home',
    '/blog': 'blog',
    '/docs': 'docs',
    '/examples': 'examples',
    '/demo': 'demo',
  };

  // Exact match
  if (patterns[path]) return patterns[path];

  // Prefix match (most specific first)
  const sortedPatterns = Object.entries(patterns).sort((a, b) =>
    b[0].length - a[0].length
  );

  for (const [pattern, context] of sortedPatterns) {
    if (path.startsWith(pattern) && pattern !== '/') {
      return context;
    }
  }

  // Fallback
  return 'global';
}
