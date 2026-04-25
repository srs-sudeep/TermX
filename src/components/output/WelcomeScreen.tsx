import { motion, useReducedMotion } from 'framer-motion';
import { userConfig } from '@/config';
import { buildBlockBanner, PORTRAIT_ART } from '@/lib/asciiArt';

const VERSION = '2.0.0';

const REPO_URL = 'https://github.com/srs-sudeep';

interface WelcomeScreenProps {
  /**
   * Optional configuration override. Falls back to the imported
   * `userConfig` so the renderer works in tests / storybook contexts
   * where no command context is available.
   */
  config?: typeof userConfig;
}

/**
 * The hero / welcome screen rendered by the `welcome` command.
 *
 * Layout — a single `<pre>` with the banner on the left and a decorative
 * portrait on the right (joined per-row), followed by a short intro,
 * a divider, a GitHub repo link, another divider, and a hint to run
 * `help`. Closely mirrors the screenshot's reference design.
 *
 * Animation: a subtle fade-in + slide-up driven by framer-motion. Honours
 * `prefers-reduced-motion` automatically (no entrance animation).
 */
export function WelcomeScreen({ config = userConfig }: WelcomeScreenProps) {
  const reduce = useReducedMotion();

  const banner = buildBlockBanner(config.user.name);
  const composite = composeWelcomeArt(banner, PORTRAIT_ART);

  const initial = reduce ? false : { opacity: 0, y: 6 };
  const animate = { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="font-mono text-sm leading-tight"
      data-welcome-screen
    >
      <pre
        className="text-[var(--accent)] whitespace-pre overflow-x-auto select-none"
        aria-label={`${config.user.name} — terminal portfolio`}
      >
        {composite}
      </pre>

      <motion.div
        initial={initial}
        animate={animate}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.15 }}
        className="mt-4 space-y-2"
      >
        <p className="text-[var(--fg)]">
          Welcome to my terminal portfolio.{' '}
          <span className="text-[var(--muted)]">(Version {VERSION})</span>
        </p>

        <p className="text-[var(--muted)] select-none" aria-hidden="true">────</p>

        <p className="text-[var(--fg)]">
          This project's source code can be found in this project's{' '}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline decoration-dotted underline-offset-4 hover:decoration-solid"
          >
            GitHub repo
          </a>
          .
        </p>

        <p className="text-[var(--muted)] select-none" aria-hidden="true">────</p>

        <p className="text-[var(--fg)]">
          For a list of available commands, type{' '}
          <code className="text-[var(--prompt)]">`help`</code>.
        </p>
      </motion.div>
    </motion.div>
  );
}

/**
 * Joins the multi-row banner (left) and the decorative portrait (right)
 * into a single `<pre>`-friendly string, line by line.
 *
 * - Each banner row is right-padded to a fixed width so the portrait is
 *   anchored to a consistent column on every row.
 * - When one block is shorter than the other, the gap is filled with
 *   spaces (or empty padding) so trailing rows still render the present block.
 * - A 4-column gutter sits between the two blocks.
 */
function composeWelcomeArt(banner: string, portrait: string): string {
  const bannerLines = banner.split('\n');
  const portraitLines = portrait.split('\n');

  const bannerWidth = Math.max(...bannerLines.map((l) => l.length));
  const totalRows = Math.max(bannerLines.length, portraitLines.length);

  const gutter = '    ';
  const out: string[] = [];

  for (let i = 0; i < totalRows; i++) {
    const left = (bannerLines[i] ?? '').padEnd(bannerWidth, ' ');
    const right = portraitLines[i] ?? '';
    // Trim trailing spaces on the right side to keep horizontal scroll modest.
    out.push(`${left}${gutter}${right}`.replace(/\s+$/g, ''));
  }

  return out.join('\n');
}
