'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  // Auto-detect context from pathname
  const context = inferContextFromPath(pathname, routes);

  // Notify parent on context change
  useEffect(() => {
    if (onNavigate) {
      onNavigate(context);
    }
  }, [context, onNavigate]);

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
