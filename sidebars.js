/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    // {type: 'autogenerated', dirName: '.'},
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
    {
      type: 'category',
      label: 'Rich-Swap', 
      items: [
        'Rich-Swap/build',
      ],
    },
    {
      type: 'category',
      label: 'REE', 
      items: [
        'REE/tutorial',
        'REE/build',
      ],
    },
  ],
};

module.exports = sidebars;
