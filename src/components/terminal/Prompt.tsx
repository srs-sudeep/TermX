import type { UserConfig } from '@/types';

interface PromptProps {
  config: UserConfig['prompt'];
  /**
   * When true, renders in muted color — used for completed history entries
   * so the current input line stands out.
   */
  muted?: boolean;
}

/**
 * Renders the terminal prompt string.
 * Substitutes {user}, {host}, {path} tokens from the prompt config.
 *
 * @example
 * <Prompt config={userConfig.prompt} />
 * // → sam@portfolio:~$ (in prompt color)
 *
 * <Prompt config={userConfig.prompt} muted />
 * // → sam@portfolio:~$ (in muted color, for history entries)
 */
export function Prompt({ config, muted = false }: PromptProps) {
  const rendered = config.template
    .replace('{user}', config.user)
    .replace('{host}', config.host)
    .replace('{path}', config.path);

  return (
    <span
      className={muted ? 'text-[var(--muted)]' : 'text-[var(--prompt)]'}
      aria-hidden="true"
    >
      {rendered}
    </span>
  );
}
