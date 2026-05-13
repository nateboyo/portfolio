'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MainMenu.module.css';

const items = [
  { href: '/', label: 'Nathan Garrovillas' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About Me' },
  { href: '/resume', label: 'Resume' },
  { href: '/contact', label: 'Contact' },
] as const;

export default function MainMenu() {
  const pathname = usePathname();
  const isHidden = pathname !== '/';

  return (
    <nav className={`${styles.menu} ${isHidden ? styles.hidden : ''}`}>
      {items.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`${styles.item} ${isActive ? styles.active : ''}`}
          >
            {label}
          </Link>
        );
      })}
      <p className={styles.tagline}>
        Full-stack engineer · React · TypeScript · Node.js
      </p>
    </nav>
  );
}
