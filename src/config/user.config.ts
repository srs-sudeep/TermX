/**
 * USER-EDITABLE CONFIG — this is your portfolio's personal data.
 *
 * EDIT THIS FILE — replace every value below with your own details.
 * The terminal engine reads from this file; nothing else needs to change.
 *
 * Docs: docs/CUSTOMIZATION.md
 */

import type { UserConfig } from '@/types';

export const userConfig = {
  // ── Site metadata ──────────────────────────────────────────────────────
  meta: {
    siteName: 'Sam Reyes — Terminal Portfolio',
    siteDescription:
      'Full-stack developer who builds fast, accessible web apps. Type "help" to explore.',
    siteUrl: 'https://samreyes.dev',
    ogImage: '/og-image.png',
  },

  // ── Personal details ───────────────────────────────────────────────────
  user: {
    name: 'Sam Reyes',
    handle: 'sam',       // shown in the terminal prompt
    title: 'Full-Stack Engineer',
    location: 'San Francisco, CA',
    bio: 'I build fast, accessible web products — mostly in TypeScript, occasionally in Rust.',
    timezone: 'America/Los_Angeles',
    // avatar: '/avatar.png',  // uncomment and add your image to public/
  },

  // ── Prompt template ────────────────────────────────────────────────────
  // Tokens: {user}, {host}, {path}
  // Rendered: sam@portfolio:~$
  prompt: {
    template: '{user}@{host}:{path}$ ',
    user: 'sam',
    host: 'portfolio',
    path: '~',
  },

  // ── About ──────────────────────────────────────────────────────────────
  about: {
    paragraphs: [
      "Hey, I'm Sam — a full-stack engineer with six years of experience shipping products people actually use. I care deeply about performance, accessibility, and developer experience.",
      "I got into programming through game modding at age 14, fell in love with the web in college, and haven't looked back. These days I spend most of my time in TypeScript, React, and occasionally dip into Rust when I need something fast.",
      "Outside of work I maintain a handful of open-source tools, contribute to the Bun ecosystem, and write a sporadic blog about things I wish existed when I was learning. If you want to collaborate or just chat — my inbox is open.",
    ],
  },

  // ── Projects ───────────────────────────────────────────────────────────
  projects: [
    {
      slug: 'quill',
      name: 'Quill',
      tagline: 'A privacy-first markdown journaling app.',
      description:
        'A minimalist PWA for journaling that stores everything locally in IndexedDB. No accounts, no servers, no telemetry. Supports full markdown, daily prompts, and end-to-end encryption for cloud sync via a user-supplied S3 bucket.',
      tech: ['React', 'TypeScript', 'IndexedDB', 'PWA', 'Web Crypto API'],
      links: {
        live: 'https://quill.samreyes.dev',
        repo: 'https://github.com/samreyes/quill',
      },
      featured: true,
      year: 2024,
    },
    {
      slug: 'nexus',
      name: 'Nexus',
      tagline: 'Aggregate your dev services into one dashboard.',
      description:
        'A browser extension + optional local proxy that pulls data from GitHub, Linear, Vercel, and PagerDuty into a single command-palette interface. Keyboard-first — never touch a sidebar again.',
      tech: ['TypeScript', 'Svelte', 'WebExtensions API', 'REST', 'Node.js'],
      links: {
        repo: 'https://github.com/samreyes/nexus',
        demo: 'https://www.youtube.com/watch?v=demo_nexus',
      },
      featured: true,
      year: 2024,
    },
    {
      slug: 'wavelength',
      name: 'Wavelength',
      tagline: 'Music recommendations that actually match your taste.',
      description:
        'A Spotify companion that builds a taste graph from your listening history and recommends tracks using cosine similarity on audio features. No ML framework — just math and the Web Audio API.',
      tech: ['Next.js', 'TypeScript', 'Spotify API', 'D3.js', 'Vercel'],
      links: {
        live: 'https://wavelength.samreyes.dev',
        repo: 'https://github.com/samreyes/wavelength',
      },
      featured: false,
      year: 2023,
    },
    {
      slug: 'drift',
      name: 'Drift',
      tagline: 'Lightweight reactive state for framework-agnostic UIs.',
      description:
        'A ~1 KB state management library with no dependencies. Uses Proxy traps for fine-grained reactivity without virtual DOM diffing. Includes a React adapter and a Svelte adapter. Written in pure TypeScript with a full test suite.',
      tech: ['TypeScript', 'Proxy API', 'Vitest', 'Rollup'],
      links: {
        live: 'https://drift.samreyes.dev/docs',
        repo: 'https://github.com/samreyes/drift',
      },
      featured: true,
      year: 2023,
    },
  ],

  // ── Skills ─────────────────────────────────────────────────────────────
  skills: [
    {
      name: 'Languages',
      items: [
        { name: 'TypeScript', level: 5 },
        { name: 'JavaScript', level: 5 },
        { name: 'Python', level: 4 },
        { name: 'Rust', level: 3 },
        { name: 'SQL', level: 3 },
        { name: 'Bash', level: 3 },
      ],
    },
    {
      name: 'Frontend',
      items: [
        { name: 'React', level: 5 },
        { name: 'Next.js', level: 4 },
        { name: 'TailwindCSS', level: 5 },
        { name: 'Framer Motion', level: 4 },
        { name: 'Svelte', level: 3 },
        { name: 'WebGL / Three.js', level: 2 },
      ],
    },
    {
      name: 'Tooling & Infra',
      items: [
        { name: 'Git', level: 5 },
        { name: 'Vite / Bun', level: 5 },
        { name: 'Docker', level: 4 },
        { name: 'GitHub Actions', level: 4 },
        { name: 'Vercel / Cloudflare', level: 4 },
        { name: 'PostgreSQL', level: 3 },
      ],
    },
  ],

  // ── Experience ─────────────────────────────────────────────────────────
  experience: [
    {
      company: 'Meridian Labs',
      role: 'Senior Frontend Engineer',
      start: '2022-06',
      end: 'present',
      location: 'San Francisco, CA (Remote)',
      bullets: [
        'Led migration of a 4-year-old Create React App codebase to Vite + React 18, cutting build times from 4 min to 18 s and CI costs by 40 %.',
        'Designed and shipped a component library (60+ components, full a11y coverage) used across 3 product teams.',
        'Mentored two junior engineers from onboarding to shipping independently within 3 months each.',
        'Introduced Vitest and drove unit test coverage from 12 % to 74 % on the core modules.',
      ],
    },
    {
      company: 'Sprout Systems',
      role: 'Software Developer',
      start: '2019-09',
      end: '2022-05',
      location: 'Austin, TX',
      bullets: [
        'Built a real-time collaboration layer for a SaaS form builder using Yjs + WebSockets, supporting up to 50 concurrent editors per document.',
        'Rewrote the public REST API client from plain fetch to a typed SDK, reducing bug reports related to API usage by 60 %.',
        'Delivered customer-facing dashboard features end-to-end: design handoff → backend endpoint → React UI → analytics.',
      ],
    },
  ],

  // ── Education ──────────────────────────────────────────────────────────
  education: [
    {
      institution: 'University of Texas at Austin',
      degree: 'B.S. Computer Science',
      start: '2015',
      end: '2019',
      details: 'Focus on Human-Computer Interaction and Distributed Systems. Dean\'s List, 2017–2019.',
    },
  ],

  // ── Social ─────────────────────────────────────────────────────────────
  social: [
    {
      name: 'GitHub',
      handle: '@samreyes',
      url: 'https://github.com/samreyes',
      icon: 'github',
    },
    {
      name: 'LinkedIn',
      handle: 'sam-reyes-dev',
      url: 'https://linkedin.com/in/sam-reyes-dev',
      icon: 'linkedin',
    },
    {
      name: 'Twitter / X',
      handle: '@samreyes_dev',
      url: 'https://twitter.com/samreyes_dev',
      icon: 'twitter',
    },
    {
      name: 'Blog',
      handle: 'samreyes.dev/blog',
      url: 'https://samreyes.dev/blog',
      icon: 'rss',
    },
  ],

  // ── Contact ────────────────────────────────────────────────────────────
  contact: {
    email: 'hello@samreyes.dev',
    calendarUrl: 'https://cal.com/samreyes/30min',
    preferredContact: 'email',
  },

  // ── Resume ─────────────────────────────────────────────────────────────
  // Place your PDF at public/resume.pdf and point to it here.
  resumeUrl: '/resume.pdf',

  // ── Fortunes ───────────────────────────────────────────────────────────
  // Shown by the `fortune` command. Add as many as you like.
  fortunes: [
    'First, solve the problem. Then, write the code. — John Johnson',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand. — Martin Fowler',
    'Programs must be written for people to read, and only incidentally for machines to execute. — Harold Abelson',
    'The most disastrous thing you can ever learn is your first programming language. — Alan Kay',
    'Simplicity is a great virtue, but it requires hard work to achieve it and education to appreciate it. — Edsger Dijkstra',
    'The best way to predict the future is to invent it. — Alan Kay',
    'Make it work, make it right, make it fast. In that order. — Kent Beck',
  ],
} satisfies UserConfig;
