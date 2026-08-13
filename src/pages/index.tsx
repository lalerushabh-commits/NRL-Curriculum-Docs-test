import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <span className={clsx('nrl-badge', styles.heroBadge)}>
          Self-paced · Student-driven
        </span>
        <Heading as="h1" className={styles.heroTitle}>
          Learn to build <span className={styles.heroAccent}>what&apos;s next.</span>
        </Heading>
        <p className={styles.heroTagline}>{siteConfig.tagline}</p>
        <p className={styles.heroSubtext}>
          No instructor required — work through it on your own schedule, at
          your own pace, in the order your team needs it.
        </p>
        <div className={styles.buttons}>
          <Link
            className={clsx('button button--lg', styles.ctaButton)}
            to="/how-to-use-this-book">
            Start Reading
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Design, build, and program a competition robot with the NRL platform.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
