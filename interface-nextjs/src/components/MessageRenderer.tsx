'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeKatex from 'rehype-katex';
import { CodeBlock } from './CodeBlock';
import { MermaidDiagram } from './MermaidDiagram';
import type { Components } from 'react-markdown';

interface MessageRendererProps {
  content: string;
  theme?: 'light' | 'dark';
}

export function MessageRenderer({ content, theme = 'dark' }: MessageRendererProps) {
  // Custom components for rendering
  const components: Components = {
    // Code blocks with syntax highlighting
    code(props) {
      const { node, className, children, ...rest } = props;
      const value = String(children).replace(/\n$/, '');
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const inline = !className; // Inline code has no className

      // Check if it's a mermaid diagram
      if (language === 'mermaid') {
        return <MermaidDiagram chart={value} theme={theme} />;
      }

      return (
        <CodeBlock
          className={className}
          inline={inline}
          theme={theme}
        >
          {value}
        </CodeBlock>
      );
    },

    // Headings with better styling
    h1: ({ children }) => (
      <h1 className={`text-2xl font-bold mt-6 mb-3 ${
        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
      }`}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className={`text-xl font-bold mt-5 mb-2.5 ${
        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
      }`}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className={`text-lg font-semibold mt-4 mb-2 ${
        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
      }`}>
        {children}
      </h3>
    ),

    // Paragraphs
    p: ({ children }) => (
      <p className={`mb-3 leading-relaxed ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {children}
      </p>
    ),

    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`underline transition-colors ${
          theme === 'dark'
            ? 'text-blue-400 hover:text-blue-300'
            : 'text-blue-600 hover:text-blue-700'
        }`}
      >
        {children}
      </a>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className={`list-disc list-inside mb-3 space-y-1 ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className={`list-decimal list-inside mb-3 space-y-1 ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {children}
      </ol>
    ),

    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className={`border-l-4 pl-4 my-3 italic ${
        theme === 'dark'
          ? 'border-blue-500 bg-blue-900/20 py-2 pr-2'
          : 'border-blue-400 bg-blue-50 py-2 pr-2'
      }`}>
        {children}
      </blockquote>
    ),

    // Tables
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className={`min-w-full border-collapse ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
        }`}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
        {children}
      </thead>
    ),
    th: ({ children }) => (
      <th className={`px-4 py-2 text-left font-semibold border ${
        theme === 'dark'
          ? 'border-gray-700 text-gray-200'
          : 'border-gray-300 text-gray-800'
      }`}>
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className={`px-4 py-2 border ${
        theme === 'dark'
          ? 'border-gray-700 text-gray-300'
          : 'border-gray-300 text-gray-700'
      }`}>
        {children}
      </td>
    ),

    // Horizontal rule
    hr: () => (
      <hr className={`my-4 border-t ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
      }`} />
    ),

    // Admonitions support (using containerDirective from remark-directive)
    div: ({ node, className, children, ...props }) => {
      // Check if it's an admonition
      if (className?.includes('admonition')) {
        const type = className.split('-')[1]; // Extract type from "admonition-tip"

        const styles: Record<string, { border: string; bg: string; icon: string }> = {
          tip: {
            border: theme === 'dark' ? 'border-green-500' : 'border-green-600',
            bg: theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50',
            icon: '💡'
          },
          warning: {
            border: theme === 'dark' ? 'border-yellow-500' : 'border-yellow-600',
            bg: theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50',
            icon: '⚠️'
          },
          danger: {
            border: theme === 'dark' ? 'border-red-500' : 'border-red-600',
            bg: theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50',
            icon: '🚨'
          },
          info: {
            border: theme === 'dark' ? 'border-blue-500' : 'border-blue-600',
            bg: theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50',
            icon: 'ℹ️'
          },
        };

        const style = styles[type] || styles.info;

        return (
          <div className={`my-4 p-4 border-l-4 rounded-r-lg ${style.border} ${style.bg}`}>
            <div className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0">{style.icon}</span>
              <div className="flex-1">{children}</div>
            </div>
          </div>
        );
      }

      return <div className={className} {...props}>{children}</div>;
    },
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkDirective]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
