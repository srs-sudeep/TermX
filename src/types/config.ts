export interface Project {
  slug: string;

  name: string;

  description: string;

  tagline?: string;

  tech: string[];

  links: {
    live?: string;
    repo?: string;
    demo?: string;
  };

  featured?: boolean;

  year: number;
}

export interface Skill {
  name: string;

  level?: 1 | 2 | 3 | 4 | 5;
}

export interface SkillCategory {
  name: string;

  items: Skill[];
}

export interface Experience {
  company: string;

  role: string;

  start: string;

  end: string;

  location?: string;

  bullets: string[];
}

export interface Education {
  institution: string;

  degree: string;

  start: string;

  end: string;

  details?: string;
}

export interface SocialLink {
  name: string;

  handle: string;

  url: string;

  icon?: string;
}

export interface UserConfig {
  meta: {
    siteName: string;

    siteDescription: string;

    siteUrl: string;

    ogImage?: string;
  };

  user: {
    name: string;

    handle: string;

    title: string;

    location: string;

    bio: string;

    timezone: string;

    avatar?: string;
  };

  prompt: {
    template: string;

    user: string;

    host: string;

    path: string;
  };

  about: {
    paragraphs: string[];
  };

  projects: Project[];

  skills: SkillCategory[];

  experience: Experience[];

  education: Education[];

  social: SocialLink[];

  contact: {
    email: string;

    calendarUrl?: string;

    preferredContact: 'email' | 'linkedin' | 'twitter';
  };

  resumeUrl: string;

  fortunes?: string[];
}

export interface Settings {
  defaultTheme: string;

  defaultFontSize: 'sm' | 'md' | 'lg';

  bootSequence: boolean;

  showBanner: boolean;

  typewriter: boolean;
}
