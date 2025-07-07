export default function SDKIntegration() {
  return (
    <div>
      <div className="mb-4 text-sm text-muted-foreground">
        <span>Docs</span>
        <span className="mx-2">/</span>
        <span>SDK</span>
        <span className="mx-2">/</span>
        <span>SDK Integration</span>
      </div>

      <h1 className="text-4xl font-bold mb-6">Adding DOTA SDK to your React Native app</h1>

      <div className="mb-8">
        <p className="text-lg mb-4">
          Dota uses the DOTA client to deliver updates to your React Native app. Please
          check the documentation for all details in regards to compatibility and installation.
        </p>
        <p className="text-lg">
          <strong>NOTE:</strong> If you are utilizing the new React Native architecture introduced
          by default in 0.76 or using React Native version 0.77 or higher, you need to use the new DOTA client with the following requirements:
          <ul className="list-disc pl-6 mt-2">
            <li>React Native version 0.77 or higher</li>
            <li>iOS minimum target version of 15.5</li>
          </ul>
          <div className="mt-2">
            <strong>Install the new DOTA client:</strong>
            <pre className="code-block mt-2">
              <code>npm install --save @code-push-next/react-native-code-push</code>
            </pre>
          </div>
        </p>
      </div>

      <div className="mb-8" id="install">
        <h2 className="text-2xl font-bold mb-4">Install the DOTA client</h2>
        <pre className="code-block">
          <code>npm install --save react-native-code-push</code>
        </pre>
      </div>

      <div className="mb-8" id="ios-setup">
        <h2 className="text-2xl font-bold mb-4">iOS Setup</h2>
        <p className="text-lg">
          The setup for iOS can be followed from the official DOTA documentation <a href="https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-ios.md#ios-setup">here</a>.
        </p>
      </div>

      <div className="mb-8" id="android-setup">
        <h2 className="text-2xl font-bold mb-4">Android Setup</h2>
        <p className="text-lg">
          The setup for Android can be followed from the official DOTA documentation <a href="https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md#android-setup">here</a>.
        </p>
      </div>

      <div className="mb-8" id="configure-environment">
        <h2 className="text-2xl font-bold mb-4">Configure environment</h2>
        <p className="text-lg mb-4">
          Update your app to point to the Dota server and use the DOTA Deployment Key
          generated from your Dota account.
        </p>
        <p className="text-lg mb-2">
          <strong>iOS:</strong> Update your Info.plist file with the following:
        </p>
        <pre className="code-block">
          {`<key>CodePushDeploymentKey</key>
<string>{{DEPLOYMENT_KEY_HERE}}</string>
<key>CodePushServerURL</key>
<string>https://dota-server.yourdomain.com/</string>`}
        </pre>
        <p className="text-lg mb-2">
          <strong>Android:</strong> Update your strings.xml file with the following:
        </p>
        <pre className="code-block">
          {`<resources>
    <string name="app_name">AppName</string>
    <string moduleConfig="true" name="CodePushDeploymentKey">{{DEPLOYMENT_KEY_HERE}}</string>
    <string moduleConfig="true" name="CodePushServerUrl">https://dota-server.yourdomain.com/</string>
</resources>`}
        </pre>
      </div>

      <div className="mb-8" id="usage">
        <h2 className="text-2xl font-bold mb-4">Usage</h2>
        <p className="text-lg mb-4">
          There are many ways to use DOTA in your app. The most common way is to wrap your root
          component with the dota higher-order component.
        </p>
        <pre className="code-block">
          {`import codePush from 'react-native-code-push';

class MyApp extends Component {
}

MyApp = codePush(MyApp);`}
        </pre>
      </div>

      <div className="mb-8" id="additional-plugin-usage">
        <h2 className="text-2xl font-bold mb-4">Additional Plugin Usage</h2>
        <p className="text-lg mb-4">
          With the DOTA plugin downloaded and linked, and your app asking DOTA where to get
          the right JS bundle from, the only thing left is to add the necessary code to your app to
          control the following policies:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            When (and how often) to check for an update? (for example app start, in response to
            clicking a button in a settings page, periodically at some fixed interval)
          </li>
          <li>When an update is available, how to present it to the end user?</li>
        </ul>
        <p className="text-lg mb-4">
          The simplest way to do this is to "DOTA-ify" your app's root component. To do so, you
          can choose one of the following two options:
        </p>
        <h3 className="text-xl font-medium mb-3">
          Option 1: Wrap your root component with the dota higher-order component
        </h3>
        <p className="text-lg mb-2">
          <strong>For class component</strong>
        </p>
        <pre className="code-block">
          {`import codePush from "@code-push-next/react-native-code-push";

class MyApp extends Component {
}

MyApp = codePush(MyApp);`}
        </pre>
        <p className="text-lg mb-2">
          <strong>For functional component</strong>
        </p>
        <pre className="code-block">
          {`import codePush from "@code-push-next/react-native-code-push";

let MyApp: () => React$Node = () => {
};

MyApp = codePush(MyApp);`}
        </pre>
        <h3 className="text-xl font-medium mb-3">Option 2: Use the ES7 decorator syntax</h3>
        <p className="text-lg mb-2">
          <strong>For class component</strong>
        </p>
        <pre className="code-block">
          {`import codePush from "@code-push-next/react-native-code-push";

@codePush
class MyApp extends Component {
}`}
        </pre>
        <p className="text-lg mb-2">
          <strong>For functional component</strong>
        </p>
        <pre className="code-block">
          {`import codePush from "@code-push-next/react-native-code-push";

const MyApp: () => React$Node = () => {
};

export default codePush(MyApp);`}
        </pre>
      </div>

      <div className="mb-8" id="manual-check">
        <h2 className="text-2xl font-bold mb-4">Manual Sync</h2>
        <p className="text-lg mb-4">
          For fine-grained control over when the check happens (like a button press or timer
          interval), you can call DOTA.sync() at any time with your desired SyncOptions, and
          optionally turn off DOTA's automatic checking by specifying a manual checkFrequency:
        </p>
        <pre className="code-block">
          {`let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

class MyApp extends Component {
    onButtonPress() {
        codePush.sync({
            updateDialog: true,
            installMode: codePush.InstallMode.IMMEDIATE
        });
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={this.onButtonPress}>
                    <Text>Check for updates</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

MyApp = codePush(codePushOptions)(MyApp);`}
        </pre>
      </div>
    </div>
  );
}
