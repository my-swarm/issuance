export const ipfsConfig = {
  protocol: process.env.IPFS_PROTOCOL || 'http',
  host: process.env.IPFS_HOST || 'localhost',
  port: parseInt(process.env.IPFS_PORT || '5001'),
};
