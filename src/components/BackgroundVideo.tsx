'use client';

import { usePathname } from 'next/navigation';
import styles from './BackgroundVideo.module.css';

export default function BackgroundVideo() {
  const pathname = usePathname();
  const isSubpage = pathname !== '/';

  return (
    <div
      data-testid="bg-container"
      className={`${styles.container} ${isSubpage ? styles.subpageActive : ''}`}
    >
      <video
        className={styles.video}
        src="/tlou-menu-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.overlay} />
    </div>
  );
}
