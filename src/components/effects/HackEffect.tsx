import { useEffect, useState } from 'react';

const HACK_LINES = [
  'Initializing exploit framework...',
  'Scanning target: 192.168.1.1',
  '> SYN sent → SYN-ACK received',
  'SSH handshake complete.',
  'Enumerating: /etc/shadow',
  '> root:$6$rnd5000$VExoNJ...:0:0::/',
  'Cracking hash with rockyou.txt...',
  '...............................',
  '> Password recovered: hunter2',
  'Escalating privileges via CVE-2024-XXXX...',
  '# whoami',
  '> root',
  'Exfiltrating /home/user/secrets.tar.gz',
  '  [=====>             ] 37%',
  '  [===========>       ] 68%',
  '  [==================>] 100%',
  'Transfer complete. 4.2 GB uploaded.',
  'Removing logs: /var/log/auth.log',
  'Covering tracks...',
  '',
  'You have been h4ck3d. Just kidding. 😄',
];

export default function HackEffect() {
  const [visible, setVisible] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < HACK_LINES.length) {
        const line = HACK_LINES[idx++];
        setVisible((prev) => [...prev, line]);
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <pre className="text-[var(--success)] font-mono text-sm leading-snug whitespace-pre-wrap">
      {visible.join('\n')}
      {!done && <span className="animate-pulse">▮</span>}
    </pre>
  );
}
