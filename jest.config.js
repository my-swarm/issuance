// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', '@lib', '@app'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '@contracts': path.resolve(`${__dirname}/@contracts`),
    '@types': path.resolve(`${__dirname}/@types`),
    '@lib': path.resolve(`${__dirname}/@lib`),
    '@lib/(.*)': path.resolve(`${__dirname}/@lib/$1`),
    '@app': path.resolve(`${__dirname}/@app`),
    '@const': path.resolve(`${__dirname}/@const`),
    '@app/(.*)': path.resolve(`${__dirname}/@app/$1`),
  },
};
