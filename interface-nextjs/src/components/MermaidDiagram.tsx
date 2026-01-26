'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
  theme?: 'light' | 'dark';
}

export function MermaidDiagram({ chart, theme = 'dark' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const renderDiagram = async () => {
      if (!containerRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Dynamic import to avoid SSR issues
        const mermaid = (await import('mermaid')).default;

        // Configure mermaid with theme
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
        });

        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // Render the diagram
        const { svg } = await mermaid.render(id, chart);

        if (mounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          console.error('Mermaid rendering error:', err);
          setError(err instanceof Error ? err.message : 'Failed to render diagram');
          setIsLoading(false);
        }
      }
    };

    renderDiagram();

    return () => {
      mounted = false;
    };
  }, [chart, theme]);

  if (error) {
    return (
      <div className={`my-4 p-4 rounded-lg border ${
        theme === 'dark'
          ? 'bg-red-900/20 border-red-500 text-red-200'
          : 'bg-red-50 border-red-300 text-red-800'
      }`}>
        <div className="font-semibold mb-1">Mermaid Diagram Error</div>
        <div className="text-sm opacity-90">{error}</div>
        <details className="mt-2 text-xs opacity-75">
          <summary className="cursor-pointer">View diagram source</summary>
          <pre className="mt-2 whitespace-pre-wrap">{chart}</pre>
        </details>
      </div>
    );
  }

  return (
    <div className="my-4 flex justify-center">
      {isLoading && (
        <div className={`py-8 text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Rendering diagram...
        </div>
      )}
      <div
        ref={containerRef}
        className={`mermaid-diagram ${isLoading ? 'hidden' : ''} ${
          theme === 'dark' ? 'mermaid-dark' : 'mermaid-light'
        }`}
      />
    </div>
  );
}
