// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const withSourceMaps = require('@zeit/next-source-maps');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

module.exports = withBundleAnalyzer(
  withSourceMaps({
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Note: we provide webpack above so you should not `require` it
      // Perform customizations to webpack config
      // Important: return the modified config
      config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));
      config.plugins.push(new AntdDayjsWebpackPlugin());
      config.resolve.alias = {
        ...config.resolve.alias,
        '@ant-design/icons$': path.resolve(__dirname, '@lib/icons.tsx'),
      };

      return config;
    },
  }),
);
``;
