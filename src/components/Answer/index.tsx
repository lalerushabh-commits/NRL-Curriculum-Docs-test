import React, {type ReactNode} from 'react';
import styles from './styles.module.css';

/** A collapsible "Reveal the answer" spoiler for practice-exercise answers. */
export default function Answer({children}: {children: ReactNode}): ReactNode {
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>Reveal the answer</summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
