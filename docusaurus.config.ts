import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

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

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        highlightSearchTermsOnTargetPage: true,
        removeDefaultStemmer: false,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://gitlab.com/zrlf/bamboost-docs/-/edit/master/',
          showLastUpdateTime: true,
        },
        // blog: {
        //   showReadingTime: true,
        //   //   "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        // },
        blog: false,
        theme: {
          customCss: './src/scss/custom.scss',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/bamboost_icon.png',
    docs: {
      sidebar: {
        hideable: false,
      },
    },
    navbar: {
      hideOnScroll: false,
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
              label: 'Tutorial',
              to: '/docs/documentation/intro',
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
  } satisfies Preset.ThemeConfig,
};

export default config;
