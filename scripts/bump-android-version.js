const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../package.json');
const gradlePath = path.resolve(__dirname, '../android/app/build.gradle');

function bumpVersion() {
  // 1. Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const currentPkgVersion = packageJson.version || '1.0.0';

  // Increment patch version (e.g. 1.0.0 -> 1.0.1)
  const versionParts = currentPkgVersion
    .split('.')
    .map(num => parseInt(num, 10) || 0);
  while (versionParts.length < 3) {
    versionParts.push(0);
  }
  versionParts[2] += 1;
  const newPkgVersion = versionParts.join('.');
  packageJson.version = newPkgVersion;

  // 2. Read build.gradle
  let gradleContent = fs.readFileSync(gradlePath, 'utf8');

  // Match versionCode
  const versionCodeMatch = gradleContent.match(/versionCode\s+(\d+)/);
  if (!versionCodeMatch) {
    console.error('❌ Could not find versionCode in build.gradle');
    process.exit(1);
  }

  const currentVersionCode = parseInt(versionCodeMatch[1], 10);
  const newVersionCode = currentVersionCode + 1;

  // Replace versionCode
  gradleContent = gradleContent.replace(
    /versionCode\s+\d+/,
    `versionCode ${newVersionCode}`,
  );

  // Replace versionName
  gradleContent = gradleContent.replace(
    /versionName\s+"[^"]+"/,
    `versionName "${newPkgVersion}"`,
  );

  // Write changes
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
    'utf8',
  );
  fs.writeFileSync(gradlePath, gradleContent, 'utf8');

  console.log(`🚀 Successfully upgraded Android build version:`);
  console.log(`   • Version Code : ${currentVersionCode} ➔ ${newVersionCode}`);
  console.log(`   • Version Name : ${currentPkgVersion} ➔ ${newPkgVersion}`);
}

bumpVersion();
