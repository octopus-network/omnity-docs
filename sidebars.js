/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'REE',
      items: [
        {
          type: 'category',
          label: 'REE Dev Guide',
          items: [
            'REE/introduction',
            'REE/core-concepts',
            'REE/first-exchange',
            'REE/state-management',
            'REE/next-steps',
          ],
          collapsed: false,
        },
        {
          type: 'category',
          label: 'REE Workshop',
          items: [
            'REE/game-demo',
          ],
          collapsed: false,
        },
        'REE/apis',

      ],
    },
    {
      type: 'category',
      label: 'Rich-Swap',
      items: [
        'Rich-Swap/apis',
      ],
    },
    {
      type: 'category',
      label: 'Omnity-Hub',
      items: [
        'Omnity-Hub/intro',
        'Omnity-Hub/evm',
        'Omnity-Hub/runes_indexer',
        'Omnity-Hub/runes',
        'Omnity-Hub/icp_icrc',
        'Omnity-Hub/cosmwasm',
        'Omnity-Hub/solana_settlement',
        'Omnity-Hub/solana_execution',
        'Omnity-Hub/dogecoin',
        'Omnity-Hub/ton',
        'Omnity-Hub/explorer',
        'Omnity-Hub/faq',
        'Omnity-Hub/references',
      ],
    },
  ],
};

module.exports = sidebars;
