'use client';

import { useState } from 'react';
import { projects, type Project } from '@/content/projects';
import styles from './ProjectSwitcher.module.css';

export default function ProjectSwitcher() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = projects[selectedIdx]!;

  return (
    <div className={styles.grid}>
      <ul className={styles.list}>
        {projects.map((p, i) => (
          <li
            key={p.name}
            className={`${styles.listItem} ${i === selectedIdx ? styles.active : ''}`}
            onClick={() => setSelectedIdx(i)}
          >
            {p.name}
            {p.inProgress && <span className={styles.wip}>— IN PROGRESS</span>}
          </li>
        ))}
      </ul>
      <ProjectDetail project={selected} />
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className={styles.detail}>
      <div className={`${styles.image} ${project.inProgress ? styles.imageInProgress : ''}`}>
        {project.inProgress ? (
          <>
            <div className={styles.wipLabel}>IN PROGRESS</div>
            <div className={styles.wipSub}>Screenshot coming soon</div>
          </>
        ) : (
          <img src={project.image} alt={project.name} />
        )}
      </div>
      <h2 className={styles.name}>{project.name}</h2>
      <div className={styles.stack}>{project.stack}</div>
      <p className={styles.desc}>{project.desc}</p>
      <div className={styles.links}>
        {!project.noLive && project.liveUrl && (
          <a className={styles.linkButton} href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            View Live
          </a>
        )}
        {project.githubUrl && (
          <a className={styles.linkButton} href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}
