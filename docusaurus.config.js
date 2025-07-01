// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: ' ',
  url: 'https://docs.omnity.network',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.svg',

  customFields: {
    title: '',
    titleDelimiter: '',
  },

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        // title: 'Home',
        logo: {
          alt: 'Omnity Logo',
          src: 'img/logo.svg',
        },
        items: [
          { to: '/ree', docId: 'REE/introduction', label: 'REE', position: 'left', type: 'doc' },
          { to: '/Rich-Swap', docId: 'Rich-Swap/guide', label: 'RICH SWAP', position: 'left', type: 'doc' },
          {
            type: 'doc',
            docId: 'Omnity-Hub/intro',
            position: 'left',
            label: 'OMNITY HUB',
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
