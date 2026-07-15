module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@app': './src/app',
          '@core': './src/core',
          '@modules': './src/modules',
          '@features': './src/features',
          '@shared': './src/shared',
          '@infrastructure': './src/infrastructure',
        },
      },
    ],
    // Decision: Reanimated plugin must be listed last.
    'react-native-reanimated/plugin',
  ],
};
