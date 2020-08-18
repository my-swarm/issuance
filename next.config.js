// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const withSourceMaps = require('@zeit/next-source-maps');

module.exports = withSourceMaps({
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));

    return config;
  },
});
``;
