const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

export const tokenFeatures = {
  allowAccountFreeze: 'Allow Account Freeze',
  allowContractFreeze: 'Allow Contract Freeze',
  allowForceTransfer: 'Allow Force Transfer',
  allowBurn: 'Allow Burn',
  allowMint: 'Allow Mint',
};

export const FORM = {
  layout,
  tailLayout,
  acceptImage: 'application/png,application/jpeg',
  acceptDocument: 'application/png,application/jpeg', // todo: change this
  maxImageSize: '2MB',
  maxDocumentSize: '2MB',
};
