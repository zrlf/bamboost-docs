import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: 'Bamboost',
  tagline:
    'Bamboost is a Python library built for datamanagement using the HDF5 file format. bamboost stands for a lightweight shelf which will boost your efficiency and which will totally break if you load it heavily. Just kidding, bamboo can fully carry pandas. 🐼🐼🐼🐼',
  favicon: 'img/bamboost_icon.png',
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
      },
    },
    {
      tagName: 'script',
      attributes: {
        src: 'https://kit.fontawesome.com/534692c170.js',
        crossorigin: 'anonymous',
      },
    },
  ],

  // url: 'https://zrlf.gitlab.io',
  url: 'https://bamboost.ch',
  baseUrl: '/',

  organizationName: 'zrlf', // Usually your GitHub org/user name.
  projectName: 'bamboost-docs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    'docusaurus-plugin-sass',
    [
      './plugins/blog-plugin',
      {
        showReadingTime: true,
        id: 'news',
        routeBasePath: 'news',
        path: './blog',
      },
    ],
  ],

  themes: [],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://gitlab.com/zrlf/bamboost-docs/-/edit/master/',
          showLastUpdateTime: true,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        theme: {
          customCss: './src/scss/custom.scss',
        },
      } satisfies Preset.Options,
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/bamboost_icon.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    docs: {
      sidebar: {
        hideable: false,
      },
    },
    navbar: {
      hideOnScroll: true,
      title: 'Bamboost',
      logo: {
        alt: 'My Site Logo',
        src: 'img/bamboost_icon.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'autoDocsSidebar',
          position: 'left',
          label: 'Reference guide',
        },
        { to: '/news', label: 'News', position: 'left' },
        {
          href: 'https://gitlab.com/cmbm-ethz/bamboost',
          label: 'GitLab',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      logo: {
        alt: 'Bamboost website',
        src: 'img/bamboost_icon.png',
        href: 'https://zrlf.gitlab.io/bamboost-docs/',
        width: 80,
        height: 80,
      },
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/documentation/basics/getting_started',
            },
            {
              label: 'Installation',
              to: '/docs/documentation/basics/installation',
            },
            {
              label: 'TUI',
              to: '/docs/documentation/basics/TUI',
            },
          ],
        },
        {
          title: 'Reference guide',
          items: [
            {
              label: 'Manager',
              to: '/docs/autoDocs/manager',
            },
            {
              label: 'Simulation',
              to: '/docs/autoDocs/simulation',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} CMBM group.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.palenight,
    },
    algolia: {
      appId: 'WBL605N93C',
      indexName: 'bamboost',
      apiKey: 'a236581fafb855e2cf6009d3f8d30649',
      contextualSearch: false,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
