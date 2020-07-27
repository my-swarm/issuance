// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));

    // config.resolve.alias['components'] = path.resolve(__dirname, 'components');
    // config.resolve.alias['@help'] = path.resolve(__dirname, '@help');
    // config.resolve.alias['@lib'] = path.resolve(__dirname, '@lib');
    // config.resolve.alias['@const'] = path.resolve(__dirname, '@const');
    // config.resolve.alias['@types'] = path.resolve(__dirname, '@types');
    // config.resolve.alias['@app'] = path.resolve(__dirname, '@app');

    return config;
  },
};
``;
