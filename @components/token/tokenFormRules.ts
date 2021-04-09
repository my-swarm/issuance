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
      message: "Enter your token's decimals.",
    },
  ],
  image: [],
  description: [],

  allowTransferRules: [],
  allowAccountFreeze: [],
  allowContractFreeze: [],
  allowForceTransfer: [],
  allowBurn: [],
  allowMint: [],

  assetName: [
    {
      required: true,
      message: 'Give your asset a name',
    },
  ],
  nav: [
    {
      required: true,
      message: `Enter your asset's net value`,
    },
  ],
  assetNavDocument: [],
  assetDescription: [],
  assetImage: [],
  assetLegalDocuments: [],
};
