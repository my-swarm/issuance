// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', '@lib', '@app'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '@contracts': path.resolve(`${__dirname}/@contracts`),
    '@lib': path.resolve(`${__dirname}/@lib`),
    '@lib/(.*)': path.resolve(`${__dirname}/@lib/$1`),
    '@app': path.resolve(`${__dirname}/@app`),
    '@app/(.*)': path.resolve(`${__dirname}/@app/$1`),
  },
};
