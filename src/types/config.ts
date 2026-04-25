/**
 * config.ts
 * Types for all user-editable configuration files under src/config/.
 *
 * This is the single source of truth for config shapes.
 * Config files import from here — they never declare types locally.
 *
 * Rules:
 *  - Never add runtime side effects to these types.
 *  - Adding optional fields is safe; removing or renaming requires a deprecation path.
 *  - See .claude/rules/config.md for the full contract.
 */

// ── Sub-types ──────────────────────────────────────────────────────────────

/**
 * A single project in the portfolio.
 *
 * @example
 * {
 *   slug: 'quill',
 *   name: 'Quill',
 *   description: 'A minimalist markdown journaling app built as a PWA.',
 *   tagline: 'Write anywhere, own your data.',
 *   tech: ['React', 'IndexedDB', 'PWA'],
 *   links: { live: 'https://quill.example.com', repo: 'https://github.com/samreyes/quill' },
 *   featured: true,
 *   year: 2024,
 * }
 */
export interface Project {
  /** URL-safe identifier used as a CLI argument (e.g. `projects quill`). */
  slug: string;
  /** Display name. */
  name: string;
  /** One-paragraph description shown in the detail card. */
  description: string;
  /** Short tagline shown in list view. */
  tagline?: string;
  /** Technologies / tools used. */
  tech: string[];
  /** External links. All optional — only include what exists. */
  links: {
    live?: string;
    repo?: string;
    demo?: string;
  };
  /** Whether this project appears in `projects --featured` filter. */
  featured?: boolean;
  /** Year the project was completed or most recently active. */
  year: number;
}

/**
 * An individual skill with an optional proficiency level.
 * Levels map to a progress bar: `1` = novice … `5` = expert.
 */
export interface Skill {
  /** Skill name (language, tool, framework, etc.). */
  name: string;
  /**
   * Proficiency level 1–5.
   * Rendered as █████░ style bars in the `skills` command.
   */
  level?: 1 | 2 | 3 | 4 | 5;
}

/**
 * A named group of related skills (e.g. "Languages", "Frameworks", "Tools").
 */
export interface SkillCategory {
  /** Group heading shown in the `skills` command table. */
  name: string;
  /** Skills within this category. */
  items: Skill[];
}

/**
 * A single work experience entry.
 *
 * @example
 * {
 *   company: 'Acme Corp',
 *   role: 'Senior Frontend Engineer',
 *   start: '2022-03',
 *   end: 'present',
 *   location: 'Remote',
 *   bullets: ['Led migration of legacy jQuery app to React', 'Reduced bundle by 40%'],
 * }
 */
export interface Experience {
  /** Company or organisation name. */
  company: string;
  /** Job title / role. */
  role: string;
  /**
   * Start date in ISO-ish format (YYYY-MM or YYYY).
   * Used for display only — not parsed as a Date object.
   */
  start: string;
  /**
   * End date, or the string `'present'` for current roles.
   * Using a string union so TypeScript catches accidental booleans.
   */
  end: string | 'present';
  /** Optional city, region, or "Remote". */
  location?: string;
  /** Achievement bullets shown in the experience card. */
  bullets: string[];
}

/**
 * A single education entry (degree, bootcamp, certification).
 */
export interface Education {
  /** School, university, or program name. */
  institution: string;
  /** Degree, certification, or program title. */
  degree: string;
  /** Start year or date (display only). */
  start: string;
  /** Graduation year or date (display only). */
  end: string;
  /** Optional notes: GPA, honours, concentration, etc. */
  details?: string;
}

/**
 * A social media / professional profile link.
 */
export interface SocialLink {
  /** Display name (e.g. "GitHub", "LinkedIn"). */
  name: string;
  /** Username or handle shown in the terminal (e.g. "@samreyes"). */
  handle: string;
  /** Full URL to the profile. */
  url: string;
  /**
   * Lucide icon name (e.g. `'github'`, `'linkedin'`, `'twitter'`).
   * Used only in the non-terminal Settings panel — not in command output.
   */
  icon?: string;
}

// ── UserConfig ─────────────────────────────────────────────────────────────

/**
 * Root config type for `src/config/user.config.ts`.
 * Everything a portfolio owner needs to customise lives here.
 *
 * Treat this as a public API: additions must be optional; removals need a
 * deprecation path. See .claude/rules/config.md for the full contract.
 */
export interface UserConfig {
  /**
   * Site-level metadata used for HTML `<head>` tags, OG cards, and SEO.
   */
  meta: {
    /** Title used in `<title>` and `og:title`. */
    siteName: string;
    /** Short description for `<meta name="description">` and `og:description`. */
    siteDescription: string;
    /** Canonical URL of the deployed site (no trailing slash). */
    siteUrl: string;
    /** Absolute URL to the OG image. Defaults to `/og-image.png`. */
    ogImage?: string;
  };

  /**
   * Personal details shown throughout the terminal.
   */
  user: {
    /** Full display name (used in banner, neofetch, about). */
    name: string;
    /** Short handle displayed in the terminal prompt (e.g. `sam`). */
    handle: string;
    /** Professional title shown in `about` and neofetch. */
    title: string;
    /** City / country or "Remote". */
    location: string;
    /** One-sentence bio shown in `whoami` and neofetch. */
    bio: string;
    /** IANA timezone string (e.g. `'America/Los_Angeles'`). Used by `date`. */
    timezone: string;
    /** Optional avatar URL. Falls back to initials if omitted. */
    avatar?: string;
  };

  /**
   * Terminal prompt configuration.
   * Template tokens: `{user}`, `{host}`, `{path}`.
   *
   * @example
   * template: '{user}@{host}:{path}$ '
   * user: 'sam', host: 'portfolio', path: '~'
   * // renders → sam@portfolio:~$
   */
  prompt: {
    /** Template string with `{user}`, `{host}`, `{path}` tokens. */
    template: string;
    /** Value substituted for `{user}` in the prompt. */
    user: string;
    /** Value substituted for `{host}` in the prompt. */
    host: string;
    /** Value substituted for `{path}` in the prompt. */
    path: string;
  };

  /**
   * Content for the `about` command.
   * Each string in `paragraphs` is rendered as a separate block.
   */
  about: {
    paragraphs: string[];
  };

  /** Projects shown by the `projects` command. */
  projects: Project[];

  /** Skill categories shown by the `skills` command. */
  skills: SkillCategory[];

  /** Work history shown by the `experience` command. */
  experience: Experience[];

  /** Education shown by the `education` command. */
  education: Education[];

  /** Social links shown by the `social` and `contact` commands. */
  social: SocialLink[];

  /** Contact preferences used by `contact` and `email` commands. */
  contact: {
    /** Primary email address. Used by the `email` command (`mailto:`). */
    email: string;
    /** Optional scheduling link (Calendly, Cal.com, etc.). */
    calendarUrl?: string;
    /** Preferred contact method — influences `contact` command output ordering. */
    preferredContact: 'email' | 'linkedin' | 'twitter';
  };

  /** Path to the downloadable résumé file (relative to `public/`). */
  resumeUrl: string;

  /**
   * Fortune cookie messages for the `fortune` command.
   * Randomly selected on each invocation.
   */
  fortunes?: string[];
}

// ── Settings ───────────────────────────────────────────────────────────────

/**
 * Engine toggles for `src/config/settings.config.ts`.
 * Controls boot sequence, default theme, fonts, and UI features.
 */
export interface Settings {
  /**
   * Theme applied on first visit (before any user preference is stored).
   * Must match a `name` in `themes.config.ts`.
   */
  defaultTheme: string;
  /** Initial font size. Applied before localStorage is read. */
  defaultFontSize: 'sm' | 'md' | 'lg';
  /**
   * Show the scripted boot sequence on first visit.
   * Automatically skipped on subsequent visits and when
   * `prefers-reduced-motion` is set.
   */
  bootSequence: boolean;
  /**
   * Show the ASCII banner + help output automatically after boot
   * (or on every page load if `bootSequence` is false).
   */
  showBanner: boolean;
  /**
   * Enable typewriter animation for text output.
   * Off by default — too slow for repeat visitors.
   */
  typewriter: boolean;
}
