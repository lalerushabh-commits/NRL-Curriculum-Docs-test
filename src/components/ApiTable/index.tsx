import React, {type ReactNode} from 'react';
import styles from './styles.module.css';

export interface ApiRow {
  /** Method / member signature, e.g. "setSpeed(int speed)" */
  member: string;
  /** What it does. */
  description: ReactNode;
  /** Optional params/return note shown as a smaller secondary line. */
  detail?: ReactNode;
}

export default function ApiTable({rows}: {rows: ApiRow[]}): ReactNode {
  return (
    <table className={styles.apiTable}>
      <thead>
        <tr>
          <th>Member</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <td>
              <code>{row.member}</code>
            </td>
            <td>
              {row.description}
              {row.detail && <div className={styles.detail}>{row.detail}</div>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
