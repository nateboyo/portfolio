import PageFrame from '@/components/PageFrame';
import styles from './page.module.css';

const SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Supabase',
  'AWS', 'Vercel', 'Stripe', 'OAuth2', 'Docker', 'GraphQL',
] as const;

export default function AboutPage() {
  return (
    <PageFrame title="About">
      <div className={styles.content}>
        <p>
          Full-stack engineer who builds and ships real products end-to-end — from React frontends and REST/GraphQL APIs to PostgreSQL backends, auth systems, and CI/CD deployments.
        </p>
        <p>
          Background in enterprise-scale data engineering at Jefferies Group and direct client product delivery through Creative Shore LI. Comfortable in fast-moving environments, remote workflows, and communicating clearly across technical and non-technical stakeholders.
        </p>
        <p>Based in Bay Shore, NY. Available immediately. Open to remote.</p>
        <div className={styles.skills}>
          {SKILLS.map(s => <span key={s} className={styles.skill}>{s}</span>)}
        </div>
      </div>
    </PageFrame>
  );
}
