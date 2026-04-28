import type { UserConfig } from '@/types';

export const userConfig = {
  meta: {
    siteName: 'Sudeep Ranjan Sahoo | iamsrs',
    siteDescription:
      'Creative Developer & Consultant focused on AI engineering, cloud architecture, and scalable enterprise software.',
    siteUrl: 'https://www.iamsrs.com',
    ogImage: '/og-image.png',
  },

  user: {
    name: 'Sudeep Ranjan Sahoo',
    handle: 'srs',
    title: 'Business Architecture Analyst | AI Engineering & Cloud Architecture',
    location: 'Tokyo, Japan',
    bio: 'Computer Science engineer building AI-first systems, cloud-native architecture, and high-performance full-stack products.',
    timezone: 'Asia/Tokyo',
  },

  prompt: {
    template: '{user}@{host}:{path}$ ',
    user: 'srs',
    host: 'iamsrs',
    path: '~',
  },

  about: {
    paragraphs: [
      'I am a Computer Science engineer passionate about AI engineering, cloud infrastructure, and full-stack web development. I enjoy solving hard technical problems from product architecture to deployment.',
      'I currently work at Accenture Japan as a Business Architecture Analyst, where I focus on ERP systems, AI applications, and cloud-native architecture from requirements and design through delivery.',
      'I build end-to-end products across web, AI, and systems: from interactive Next.js experiences and distributed applications to government-scale education and healthcare platforms. Outside work, I am learning Japanese, playing badminton, and writing long-form technical essays.',
    ],
  },

  projects: [
    {
      slug: 'azure-devops-lifecycle',
      name: 'Azure DevOps Lifecycle',
      tagline: 'Massive-scale ingestion pipelines for enterprise workloads.',
      description:
        'Architected fault-tolerant ingestion pipelines handling millions of requests per minute with low latency, infrastructure-as-code, and resilient CI/CD delivery.',
      tech: ['Azure', 'Terraform', 'CI/CD', 'Docker'],
      links: {
        live: 'https://www.iamsrs.com/work/azure-devops',
      },
      featured: true,
      year: 2026,
    },
    {
      slug: 'distributed-web-app',
      name: 'Distributed Web App',
      tagline: 'Edge-first global app with zero-downtime deploys.',
      description:
        'Led development of a globally distributed web application supporting thousands of concurrent users with edge architecture and production-grade reliability.',
      tech: ['Next.js', 'Node.js', 'Edge Runtime'],
      links: {
        live: 'https://www.iamsrs.com/work/distributed-web-app',
      },
      featured: true,
      year: 2026,
    },
    {
      slug: 'project-vsk',
      name: 'Project VSK',
      tagline: 'Bilingual voice-first AI for statewide education.',
      description:
        'Built a ChatGPT-like AI agent with Hindi/English support and voice navigation to digitize public education workflows at state scale.',
      tech: ['Python', 'LangChain', 'OpenAI', 'React', 'Node.js'],
      links: {
        live: 'https://www.iamsrs.com/work/project-vsk',
      },
      featured: true,
      year: 2025,
    },
    {
      slug: 'raytracer-studio',
      name: 'RayTracer Studio',
      tagline: 'CPU ray tracer in browser via WebAssembly.',
      description:
        'Developed a C++ ray tracing core compiled with Emscripten to WebAssembly, paired with a React + Vite control studio for interactive rendering and documentation.',
      tech: ['C++', 'WebAssembly', 'Emscripten', 'React', 'Vite'],
      links: {
        live: 'https://www.iamsrs.com/work/cpp-ray-tracing',
        repo: 'https://github.com/srs-sudeep/rayTracing',
      },
      featured: true,
      year: 2025,
    },
    {
      slug: 'seamless-campus',
      name: 'Seamless Campus',
      tagline: 'Unified smart-card campus automation platform.',
      description:
        'Built automation for IIT Bhilai with attendance, transactions, access control, and operational dashboards powered by smart card and RFID infrastructure.',
      tech: ['React', 'Node.js', 'NFC/RFID', 'PostgreSQL', 'Redis'],
      links: {
        live: 'https://www.iamsrs.com/work/seamless-campus',
      },
      featured: true,
      year: 2024,
    },
    {
      slug: 'termx',
      name: 'TermX',
      tagline: 'Terminal-emulator portfolio, fully data-driven.',
      description:
        'A terminal-style portfolio built with React, TypeScript, and Vite. Features 14 themes, oh-my-zsh-inspired powerline prompt, ghost-text autocomplete, command history, boot sequence, and a Matrix-rain easter egg.',
      tech: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Zustand', 'Vitest'],
      links: {
        live: 'https://termx.vercel.app/',
        repo: 'https://github.com/srs-sudeep/Termx',
        demo: 'https://youtu.be/-oJOWGoLEAc',
      },
      featured: true,
      year: 2026,
    },
  ],

  skills: [
    {
      name: 'Languages',
      items: [
        { name: 'TypeScript', level: 5 },
        { name: 'Python', level: 5 },
        { name: 'C++', level: 5 },
        { name: 'JavaScript', level: 4 },
        { name: 'Rust', level: 3 },
        { name: 'Go', level: 3 },
        { name: 'SQL', level: 4 },
      ],
    },
    {
      name: 'Frontend & Interactive',
      items: [
        { name: 'React', level: 5 },
        { name: 'Next.js', level: 5 },
        { name: 'TailwindCSS', level: 5 },
        { name: 'Framer Motion', level: 5 },
        { name: 'GSAP', level: 4 },
        { name: 'WebGL / Three.js', level: 4 },
        { name: 'Figma', level: 3 },
      ],
    },
    {
      name: 'Cloud, AI & Infrastructure',
      items: [
        { name: 'Azure', level: 5 },
        { name: 'AWS', level: 4 },
        { name: 'Kubernetes', level: 4 },
        { name: 'Docker', level: 4 },
        { name: 'Terraform', level: 4 },
        { name: 'LangChain', level: 4 },
        { name: 'PyTorch', level: 4 },
      ],
    },
  ],

  experience: [
    {
      company: 'Accenture Japan',
      role: 'Business Architecture Analyst',
      start: '2025-12',
      end: 'present',
      location: 'Tokyo, Japan',
      bullets: [
        'Delivering ERP and AI application architecture from discovery to implementation.',
        'Driving cloud-native design decisions across enterprise workflows and integrations.',
        'Combining business architecture with deep technical implementation across full-stack systems.',
      ],
    },
    {
      company: 'IIT Bhilai Innovation & Technology Foundation (IBITF)',
      role: 'Project Engineer — Project Seamless',
      start: '2025-06',
      end: '2025-10',
      location: 'Bhilai, India',
      bullets: [
        'Built smart-campus systems covering access control, biometrics, attendance, and analytics.',
        'Shipped AWS-backed services and operational React tooling for daily campus operations.',
      ],
    },
    {
      company: 'Recogx Init',
      role: 'Co-founder',
      start: '2023',
      end: '2025',
      location: 'India',
      bullets: [
        'Built accessibility and automation products including Divyang ATM and campus systems.',
        'Received Rising Star recognition for impact across energy, accessibility, and student development initiatives.',
      ],
    },
    {
      company: 'Enview Technologies',
      role: 'Software Engineering Intern',
      start: '2024-05',
      end: '2024-07',
      location: 'India',
      bullets: [
        'Worked across backend services, performance tuning, and computer vision pipelines.',
        'Shipped production features for industry-facing clients with Python and Rust workflows.',
      ],
    },
  ],

  education: [
    {
      institution: 'Indian Institute of Technology, Bhilai',
      degree: 'B.Tech — Computer Science & Engineering',
      start: '2021-11',
      end: '2025-06',
      details: "CGPA: 9.28. Director's Gold Medallist.",
    },
    {
      institution: 'SAI International School',
      degree: '12th Class — Science (CBSE)',
      start: '2019-04',
      end: '2021-03',
      details: 'Score: 98.2%.',
    },
    {
      institution: 'Kendriya Vidyalaya',
      degree: '10th Class (CBSE)',
      start: '2018',
      end: '2019',
      details: 'Score: 99%.',
    },
  ],

  social: [
    {
      name: 'GitHub',
      handle: '@srs-sudeep',
      url: 'https://github.com/srs-sudeep',
      icon: 'github',
    },
    {
      name: 'LinkedIn',
      handle: 'sudeep-ranjan-sahoo-b82355232',
      url: 'https://www.linkedin.com/in/sudeep-ranjan-sahoo-b82355232/',
      icon: 'linkedin',
    },
    {
      name: 'Twitter / X',
      handle: '@SUDEEPRANJANSA1',
      url: 'https://x.com/SUDEEPRANJANSA1',
      icon: 'twitter',
    },
    {
      name: 'Medium',
      handle: '@srsdevka',
      url: 'https://medium.com/@srsdevka',
      icon: 'rss',
    },
  ],

  contact: {
    email: 'sudeep160403@gmail.com',
    calendarUrl: 'https://www.iamsrs.com/contact',
    preferredContact: 'email',
  },

  resumeUrl: '/resume.pdf',

  fortunes: [
    'Build it once, scale it forever.',
    'Architecture is strategy made executable.',
    'Cloud is not a destination. It is an operating model.',
    'AI delivers value only when it ships to real users.',
    'Ship with intent. Iterate with data.',
    'Elegance in systems is measured in resilience.',
    'From concept to deployment: close the loop.',
  ],
} satisfies UserConfig;
