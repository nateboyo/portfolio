'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './PageFrame.module.css';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function PageFrame({ title, children }: Props) {
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') router.push('/');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);

  return (
    <section className={styles.frame}>
      <div className={styles.breadcrumb}>
        <button className={styles.back} onClick={() => router.push('/')}>
          ← Back
        </button>
        <span className={styles.sep}>·</span>
        <span className={styles.current}>{title}</span>
      </div>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </section>
  );
}
