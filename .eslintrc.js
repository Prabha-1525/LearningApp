module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:import/typescript'],
  plugins: ['import'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
  },
  rules: {
    'import/no-duplicates': 'warn',
  },
  overrides: [
    {
      files: [
        'src/core/domain/**/*.{ts,tsx}',
        'src/features/*/domain/**/*.{ts,tsx}',
      ],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: [
                  'react',
                  'react-native',
                  'react-native-*',
                  '@react-navigation/*',
                ],
                message:
                  'Domain must stay framework-free. Depend only on shared/lib and pure TypeScript.',
              },
              {
                group: ['firebase', '@firebase/*', '@react-native-firebase/*'],
                message: 'Domain must not import Firebase. Use a port instead.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['src/features/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@features/*'],
                message:
                  'Features must not import other features. Share via @shared or @core contracts.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['src/core/**/*.{ts,tsx}'],
      excludedFiles: ['src/core/domain/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@features/*'],
                message:
                  'Core must not import feature internals. Compose features only via @modules registry.',
              },
            ],
          },
        ],
      },
    },
  ],
};
