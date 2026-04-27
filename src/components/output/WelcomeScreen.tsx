import { userConfig } from '@/config';
import { buildBlockBanner } from '@/lib/asciiArt';
import { motion, useReducedMotion } from 'framer-motion';

const REPO_URL = 'https://github.com/srs-sudeep/TermX';

interface WelcomeScreenProps {
  config?: typeof userConfig;
}

export function WelcomeScreen({ config = userConfig }: WelcomeScreenProps) {
  const reduce = useReducedMotion();

  const banner = buildBlockBanner(config.user.name);

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
      <div className="overflow-x-auto">
        <pre
          className="text-[var(--accent)] whitespace-pre select-none inline-block min-w-0"
          aria-label={`${config.user.name} — terminal portfolio`}
        >
          {banner}
        </pre>
      </div>

      <motion.div
        initial={initial}
        animate={animate}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.15 }}
        className="mt-4 space-y-2"
      >
        <p className="text-[var(--fg)]">
          Welcome to my terminal portfolio.
        </p>

        <p className="text-[var(--muted)] select-none" aria-hidden="true">
          ────
        </p>

        <p className="text-[var(--fg)]">
          Source code:{' '}
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

        <p className="text-[var(--muted)] select-none" aria-hidden="true">
          ────
        </p>

        <p className="text-[var(--fg)]">
          For a list of available commands, type{' '}
          <code className="text-[var(--prompt)]">`help`</code>.
        </p>
      </motion.div>
    </motion.div>
  );
}

