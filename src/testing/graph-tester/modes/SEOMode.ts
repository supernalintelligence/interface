/**
 * SEO testing mode (stub - to be implemented in Phase 2).
 *
 * Will validate meta tags, OpenGraph, and structured data.
 *
 * @packageDocumentation
 */

import type { Page } from '@playwright/test';
import { TestFunction } from '../core/TestFunction';
import type { TestContext, TestResult } from '../core/types';

/**
 * Configuration for SEO mode.
 */
export interface SEOConfig {
  /** Output directory */
  outputDir: string;

  /** Required meta tags */
  requiredMetaTags?: string[];

  /** Whether to validate OpenGraph (default: true) */
  validateOpenGraph?: boolean;

  /** Whether to validate Twitter Cards (default: true) */
  validateTwitterCards?: boolean;
}

/**
 * SEO testing mode (stub).
 */
export class SEOMode extends TestFunction {
  readonly mode = 'seo';
  readonly name = 'SEO';
  readonly description = 'Validates meta tags and SEO elements';

  private config: SEOConfig;

  constructor(config: SEOConfig) {
    super();
    this.config = config;
  }

  async execute(page: Page, context: TestContext): Promise<TestResult> {
    const startTime = Date.now();
    const errors: import('../core/types').TestError[] = [];

    try {
      // Extract SEO metadata
      const seoData = await page.evaluate(() => {
        // Helper to get meta content
        const getMeta = (name: string): string | null => {
          const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
          return meta?.getAttribute('content') || null;
        };

        // Get all meta tags
        const allMeta: Record<string, string> = {};
        Array.from(document.querySelectorAll('meta')).forEach((meta) => {
          const name = meta.getAttribute('name') || meta.getAttribute('property');
          const content = meta.getAttribute('content');
          if (name && content) {
            allMeta[name] = content;
          }
        });

        // Title and description
        const title = document.querySelector('title')?.textContent || '';
        const description = getMeta('description');

        // OpenGraph
        const og = {
          title: getMeta('og:title'),
          description: getMeta('og:description'),
          image: getMeta('og:image'),
          url: getMeta('og:url'),
          type: getMeta('og:type'),
          siteName: getMeta('og:site_name'),
        };

        // Twitter Cards
        const twitter = {
          card: getMeta('twitter:card'),
          title: getMeta('twitter:title'),
          description: getMeta('twitter:description'),
          image: getMeta('twitter:image'),
          site: getMeta('twitter:site'),
          creator: getMeta('twitter:creator'),
        };

        // Canonical URL
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');

        // Heading structure
        const headings = {
          h1: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent?.trim() || ''),
          h2: Array.from(document.querySelectorAll('h2')).map((h) => h.textContent?.trim() || ''),
          h3Count: document.querySelectorAll('h3').length,
          h4Count: document.querySelectorAll('h4').length,
        };

        // Structured data (JSON-LD)
        const structuredData: any[] = [];
        Array.from(document.querySelectorAll('script[type="application/ld+json"]')).forEach((script) => {
          try {
            const data = JSON.parse(script.textContent || '{}');
            structuredData.push(data);
          } catch {
            // Ignore invalid JSON
          }
        });

        // Images
        const images = Array.from(document.querySelectorAll('img'));
        const imagesWithoutAlt = images.filter((img) => !img.getAttribute('alt')).length;

        // Links
        const links = Array.from(document.querySelectorAll('a'));
        const externalLinks = links.filter((a) => {
          const href = a.getAttribute('href');
          return href && (href.startsWith('http://') || href.startsWith('https://'));
        }).length;

        return {
          title,
          description,
          canonical,
          allMeta,
          og,
          twitter,
          headings,
          structuredData,
          images: {
            total: images.length,
            withoutAlt: imagesWithoutAlt,
          },
          links: {
            total: links.length,
            external: externalLinks,
          },
        };
      });

      // Validate required meta tags
      const missingTags: string[] = [];
      if (this.config.requiredMetaTags) {
        for (const tag of this.config.requiredMetaTags) {
          if (!seoData.allMeta[tag]) {
            missingTags.push(tag);
          }
        }
      }

      // Basic SEO validations
      const issues: import('../core/types').TestError[] = [];

      if (!seoData.title) {
        issues.push({ severity: 'critical', message: 'Missing page title' });
      } else if (seoData.title.length < 30 || seoData.title.length > 60) {
        issues.push({
          severity: 'warning',
          message: `Title length ${seoData.title.length} characters (recommended: 30-60)`,
        });
      }

      if (!seoData.description) {
        issues.push({ severity: 'critical', message: 'Missing meta description' });
      } else if (seoData.description.length < 120 || seoData.description.length > 160) {
        issues.push({
          severity: 'warning',
          message: `Description length ${seoData.description.length} characters (recommended: 120-160)`,
        });
      }

      if (seoData.headings.h1.length === 0) {
        issues.push({ severity: 'warning', message: 'Missing H1 heading' });
      } else if (seoData.headings.h1.length > 1) {
        issues.push({
          severity: 'warning',
          message: `Multiple H1 headings found (${seoData.headings.h1.length})`,
        });
      }

      if (seoData.images.withoutAlt > 0) {
        issues.push({
          severity: 'warning',
          message: `${seoData.images.withoutAlt} images without alt text`,
        });
      }

      // OpenGraph validation
      if (this.config.validateOpenGraph !== false) {
        if (!seoData.og.title) issues.push({ severity: 'warning', message: 'Missing og:title' });
        if (!seoData.og.description) issues.push({ severity: 'warning', message: 'Missing og:description' });
        if (!seoData.og.image) issues.push({ severity: 'warning', message: 'Missing og:image' });
      }

      // Twitter Cards validation
      if (this.config.validateTwitterCards !== false) {
        if (!seoData.twitter.card) issues.push({ severity: 'info', message: 'Missing twitter:card' });
      }

      if (missingTags.length > 0) {
        issues.push({
          severity: 'critical',
          message: `Missing required meta tags: ${missingTags.join(', ')}`,
        });
      }

      // Save results
      const outputPath = `${this.config.outputDir}/${this.sanitizeRoute(context.route)}-seo.json`;
      await this.ensureDirectory(this.config.outputDir);
      await this.writeFile(
        outputPath,
        JSON.stringify(
          {
            route: context.route,
            seo: seoData,
            issues,
            score: this.calculateScore(issues),
          },
          null,
          2
        )
      );

      const duration = Date.now() - startTime;

      return {
        passed: issues.length === 0,
        duration,
        errors: issues,
        metadata: {
          seo: {
            issueCount: issues.length,
            score: this.calculateScore(issues),
            hasStructuredData: seoData.structuredData.length > 0,
          },
          outputPath,
        },
      };
    } catch (error) {
      errors.push({
        severity: 'critical',
        message: `SEO validation failed: ${error instanceof Error ? error.message : String(error)}`,
        stack: error instanceof Error ? error.stack : undefined,
      });
      return {
        passed: false,
        duration: Date.now() - startTime,
        errors,
        metadata: {},
      };
    }
  }

  private calculateScore(issues: import('../core/types').TestError[]): number {
    // Simple scoring: 100 - (10 points per issue)
    return Math.max(0, 100 - issues.length * 10);
  }

  private sanitizeRoute(route: string): string {
    return route.replace(/^\//, '').replace(/\//g, '-') || 'home';
  }

  private async ensureDirectory(dir: string): Promise<void> {
    const fs = await import('fs/promises');
    await fs.mkdir(dir, { recursive: true });
  }

  private async writeFile(path: string, content: string): Promise<void> {
    const fs = await import('fs/promises');
    await fs.writeFile(path, content, 'utf-8');
  }
}
