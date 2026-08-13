import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  to: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '1. Mechanical Curriculum',
    to: '/category/1-mechanical-curriculum',
    description: (
      <>
        Gears, forces, and simple machines, then CAD in Onshape, mechanism
        design, manufacturing processes, and hands-on DIY practice.
      </>
    ),
  },
  {
    title: '2. Electronics Curriculum',
    to: '/category/2-electronics-curriculum',
    description: (
      <>
        The hardware of the NRL robot — the Command Hub, the Controller,
        power, motors, sensors, wiring, and the wireless link between them.
      </>
    ),
  },
  {
    title: '3. Programming Curriculum',
    to: '/category/3-programming-curriculum',
    description: (
      <>
        Installing the software, understanding your hardware, and writing
        driver-controlled and fully autonomous robot programs.
      </>
    ),
  },
];

function Feature({title, to, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <Link to={to} className={styles.featureCard}>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <p className={styles.featuresIntro}>
          Three curricula, built to be worked through at your own pace — read
          them in order, or jump straight to the one your team needs.
        </p>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
