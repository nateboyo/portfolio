import PageFrame from '@/components/PageFrame';
import styles from './page.module.css';

export default function ResumePage() {
  return (
    <PageFrame title="Resume">
      <div className={styles.content}>
        <p>Highlights below — full PDF available for download.</p>

        <h3 className={styles.sectionHeader}>Experience</h3>
        <p>
          <span className={styles.jobTitle}>Founder · Creative Shore LI</span> · 2025–Present
          <br />
          Full-stack React/Node products for multiple concurrent clients. Stripe, Supabase, OAuth2, CI/CD.
        </p>
        <p>
          <span className={styles.jobTitle}>IT Analyst Intern · Jefferies Group</span> · 2023–2024
          <br />
          Enterprise data pipelines in Python/SQL — 50% productivity gain, 92% reliability.
        </p>

        <h3 className={styles.sectionHeader}>Certifications</h3>
        <p>
          <span className={styles.jobTitle}>AWS Cloud Practitioner</span> · <span className={styles.expected}>Expected 2026</span>
        </p>
        <p>
          <span className={styles.jobTitle}>Microsoft Azure Fundamentals</span> · <span className={styles.expected}>Expected 2026</span>
        </p>
        <p>
          <span className={styles.jobTitle}>YearUp</span> · Software Engineering &amp; Business Communications
        </p>

        <a
          className={styles.downloadButton}
          href="/Nathan_Garrovillas_Resume_2026.pdf"
          download
        >
          ↓ Download Full PDF
        </a>
      </div>
    </PageFrame>
  );
}
