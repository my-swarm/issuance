// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', '@lib'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '@lib': path.resolve(`${__dirname}/@lib`),
    '@types': path.resolve(`${__dirname}/@types`),
    '@lib/(.*)': path.resolve(`${__dirname}/@lib/$1`),
  },
};
