import { lazy, Suspense } from 'react';
import type { CommandOutput } from '@/types';
import { userConfig } from '@/config';
import { buildBanner } from '@/lib/asciiFonts';
import { TextOutput } from './TextOutput';
import { ListOutput } from './ListOutput';
import { TableOutput } from './TableOutput';
import { CardsOutput } from './CardsOutput';
import { ErrorOutput } from './ErrorOutput';
import { JsxOutput } from './JsxOutput';
import { AsciiBanner } from '@/components/effects/AsciiBanner';
import { SettingsPanel } from '@/components/settings/SettingsPanel';

// Heavy effect components are lazy-loaded so they don't bloat the initial bundle.
const MatrixRain = lazy(() => import('@/components/effects/MatrixRain'));
const HackEffect = lazy(() => import('@/components/effects/HackEffect'));

interface OutputRendererProps {
  output: CommandOutput;
}

/**
 * Dispatches a `CommandOutput` to the appropriate renderer component.
 *
 * Handles all non-side-effect output types. The side-effect types
 * (`clear`, `redirect`, `download`) are consumed by `useTerminal` before
 * reaching the render layer and never appear here.
 *
 * Special discriminants that avoid component imports in command files:
 *  - `settings-panel` → `<SettingsPanel />`
 *  - `banner`         → `<AsciiBanner text={buildBanner(name)} />`
 *  - `matrix`         → `<MatrixRain />` (lazy, fixed overlay)
 *  - `hack`           → `<HackEffect />` (lazy, timed animation)
 */
export function OutputRenderer({ output }: OutputRendererProps) {
  switch (output.type) {
    case 'text':
      return <TextOutput content={output.content} tone={output.tone} />;

    case 'list':
      return <ListOutput items={output.items} />;

    case 'table':
      return <TableOutput headers={output.headers} rows={output.rows} />;

    case 'cards':
      return <CardsOutput cards={output.cards} />;

    case 'error':
      return <ErrorOutput message={output.message} />;

    case 'jsx':
      return <JsxOutput element={output.element} />;

    case 'settings-panel':
      return <SettingsPanel />;

    case 'banner':
      return <AsciiBanner text={buildBanner(userConfig.user.name)} />;

    case 'matrix':
      return (
        <Suspense fallback={null}>
          <MatrixRain />
        </Suspense>
      );

    case 'hack':
      return (
        <Suspense fallback={<span className="text-[var(--muted)]">Initializing...</span>}>
          <HackEffect />
        </Suspense>
      );

    // Side-effect types are never rendered — handled by useTerminal.
    case 'clear':
    case 'redirect':
    case 'download':
      return null;
  }
}
