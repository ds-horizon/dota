#!/usr/bin/env node
/**
 * dotafy.js – v2
 * ---------------
 * Automates **DOTA (CodePush‑next)** integration for an *existing* React‑Native **Android** project **and** bootstraps
 * a matching DOTA app on your self‑hosted server (default: http://localhost:3010).
 *
 * It *does not* publish a release – you control that step manually once you're ready.
 *
 * -----------------------------------------------------------------------------
 * USAGE
 *   node dotafy.js <projectDir> <appName> [serverUrl]
 *
 *   projectDir   – path to the root of the already‑generated React‑Native app
 *   appName      – the name for the new DOTA app, e.g. "DummyApp-android"
 *   serverUrl    – base URL of your DOTA server (default http://localhost:3010)
 *
 * PRE‑REQUISITES
 *   1. DOTA CLI (`npm i -g @dream11/dota-cli` or similar) accessible as the `dota` command.
 *   2. `dota login <serverUrl>` done once so that the CLI is authenticated.
 *   3. Android SDK & JDK so that `./gradlew assembleRelease` *could* succeed (the script
 *      itself no longer builds, but Gradle files are modified).
 *   4. Node ≥16.
 *
 * HOW IT WORKS
 *   1. Detects the React‑Native version (from package.json).
 *   2. Installs the correct CodePush client:
 *        • `@code-push-next/react-native-code-push` for RN ≥ 0.77
 *        • `react-native-code-push` for lower versions
 *   3. Creates a **DOTA app** → `dota app add <appName>` (idempotent; ignores if exists).
 *   4. Fetches the *Staging* deployment key → `dota deployment list <appName> -k --format json`.
 *   5. Patches Android native layer:
 *        • settings.gradle, app/build.gradle, strings.xml (inserts ServerUrl & DeploymentKey)
 *        • MainApplication.java|kt adds `CodePush.getJSBundleFile()` override
 *   6. Wraps your JS entry (index.js / App.js / index.tsx / App.tsx) with a CodePush HOC
 *      that shows the custom update dialog you specified earlier.
 *
 * -----------------------------------------------------------------------------
 * After running, open the app on a device/emulator, make a change, **then** release manually:
 *
 *   # from your project root
 *   npx dota release-react <appName> android -d Staging \
 *        --serverUrl <serverUrl> --description "First OTA!" --targetBinaryVersion "*"
 */

// ---------------------------------------------------------------------------------------------
// Dependencies – kept minimal and node‑built‑ins only for portability
// ---------------------------------------------------------------------------------------------
const fs   = require('fs');
const path = require('path');
const cp   = require('child_process');

//----------------------------------------------------------------- helpers ----------------------
function exec(cmd, opts = {}) {
  console.log(`\n\x1b[2m$ ${cmd}\x1b[0m`);
  return cp.execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}
function safeRead(file)  { return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null; }
function safeWrite(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log(`  ↳ wrote ${path.relative(process.cwd(), file)}`);
}
function patchFile(file, searchRegex, insert, { after = true } = {}) {
  const src = safeRead(file);
  if (!src) throw new Error(`Missing expected file: ${file}`);
  if (src.includes(insert.trim())) return false; // already patched
  const replacement = after ? src.replace(searchRegex, match => match + insert)
                            : src.replace(searchRegex, insert + '$&');
  safeWrite(file, replacement);
  return true;
}
function detectRnVersion(projectDir) {
  const pkgJson = require(path.join(process.cwd(), 'package.json'));
  const rnVer = (pkgJson.dependencies && pkgJson.dependencies['react-native']) ||
                (pkgJson.devDependencies && pkgJson.devDependencies['react-native']);
  if (!rnVer) throw new Error('react-native not found in package.json');
  const m = rnVer.match(/(\d+)\.(\d+)\.(\d+)/);
  return !m ? { raw: rnVer, major: 0, minor: 0, patch: 0 }
            : { raw: rnVer, major: +m[1], minor: +m[2], patch: +m[3] };
}

//----------------------------------- CLI args ---------------------------------------------------
const [projectDir, appName, serverUrl = 'http://10.0.2.2:3010'] = process.argv.slice(2);
if (!projectDir || !appName) {
  console.error('Usage: node dotafy.js <projectDir> <appName> [serverUrl]');
  process.exit(1);
}
const absProjectDir = path.resolve(projectDir);
if (!fs.existsSync(absProjectDir)) throw new Error(`projectDir ${absProjectDir} not found`);
process.chdir(absProjectDir);
console.log(`\n📁 Working in ${absProjectDir}`);

//---------------------------------- STEP 1: choose CodePush client -----------------------------
const rn = detectRnVersion('.');
// Determine correct CodePush package and version for the detected RN version
let cpPkg;
if (rn.major > 0 || rn.minor >= 77) {
  // RN 0.77+
  cpPkg = '@code-push-next/react-native-code-push';
} else if (rn.major === 0 && rn.minor >= 71) {
  // RN 0.71 - 0.76
  cpPkg = 'react-native-code-push'; // latest 8.x is compatible
} else {
  // RN < 0.71 (e.g., 0.64)
  cpPkg = 'react-native-code-push@7.0.4';
}
console.log(`Detected React‑Native ${rn.raw} – installing ${cpPkg}`);
exec(`npm install --save ${cpPkg}`);

//---------------------------------- STEP 2: ensure DOTA app exists -----------------------------
function ensureDotaApp(appName) {
  try {
    exec(`dota app add ${appName}`);
    console.log(`✔️  DOTA app "${appName}" created`);
  } catch (e) {
    console.log(`ℹ️  DOTA app "${appName}" already exists – continuing`);
  }
  // fetch deployment key (expects JSON array [{name:"Staging",key:"..."}, …])
  let key;
  try {
    const out = exec(`dota deployment list ${appName} -k --format json`);
    const deployments = JSON.parse(out);
    key = (deployments.find(d => d.name === 'Staging') || deployments[0]).key;
    if (!key) throw new Error('No key found');
    console.log(`✔️  Staging deployment key: ${key}`);
  } catch (err) {
    throw new Error('Could not retrieve deployment key – check your DOTA CLI / server');
  }
  return key;
}
const deploymentKey = ensureDotaApp(appName);

//---------------------------------- STEP 3: patch Android native -------------------------------
const androidDir = path.join('android');
if (!fs.existsSync(androidDir)) throw new Error('Android directory not found – is this a RN project?');

// 3.1 settings.gradle
const settingsGradle = path.join(androidDir, 'settings.gradle');
let settingsContent = safeRead(settingsGradle);
// Remove any existing react-native-code-push include/project lines
settingsContent = settingsContent
  .replace(/,? *':react-native-code-push'/g, '')
  .replace(/project\(':react-native-code-push'\)\.projectDir = new File\([^\n]+\)\n?/g, '');
// Add the correct include and project lines after include ':app'
settingsContent = settingsContent.replace(
  /include ':app'/,
  "include ':app', ':react-native-code-push'\nproject(':react-native-code-push').projectDir = new File(rootProject.projectDir, '../node_modules/" + cpPkg.replace(/@.*$/, '') + "/android/app')"
);
safeWrite(settingsGradle, settingsContent);

// 3.2 app/build.gradle – append apply from
const buildGradle = path.join(androidDir, 'app', 'build.gradle');
const gradleLine = `apply from: "../../node_modules/${cpPkg}/android/codepush.gradle"`;
patchFile(buildGradle, /apply plugin: "com.facebook.react"/, `\n${gradleLine}`);

// 3.3 strings.xml – add ServerUrl + DeploymentKey (moduleConfig=true to allow overrides)
const stringsXml = path.join(androidDir, 'app', 'src', 'main', 'res', 'values', 'strings.xml');
let strings = safeRead(stringsXml);
if (!strings) throw new Error('Could not find strings.xml');
// Always update or insert CodePushServerUrl and CodePushDeploymentKey
if (strings.includes('CodePushServerUrl')) {
  strings = strings.replace(/<string[^>]*name="CodePushServerUrl"[^>]*>.*?<\/string>/,
    `<string moduleConfig=\"true\" name=\"CodePushServerUrl\">${serverUrl}</string>`);
} else {
  strings = strings.replace('<resources>', `<resources>\n    <string moduleConfig=\"true\" name=\"CodePushServerUrl\">${serverUrl}</string>`);
}
if (strings.includes('CodePushDeploymentKey')) {
  strings = strings.replace(/<string[^>]*name="CodePushDeploymentKey"[^>]*>.*?<\/string>/,
    `<string moduleConfig=\"true\" name=\"CodePushDeploymentKey\">${deploymentKey}</string>`);
} else {
  strings = strings.replace('<resources>', `<resources>\n    <string moduleConfig=\"true\" name=\"CodePushDeploymentKey\">${deploymentKey}</string>`);
}
safeWrite(stringsXml, strings);
console.log('✔️  Updated strings.xml');

// 3.4 MainApplication.{java|kt}
const appSrcMain = path.join(androidDir, 'app', 'src', 'main');
function findMainApplication() {
  const files = [];
  (function walk(dir) {
    fs.readdirSync(dir).forEach(f => {
      const p = path.join(dir, f);
      if (fs.statSync(p).isDirectory()) return walk(p);
      if (f === 'MainApplication.java' || f === 'MainApplication.kt') files.push(p);
    });
  })(appSrcMain);
  if (!files.length) throw new Error('MainApplication.{java|kt} not found');
  return files[0];
}
const mainApp = findMainApplication();
const isKt = mainApp.endsWith('.kt');
console.log(`Patching ${path.relative(absProjectDir, mainApp)}`);
if (isKt) {
  patchFile(mainApp, /package .*\n/, `import com.microsoft.codepush.react.CodePush;\n`, { after: true });
  patchFile(mainApp, /object : DefaultReactNativeHost\(this\) \{/, `object : DefaultReactNativeHost(this) {\n        override fun getJSBundleFile(): String = CodePush.getJSBundleFile()\n    `);
} else {
  patchFile(mainApp, /package .*\n/, `import com.microsoft.codepush.react.CodePush;\n`, { after: true });
  patchFile(mainApp, /new ReactNativeHost\(this\) \{/, `new ReactNativeHost(this) {\n        @Override\n        protected String getJSBundleFile() {\n          return CodePush.getJSBundleFile();\n        }`);
}

//---------------------------------- STEP 4: wrap JS entry --------------------------------------
const entries = ['index.js', 'App.js', 'index.tsx', 'App.tsx'].map(f => path.join(absProjectDir, f));
const entryFile = entries.find(f => fs.existsSync(f));
if (!entryFile) throw new Error('Could not locate app entry file (index.js / App.js / .tsx)');
let js = safeRead(entryFile);
if (!js.includes('react-native-code-push')) {
  // Remove any export default codePush... or export default App lines
  js = js.replace(/export default .*\n?/g, '');
  // Remove any AppRegistry.registerComponent line
  js = js.replace(/AppRegistry\.registerComponent\([^)]*\);?\n?/g, '');
  // Inject the correct CodePush wrapper and registration
  js += `\n\n// 🚀 DOTA OTA wrapper injected by dotafy\nimport codePush from 'react-native-code-push';\n\nconst codePushOptions = {\n  updateDialog: {\n    appendReleaseDescription: true,\n    title: 'An update is available!',\n    mandatoryUpdateMessage: 'An update is required to continue using the app.',\n    mandatoryContinueButtonLabel: 'Install now',\n    optionalUpdateMessage: 'An update is available. Would you like to install it?',\n    optionalIgnoreButtonLabel: 'Later',\n    optionalInstallButtonLabel: 'Install now',\n  },\n  installMode: codePush.InstallMode.IMMEDIATE,\n};\n\nconst CodePushedApp = codePush(codePushOptions)(App);\nAppRegistry.registerComponent(appName, () => CodePushedApp);\n`;
  safeWrite(entryFile, js);
  console.log('✔️  Wrapped entry file with CodePush HOC (correct pattern)');
}

//---------------------------------- Done! -------------------------------------------------------
console.log(`\n✅ DOTA integration complete. Next steps:`);
console.log(`   • Open your project in Android Studio or run \`npx react-native run-android\``);
console.log(`   • When ready, publish OTA via:`);
console.log(`       npx dota release-react ${appName} android -d Staging --serverUrl ${serverUrl}`);
