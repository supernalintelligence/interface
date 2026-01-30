'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  children: string;
  className?: string;
  inline?: boolean;
  theme?: 'light' | 'dark';
}

export function CodeBlock({ children, className, inline, theme = 'dark' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract language from className (format: "language-javascript")
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Inline code
  if (inline) {
    return (
      <code className={`${className || ''} px-1.5 py-0.5 rounded text-sm font-mono ${
        theme === 'dark'
          ? 'bg-gray-800 text-gray-200'
          : 'bg-gray-100 text-gray-800'
      }`}>
        {children}
      </code>
    );
  }

  // Block code with syntax highlighting
  return (
    <div className="relative group my-4">
      <button
        onClick={handleCopy}
        className={`absolute top-2 right-2 px-3 py-1.5 text-xs font-medium rounded transition-all ${
          theme === 'dark'
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        } ${copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        aria-label="Copy code"
      >
        {copied ? (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </span>
        )}
      </button>

      {React.createElement(SyntaxHighlighter as any, {
        language,
        style: theme === 'dark' ? vscDarkPlus : vs,
        customStyle: {
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          padding: '1rem',
        },
        showLineNumbers: true,
        wrapLines: true,
        children,
      })}
    </div>
  );
}
