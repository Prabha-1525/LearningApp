/**
 * react-native-tts still ships jcenter() + ancient AGP assumptions.
 * Modern Gradle removed jcenter(), so we overlay a fixed build.gradle after install.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const target = path.join(
  root,
  'node_modules',
  'react-native-tts',
  'android',
  'build.gradle',
);
const source = path.join(
  root,
  'patches',
  'react-native-tts.android.build.gradle',
);

if (!fs.existsSync(source)) {
  console.warn('[patch-tts] Missing patch source:', source);
  process.exit(0);
}

if (!fs.existsSync(target)) {
  console.warn('[patch-tts] react-native-tts not installed; skip');
  process.exit(0);
}

fs.copyFileSync(source, target);
console.log('[patch-tts] Applied modern Gradle fix for react-native-tts');
