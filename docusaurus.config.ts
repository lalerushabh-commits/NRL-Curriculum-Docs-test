import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Which repository is this being built for? GitHub Actions says, via
// GITHUB_REPOSITORY ("owner/name"). Reading it means the same code deploys
// correctly to a throwaway test repository as to the real one — the Pages
// address is derived from the repository name, so hard-coding it would send
// every link on a test deployment to the wrong place.
const [owner, project] = (process.env.GITHUB_REPOSITORY ?? 'lalerushabh-commits/NRL-Curriculum-Docs').split('/');

const config: Config = {
  title: 'NRL Curriculum',
  tagline: 'Design, build, and program a competition robot with the NRL platform',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: `https://${owner}.github.io`,
  baseUrl: `/${project}/`,

  organizationName: owner,
  projectName: project,
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: `https://github.com/${owner}/${project}/tree/main/`,
          admonitions: {
            keywords: ['note', 'tip', 'info', 'warning', 'danger', 'keyidea'],
            extendDefaults: true,
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        indexDocs: true,
        docsRouteBasePath: '/',
        hashed: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'NRL Curriculum',
      logo: {
        alt: 'NRL Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Curriculum',
        },
        {
          href: 'https://nrl.theinnovationstory.com/',
          label: 'NRL Home',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Curriculum',
          items: [
            {
              label: 'How to Use This Book',
              to: '/how-to-use-this-book',
            },
            {
              label: 'Mechanical Curriculum',
              to: '/phase-1-mechanical-fundamentals/gears-and-gear-ratio',
            },
            {
              label: 'Electronics Curriculum',
              to: '/phase-1-electronics-foundations/welcome-to-nrl-electronics',
            },
            {
              label: 'Programming Curriculum',
              to: '/part-1-foundations/introduction-to-cpp',
            },
          ],
        },
        {
          title: 'NRL',
          items: [
            {
              label: 'NRL Home',
              href: 'https://nrl.theinnovationstory.com/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/lalerushabh-commits/NRL-Curriculum-Docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} NRL. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['cpp'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
