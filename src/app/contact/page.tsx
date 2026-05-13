import PageFrame from '@/components/PageFrame';
import { contactMethods } from '@/content/contact';
import styles from './page.module.css';

export default function ContactPage() {
  return (
    <PageFrame title="Contact">
      <div className={styles.content}>
        <p className={styles.tagline}>
          Open to remote work, full-time or contract. Reach out about a role, a project, or anything else.
        </p>
        <ul className={styles.list}>
          {contactMethods.map(m => (
            <li key={m.label} className={styles.item}>
              <a href={m.href} target="_blank" rel="noopener noreferrer" style={{ display: 'contents' }}>
                <div className={styles.icon}>{m.icon}</div>
                <div className={styles.text}>
                  <div className={styles.label}>{m.label}</div>
                  <div className={styles.value}>{m.value}</div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </PageFrame>
  );
}
