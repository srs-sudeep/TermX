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
  // Render structured segments so we can color the user, host, and path
  // independently. This produces the classic three-tone prompt look:
  //
  //     user@host:path$
  //     ^^^^      ^^^^      → prompt-colored
  //         ^^^^^             → fg-colored
  //              ^^^^^         → accent-colored
  //
  // Falls back to a plain rendered template when `muted` is set so history
  // entries stay subdued.
  if (muted) {
    const rendered = config.template
      .replace('{user}', config.user)
      .replace('{host}', config.host)
      .replace('{path}', config.path);
    return (
      <span className="text-[var(--muted)] mr-1.5" aria-hidden="true">
        {rendered}
      </span>
    );
  }

  // Active prompt — split the template so each token gets its own color.
  // Static text between tokens is rendered in the prompt color.
  const tokenRe = /(\{user\}|\{host\}|\{path\})/g;
  const parts = config.template.split(tokenRe);

  return (
    <span className="mr-1.5" aria-hidden="true">
      {parts.map((part, idx) => {
        if (part === '{user}') {
          return (
            <span key={idx} className="text-[var(--prompt)] font-semibold">
              {config.user}
            </span>
          );
        }
        if (part === '{host}') {
          return (
            <span key={idx} className="text-[var(--accent)] font-semibold">
              {config.host}
            </span>
          );
        }
        if (part === '{path}') {
          return (
            <span key={idx} className="text-[var(--info)]">
              {config.path}
            </span>
          );
        }
        return (
          <span key={idx} className="text-[var(--muted)]">
            {part}
          </span>
        );
      })}
    </span>
  );
}
