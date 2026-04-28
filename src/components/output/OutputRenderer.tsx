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
import { WelcomeScreen } from './WelcomeScreen';

const MatrixRain = lazy(() => import('@/components/effects/MatrixRain'));
const HackEffect = lazy(() => import('@/components/effects/HackEffect'));

interface OutputRendererProps {
  output: CommandOutput;
}

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

    case 'welcome':
      return <WelcomeScreen />;

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

    case 'clear':
    case 'redirect':
    case 'download':
      return null;
  }
}
