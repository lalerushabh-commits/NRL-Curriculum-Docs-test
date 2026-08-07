import React, {type ReactNode} from 'react';
import styles from './styles.module.css';

export interface YouTubeEmbedProps {
  /** A single video's ID (the part after v= or after youtu.be/). */
  id?: string;
  /** A playlist ID (the part after list= in a playlist URL). */
  listId?: string;
  /** Accessible title, also shown as the iframe title attribute. */
  title: string;
  /** Optional caption rendered under the embed. */
  caption?: ReactNode;
}

export default function YouTubeEmbed({id, listId, title, caption}: YouTubeEmbedProps): ReactNode {
  const src = listId
    ? `https://www.youtube-nocookie.com/embed/videoseries?list=${listId}`
    : `https://www.youtube-nocookie.com/embed/${id}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.aspectBox}>
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
}
