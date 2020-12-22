export const tokenFormRules = {
  name: [
    {
      required: true,
      message: 'Enter the token name',
    },
  ],
  symbol: [
    {
      required: true,
      message: 'Enter the token symbol',
    },
    {
      pattern: /[A-Z0-9]{3,5}/,
      message: `Enter 3-5 uppercase token symbol`,
    },
  ],
  decimals: [
    {
      required: true,
      message: 'Enter your token decimals. 18 is the sweet spot value',
    },
  ],
  image: [],
  description: [],

  transferRestrictionsType: [
    {
      required: true,
      message: 'Select transfer restriction type',
    },
  ],

  allowAccountFreeze: [],
  allowContractFreeze: [],
  allowForceTransfer: [],
  allowBurn: [],
  allowMint: [],

  assetName: [],
  assetNetValue: [],
  assetNavDocument: [],
  assetDescription: [],
  assetImage: [],
  assetLegalDocuments: [],
};
