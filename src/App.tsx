import { AppShell } from '@/components/shell/AppShell';

/**
 * App — root component.
 * Delegates all rendering to AppShell, which owns theme sync and layout.
 */
export default function App() {
  return <AppShell />;
}
