/**
 * RuntimeTreeBuilder - Enterprise Feature Stub
 * 
 * This is a stub implementation for the open source edition.
 * Full runtime tree building and tracking available in @supernal/interface-enterprise.
 * 
 * Visit https://supernal.ai/enterprise for more information.
 */

export interface TreeNode {
  id: string;
  type: string;
  children?: TreeNode[];
}

export class RuntimeTreeBuilder {
  private static instance: RuntimeTreeBuilder | null = null;
  private static warned = false;
  
  private static warnOnce() {
    if (!this.warned && typeof console !== 'undefined') {
      console.warn(
        '⚠️  RuntimeTreeBuilder is an enterprise feature. ' +
        'Full tree tracking available at https://supernal.ai/enterprise'
      );
      this.warned = true;
    }
  }
  
  static getInstance(): RuntimeTreeBuilder {
    if (!this.instance) {
      this.instance = new RuntimeTreeBuilder();
    }
    return this.instance;
  }
  
  // Instance methods
  trackContainer(id: string, parent?: string): void {
    RuntimeTreeBuilder.warnOnce();
  }
  
  trackComponent(id: string, containerId?: string): void {
    RuntimeTreeBuilder.warnOnce();
  }
  
  buildTree(): TreeNode | null {
    RuntimeTreeBuilder.warnOnce();
    return null;
  }
  
  reset(): void {
    RuntimeTreeBuilder.warnOnce();
  }
  
  // Static methods for compatibility
  static enterComponent(id: string, callback?: () => void): void {
    this.warnOnce();
    callback?.();
  }
  
  static exitComponent(id?: string): void {
    this.warnOnce();
  }
  
  static registerTool(toolId: string, componentName?: string, containerId?: string): void {
    this.warnOnce();
  }
}

// TreeBuilder alias for compatibility
export const TreeBuilder = RuntimeTreeBuilder;

// Helper functions - stubs
export function navigateTo(path: string): void {
  // Enterprise feature - no-op in open source
}

export function trackContainerMount(id: string, parent?: string): void {
  // Enterprise feature - no-op in open source
}
