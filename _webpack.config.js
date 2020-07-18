const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'components'),
      '@help': path.resolve(__dirname, 'help'),
      '@lib': path.resolve(__dirname, 'lib'),
      '@const': path.resolve(__dirname, 'const'),
      '@types': path.resolve(__dirname, 'const'),
    },
  },
};
