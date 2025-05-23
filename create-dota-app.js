#!/usr/bin/env node
/**
 * create-dota-app.js
 *
 * 1. Ensures a 'dummyOrg' exists for the current user (creates if not)
 * 2. Creates/uses a DOTA app under dummyOrg and grabs its Staging key
 * 3. Detects your React Native version, then installs:
 *      • react-native-code-push    if RN < 0.65
 *      • @code-push-next/react-native-code-push if RN ≥ 0.65
 * 4. Writes the two TSX/TS helpers under src/utility/codePush
 * 5. Patches Bootstrap.tsx, Jest setup, and Android config for CodePush
 */

const fs        = require('fs-extra');
const path      = require('path');
const { execSync } = require('child_process');

// ——————————————————
// 1) Parse args
// ——————————————————
const [ appName, projectPath = '.', dotaRepoPath ] = process.argv.slice(2);

if (!appName) {
  console.error('❌ Usage: node create-dota-app.js <appName> <projectPath> [dotaRepoPath]');
  process.exit(1);
}

const root = path.resolve(projectPath);
if (!fs.existsSync(root)) {
  console.error(`❌ Project path not found: ${root}`);
  process.exit(1);
}

console.log(`📦 App:       ${appName}`);
console.log(`📁 Project:   ${root}`);
if (dotaRepoPath) console.log(`📂 DOTA repo: ${dotaRepoPath}`);

// ——————————————————
// 2) Helpers
// ——————————————————
function execCmd(cmd, silent=false) {
  console.log(`$ ${cmd}`);
  return execSync(cmd, { stdio: silent ? 'pipe' : 'inherit' });
}

function patchFile(rel, fn) {
  const fp = path.join(root, rel);
  if (!fs.existsSync(fp)) return console.warn(`⚠️  Missing: ${rel}`);
  const src = fs.readFileSync(fp, 'utf8');
  const out = fn(src);
  if (out !== src) {
    fs.writeFileSync(fp, out, 'utf8');
    console.log(`✓ Patched ${rel}`);
  }
}

function getRNVersion() {
  try {
    const pj = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
    const dep = (pj.dependencies||{})['react-native'] || (pj.devDependencies||{})['react-native'];
    if (!dep) return null;
    const m = dep.match(/\d+\.\d+\.\d+/);
    return m ? m[0] : dep;
  } catch {
    return null;
  }
}
function isGE(v,t){ if(!v) return false; let a=v.split('.').map(x=>+x), b=t.split('.').map(x=>+x);
  for(let i=0;i<3;i++){ if((a[i]||0)>(b[i]||0)) return true; if((a[i]||0)<(b[i]||0)) return false; }
  return true;
}

// ——————————————————
// 3) DOTA CLI sanity
// ——————————————————
try {
  execCmd('dota --version', true);
  execCmd('dota whoami',    true);
} catch {
  console.error('❌ Ensure `dota-cli` is installed and you are logged in (dota login).');
  process.exit(1);
}

// ——————————————————
// 4) Main
// ——————————————————
;(async()=>{
  // 4.1 Ensure dummyOrg exists
  let orgName = 'dummyOrg';
  let orgExists = false;
  try {
    const orgsOut = execCmd('dota org ls', true).toString();
    const orgs = JSON.parse(orgsOut);
    orgExists = orgs.some(o => o.displayName === orgName);
  } catch (e) {
    console.warn('⚠️  Could not list orgs, will try to create dummyOrg.');
  }
  if (!orgExists) {
    try {
      execCmd(`dota org add ${orgName}`);
      console.log(`✓ Created org ${orgName}`);
    } catch (e) {
      console.warn(`⚠️  Could not create org ${orgName} (it may already exist or org creation is not supported).`);
    }
  } else {
    console.log(`✓ Org ${orgName} exists`);
  }

  // 4.2 Ensure the app exists (user-level, no org)
  let appExists = false;
  try {
    const appsOut = execCmd(`dota app ls`, true).toString();
    const apps = JSON.parse(appsOut);
    appExists = apps.some(a => a.name === `${appName}-Android`);
  } catch (e) {
    console.warn('⚠️  Could not list apps, will try to create app.');
  }
  const dotaAppFull = `${appName}-Android`;
  if (!appExists) {
    try {
      execCmd(`dota app add dummyOrg/${dotaAppFull}`);
      console.log(`✓ Created app dummyOrg/${dotaAppFull}`);
    } catch (e) {
      console.error(`❌ Failed to create app dummyOrg/${dotaAppFull}: ${e.message}`);
      process.exit(1);
    }
  } else {
    console.log(`✓ App ${dotaAppFull} exists`);
  }
  console.log(`\n→ Using DOTA app "${dotaAppFull}"…`);

  // 4.2b Get deployment key
  let deployKey;
  try {
    const out = execCmd(
      `dota deployment list ${dotaAppFull} --displayKeys`,
      true
    ).toString();
    deployKey = JSON.parse(out).find(d=>d.name==='Staging')?.key;
  } catch {}
  if (!deployKey) {
    deployKey = `MOCK_KEY_${Date.now()}`;
    console.warn(`⚠️  Couldn't fetch key, using mock: ${deployKey}`);
  } else {
    console.log(`✓ Got deployment key`);
  }

  // 4.3 Install correct CodePush SDK
  console.log(`\n→ Installing CodePush into ${root}…`);
  process.chdir(root);
  if (!fs.existsSync('package.json')) {
    fs.writeFileSync(
      'package.json',
      JSON.stringify({name:appName.toLowerCase(),version:'1.0.0',private:true},null,2)
    );
    console.log('✓ Created package.json');
  }

  const rn = getRNVersion();
  console.log(`• Detected RN version: ${rn||'<unknown>'}`);

  // 4.4 Write TS/TSX helpers under src/utility/codePush
  console.log(`\n→ Writing CodePush helpers…`);
  const cpDir = path.join(root,'src','utility','codePush');
  fs.ensureDirSync(cpDir);

  // Determine correct CodePush import based on RN version
  const codePushImport = (rn && !isGE(rn,'0.65.0'))
    ? 'react-native-code-push'
    : '@code-push-next/react-native-code-push';

  fs.writeFileSync(
    path.join(cpDir,'withCodePush.tsx'),
`import codePush, { CodePushOptions } from '${codePushImport}';
import React from 'react';

export interface CodePushConfig extends CodePushOptions {
  serverUrl?: string;
  checkFrequency?: number;
}

export const withCodePush = (config: Partial<CodePushConfig> = {}) => (Wrapped: React.ComponentType<any>) => {
  const options: CodePushOptions = {
    installMode: codePush.InstallMode.IMMEDIATE,
    updateDialog: {
      appendReleaseDescription: true,
      title: 'An update is available!',
      mandatoryUpdateMessage: 'An update is required to continue using the app.',
      mandatoryContinueButtonLabel: 'Install now',
      optionalUpdateMessage: 'An update is available. Would you like to install it?',
      optionalIgnoreButtonLabel: 'Later',
      optionalInstallButtonLabel: 'Install now',
    },
    ...config,
  };
  const checkFrequency = config.checkFrequency || codePush.CheckFrequency.ON_APP_START;
  return codePush(options, checkFrequency)(Wrapped);
};`
  );

  fs.writeFileSync(
    path.join(cpDir,'config.ts'),
`import { CodePushConfig } from './withCodePush';
import codePush from '${codePushImport}';
export const getCodePushConfig = (env:'staging'|'production'):CodePushConfig => {
  const common:CodePushConfig = {
    installMode: codePush.InstallMode.IMMEDIATE,
    updateDialog: {
      appendReleaseDescription: true,
      title: 'An update is available!',
      mandatoryUpdateMessage: 'An update is required to continue using the app.',
      mandatoryContinueButtonLabel: 'Install now',
      optionalUpdateMessage: 'An update is available. Would you like to install it?',
      optionalIgnoreButtonLabel: 'Later',
      optionalInstallButtonLabel: 'Install now',
    },
  };
  return { ...common, serverUrl: env==='staging' ? 'http://localhost:3010' : 'http://localhost:3010' };
};`
  );

  console.log('✓ Helpers created');

  // 4.6 Patch source files
  console.log(`\n→ Patching Bootstrap.tsx…`);
  patchFile('src/Bootstrap.tsx', src=>{
    let out = src;
    if (!out.includes('withCodePush')) {
      out = out.replace(
        /import .*LoggerTrace['";]?/, // fallback: insert after first import
        `$&\nimport { withCodePush } from './utility/codePush/withCodePush';\nimport { getCodePushConfig } from './utility/codePush/config';`
      );
    }
    if (!out.includes('CodePushBootstrap')) {
      out = out.replace(
        /const styles\s*=\s*/, // fallback: insert before styles
        `const env = __DEV__?'staging':'production';\nconst CodePushBootstrap = withCodePush(getCodePushConfig(env))(Bootstrap);\n\nconst styles =`
      );
    }
    return out.replace(/export default Bootstrap;/,'export default CodePushBootstrap;');
  });

  console.log(`→ Updating Jest setup…`);
  for (const f of ['jest-setup.ts','jest.setup.ts','jest-setup.js','jest.setup.js']) {
    const p = path.join(root,f);
    if (fs.existsSync(p)) {
      const c = fs.readFileSync(p,'utf8');
      if (!c.includes("react-native-code-push")) {
        fs.appendFileSync(p, `

jest.mock('react-native-code-push',()=>{ 
  const cp=(c:any)=>(C:any)=>C;
  cp.CheckFrequency={ON_APP_START:'ON_APP_START'};
  cp.InstallMode    ={IMMEDIATE:'IMMEDIATE'};
  return cp;
});`);
        console.log(`✓ Patched ${f}`);
      }
      break;
    }
  }

  fs.writeFileSync(
    path.join(root,'codepush.config.js'),
`module.exports={
  deploymentKey: process.env.DEPLOYMENT_KEY||'${deployKey}',
  serverUrl:'http://localhost:3010',
  appVersion:'0.0.1', deploymentName:'Staging',
  isMandatory:false, checkFrequency:'ON_APP_RESUME',
  installMode:'ON_NEXT_RESTART', minimumBackgroundDuration:0
};`
  );
  console.log('✓ codepush.config.js created');

  console.log(`\n→ Patching Android settings.gradle…`);
  patchFile('android/settings.gradle', s=>
    s.replace(
      /include ':app'/,
      `include ':app',':react-native-code-push'\nproject(':react-native-code-push').projectDir=new File(rootProject.projectDir,'../node_modules/react-native-code-push/android/app')`
    )
  );

  console.log(`→ Patching Android strings.xml…`);
  patchFile('android/app/src/main/res/values/strings.xml', s => {
    let out = s;
    // Remove any existing CodePushServerUrl/DeploymentKey lines
    out = out.replace(/\s*<string[^>]*name="CodePushDeploymentKey"[^>]*>.*?<\/string>/g, '');
    out = out.replace(/\s*<string[^>]*name="CodePushServerUrl"[^>]*>.*?<\/string>/g, '');
    // Insert before </resources>
    out = out.replace(
      /<\/resources>/,
      `    <string moduleConfig="true" name="CodePushDeploymentKey">${deployKey}</string>\n    <string moduleConfig="true" name="CodePushServerUrl">http://localhost:3010</string>\n</resources>`
    );
    return out;
  });

  console.log(`→ Patching build.gradle…`);
  patchFile('android/app/build.gradle', s=>
    s
      .replace(/android\s*{/,`apply from:"../../node_modules/react-native-code-push/android/codepush.gradle"\n\nandroid{`)
      .replace(/versionNameSuffix ["'][^"']+["']/g, m=>`// ${m}`)
  );

  console.log(`→ Patching MainApplication…`);
  function findMA(dir){
    for(const f of fs.readdirSync(dir)){
      const fp = path.join(dir,f);
      if (fs.statSync(fp).isDirectory()) {
        const r = findMA(fp); if(r) return r;
      } else if (/MainApplication\.(java|kt)$/.test(f)) {
        return { fp, isKt: f.endsWith('.kt') };
      }
    }
  }
  const ma = findMA(path.join(root,'android','app','src','main','java'));
  if (ma) {
    let c = fs.readFileSync(ma.fp,'utf8');
    if (!/CodePush.getJSBundleFile/.test(c)) {
      c = c.replace(
        /(import .*;\s*)(?!import)/,
        `$1\nimport com.microsoft.codepush.react.CodePush;\n`
      );
      const re = ma.isKt
        ? /override fun getJSMainModuleName\(\)[\s\S]*?\}/
        : /@Override\s+public String getJSMainModuleName\(\)[\s\S]*?\}/;
      c = c.replace(
        re,
        m=>m+`
        override fun getJSBundleFile(): String {
          return CodePush.getJSBundleFile()
        }`
      );
      fs.writeFileSync(ma.fp,c,'utf8');
      console.log(`✓ Patched ${path.relative(root, ma.fp)}`);
    }
  }

  // 4.7 Ensure Bootstrap.tsx exists and is DOTA/CodePush wrapped
  const bootstrapPath = path.join(root, 'src', 'Bootstrap.tsx');
  if (!fs.existsSync(bootstrapPath)) {
    fs.ensureDirSync(path.dirname(bootstrapPath));
    fs.writeFileSync(
      bootstrapPath,
`import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import App from '../App';
import { withCodePush } from './utility/codePush/withCodePush';
import { getCodePushConfig } from './utility/codePush/config';

const Stack = createStackNavigator();

const Bootstrap = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={App} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const env = __DEV__ ? 'staging' : 'production';
const CodePushBootstrap = withCodePush(getCodePushConfig(env))(Bootstrap);

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default CodePushBootstrap;
`    );
    console.log('✓ Created src/Bootstrap.tsx');
  }

  // 4.8 Patch index.js to use Bootstrap
  const indexPath = path.join(root, 'index.js');
  if (fs.existsSync(indexPath)) {
    let idx = fs.readFileSync(indexPath, 'utf8');
    if (!idx.includes("Bootstrap")) {
      idx = idx.replace(/import\s+App\s+from\s+['\"]\.\/App['\"];?/g, "import Bootstrap from './src/Bootstrap';");
      idx = idx.replace(/AppRegistry\.registerComponent\(([^,]+),\s*\(\)\s*=>\s*App\);/, 'AppRegistry.registerComponent($1, () => Bootstrap);');
      fs.writeFileSync(indexPath, idx, 'utf8');
      console.log('✓ Patched index.js to use Bootstrap');
    }
  }

  console.log(`\n🎉 DOTA + CodePush integration complete!`);
  console.log(`→ Release with: dota release-react ${dotaAppFull} android -d Staging`);
})();
