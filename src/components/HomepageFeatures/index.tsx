import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Foundations & Setup',
    description: (
      <>
        What the NRL platform is, just enough C++ to read every example, and
        getting your tools, hardware, and first project up and running.
      </>
    ),
  },
  {
    title: 'Programming the Robot',
    description: (
      <>
        One short chapter per building block — motors, driving, servos, the
        gamepad, the IMU, telemetry, the LED, the OLED, and power.
      </>
    ),
  },
  {
    title: 'Autonomous & Reference',
    description: (
      <>
        Write robots that drive themselves, then lean on worked examples, a
        troubleshooting guide, and an API cheat-sheet when you're building.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
