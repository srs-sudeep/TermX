import type { Command, ListItem } from '@/types';

export default {
  name: 'contact',
  description: 'Get in touch with me',
  usage: 'contact',
  category: 'portfolio',
  execute: (ctx) => {
    const { contact, social } = ctx.config;

    const items: ListItem[] = [
      { label: 'Contact', indent: 0 },
      { label: 'Email', value: contact.email, url: `mailto:${contact.email}`, indent: 1 },
    ];

    if (contact.calendarUrl) {
      items.push({
        label: 'Schedule a call',
        value: contact.calendarUrl,
        url: contact.calendarUrl,
        indent: 1,
      });
    }

    const preferred = social.find(
      (s) => s.name.toLowerCase() === contact.preferredContact,
    );
    if (preferred) {
      items.push({
        label: preferred.name,
        value: preferred.handle,
        url: preferred.url,
        indent: 1,
      });
    }

    items.push(
      { label: 'Tip', indent: 0 },
      {
        label: 'social',
        value: '— run `social` to see all my profiles',
        indent: 1,
      },
      {
        label: 'email',
        value: '— run `email` to open your mail client directly',
        indent: 1,
      },
    );

    return { type: 'list', items };
  },
} satisfies Command;
