/**
 * Create Terminal Names Helper
 *
 * Typed registry of CLI execution contexts (a shell + a sandbox tier), the
 * terminal-side sibling of `createNames` (UI components) and the Routes registry.
 * It exists so a Gherkin story can write `Given I am in Terminal.bash` and have it
 * resolve deterministically the same way `Routes.X` / `Components.X.Y` resolve.
 *
 * Convention (mirrors createNames): kebab-case ids, `prefix-<kebab(key)>`, and the
 * namespace registered with the shared `architectureRegistry` for discovery.
 *
 *   Terminal.bash           -> 'terminal-bash'         (shell bash, tier inherit)
 *   Terminal.restrictedBash -> 'terminal-restricted-bash' (shell bash, tier restricted)
 *   Terminal.tmpdir         -> 'terminal-tmpdir'       (shell bash, tier tmpdir)
 *
 * This module is the SINGLE source of terminal resolution: `resolveTerminalRef`
 * accepts a story token (`Terminal.bash`), a full id (`terminal-bash`), or a bare
 * key (`bash`) and returns the metadata. The enterprise CLI step executor delegates
 * to it so there is exactly one mapping of name -> (shell, tier).
 *
 * @example
 * ```ts
 * export const Terminal = createTerminals('terminal', {
 *   bash:       { shell: 'bash', tier: 'inherit' },
 *   restricted: { shell: 'bash', tier: 'restricted' },
 * });
 * // { bash: 'terminal-bash', restricted: 'terminal-restricted' }
 * ```
 */

import { architectureRegistry } from '../architecture/registry';

/** Sandbox tiers a terminal can run in (matches enterprise CliAdapter.SandboxTier). */
export type TerminalTier = 'inherit' | 'tmpdir' | 'restricted' | 'agent';

/** Per-terminal configuration: which shell, which sandbox tier, optional extra env. */
export interface TerminalConfig {
  shell: string;
  tier: TerminalTier;
  env?: Record<string, string>;
}

/** Resolved metadata for a registered terminal id. */
export interface TerminalMetadata {
  /** Fully-qualified id, e.g. 'terminal-restricted-bash'. */
  id: string;
  shell: string;
  tier: TerminalTier;
  env?: Record<string, string>;
}

/** Convert camelCase to kebab-case (kept identical to createNames). */
function camelToKebab(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

/**
 * Live metadata store keyed by terminal id. Populated by every `createTerminals`
 * call. `TERMINAL_METADATA` is the same object reference so reads always see the
 * latest registrations (order-independent).
 */
const metadataStore: Record<string, TerminalMetadata> = {};

/**
 * Create a typed terminal namespace with automatic kebab-case ids, populate the
 * metadata store, and register the namespace with the architecture registry as a
 * container (terminals are execution contexts, not UI components).
 *
 * @param prefix - id prefix (e.g. 'terminal')
 * @param config - map of key -> TerminalConfig
 * @returns map of key -> fully-qualified id (`prefix-<kebab(key)>`)
 */
export function createTerminals<C extends Record<string, TerminalConfig>>(
  prefix: string,
  config: C,
): { [K in keyof C]: string } {
  const ids = {} as { [K in keyof C]: string };

  for (const [key, cfg] of Object.entries(config) as Array<[keyof C, TerminalConfig]>) {
    const id = `${prefix}-${camelToKebab(String(key))}`;
    (ids as Record<string, string>)[key as string] = id;
    metadataStore[id] = { id, shell: cfg.shell, tier: cfg.tier, env: cfg.env };
  }

  // PascalCase namespace (Terminal), mirroring how createNames/getComponents name namespaces.
  const namespace = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  architectureRegistry.registerContainer(namespace, ids);

  return ids;
}

/**
 * The built-in terminal registry. Keys cover both shell-named (`bash`, `zsh`) and
 * tier-named (`tmpdir`, `restricted`, `agent`) entries so stories can address a
 * terminal by either intent.
 */
export const Terminal = createTerminals('terminal', {
  bash: { shell: 'bash', tier: 'inherit' },
  zsh: { shell: 'zsh', tier: 'inherit' },
  sh: { shell: 'sh', tier: 'inherit' },
  inherit: { shell: 'bash', tier: 'inherit' },
  tmpdir: { shell: 'bash', tier: 'tmpdir' },
  restricted: { shell: 'bash', tier: 'restricted' },
  agent: { shell: 'bash', tier: 'agent' },
  restrictedBash: { shell: 'bash', tier: 'restricted' },
  agentBash: { shell: 'bash', tier: 'agent' },
});

/** All metadata for registered terminals, keyed by id. Live reference to the store. */
export const TERMINAL_METADATA: Record<string, TerminalMetadata> = metadataStore;

/** Look up metadata for a fully-qualified terminal id, or undefined. */
export function getTerminalMetadata(terminalId: string): TerminalMetadata | undefined {
  return metadataStore[terminalId];
}

/** The ids of the built-in `Terminal` namespace. */
export function getTerminalIds(): string[] {
  return Object.values(Terminal);
}

/** True if `id` is a built-in `Terminal` id (e.g. 'terminal-bash'). */
export function isTerminalId(id: string): id is (typeof Terminal)[keyof typeof Terminal] {
  return getTerminalIds().includes(id as (typeof Terminal)[keyof typeof Terminal]);
}

/**
 * Resolve a story reference to terminal metadata. Accepts, in order:
 *   - a namespaced token:  'Terminal.bash', 'Terminal.restrictedBash'
 *   - a fully-qualified id: 'terminal-bash'
 *   - a bare key:          'bash', 'restricted', 'restrictedBash'
 * Returns undefined when no terminal matches (callers fail loud — no silent default).
 */
export function resolveTerminalRef(ref: string): TerminalMetadata | undefined {
  if (!ref || !ref.trim()) return undefined;
  let token = ref.trim();

  // Strip a leading `Terminal.` namespace (consistency with Routes./Components.).
  const ns = token.match(/^Terminal\.([A-Za-z0-9]+)$/);
  if (ns) token = ns[1];

  // Direct id hit (already `terminal-...`).
  if (metadataStore[token]) return metadataStore[token];

  // Bare key -> id.
  const id = `terminal-${camelToKebab(token)}`;
  return metadataStore[id];
}

/** Type helper to extract a terminal id union from a namespace. */
export type TerminalId<T> = T extends Record<string, infer U> ? U : never;
