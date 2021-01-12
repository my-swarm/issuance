module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-env': {
          targets: '> 1%, not dead',
        },
      },
    ],
  ],
  plugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'lib',
      },
      'import-antd',
    ],
  ],
  env: {
    development: {
      presets: [
        [
          'next/babel',
          {
            'preset-env': {
              targets: {
                browsers: 'last 2 chrome versions',
              },
            },
          },
        ],
      ],
    },
  },
};
