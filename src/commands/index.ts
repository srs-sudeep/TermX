/**
 * src/commands/index.ts
 * Registry assembly point — the only allowed barrel for commands.
 *
 * Re-exports the registry API so consumers import from '@/commands'
 * rather than reaching into '@/lib/commandRegistry' directly.
 *
 * Individual command files live under:
 *   src/commands/core/
 *   src/commands/portfolio/
 *   src/commands/system/
 *   src/commands/fun/
 *
 * Commands are auto-discovered by createRegistry() via import.meta.glob —
 * no manual registration is required here.
 */

export { createRegistry, buildRegistry } from '@/lib/commandRegistry';
export type { Registry } from '@/lib/commandRegistry';
