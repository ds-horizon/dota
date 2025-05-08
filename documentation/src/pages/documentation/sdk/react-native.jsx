import { useState } from 'react';

export default function ReactNativeConfig() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = index => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqData = [
    {
      question: 'Application not receiving updates',
      answer: (
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Verify server URL is correctly configured in <code>strings.xml</code> or{' '}
            <code>Info.plist</code>
          </li>
          <li>Check that the deployment key matches what's configured on the DOTA server</li>
          <li>Ensure the app has internet connectivity</li>
          <li>Look for errors in the application logs</li>
        </ul>
      ),
    },
    {
      question: 'Updates being downloaded but not applied',
      answer: (
        <ul className="list-disc pl-6 space-y-1">
          <li>Check the InstallMode configuration in your CodePush setup</li>
          <li>Verify that the app is properly restarting after update installation</li>
          <li>Ensure you're testing with the correct build type (release vs. debug)</li>
        </ul>
      ),
    },
    {
      question: 'SSL/TLS certificate issues',
      answer: (
        <ul className="list-disc pl-6 space-y-1">
          <li>Ensure your server has a valid SSL certificate</li>
          <li>
            For development, you might need to configure your app to trust development certificates
          </li>
        </ul>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 text-sm text-muted-foreground">
        <span>Docs</span>
        <span className="mx-2">/</span>
        <span>SDK</span>
        <span className="mx-2">/</span>
        <span>React Native Setup</span>
      </div>

      <h1 className="text-4xl font-bold mb-8">Configure React Native Application</h1>

      <div className="mb-8">
        <p className="mb-4">
          In order for{' '}
          <a
            href="https://github.com/dream-sports-labs/dota"
            className="text-dota-600 hover:underline"
          >
            react-native-code-push
          </a>{' '}
          to use your server, additional configuration value is needed.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Android</h2>
          <p className="mb-4">
            In <code>strings.xml</code>, add following line, replacing <code>server-url</code> with
            your server:
          </p>

          <pre className="code-block">
            <code>{`<string moduleConfig="true" name="CodePushServerUrl">server-url</string>`}</code>
          </pre>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">iOS</h2>
          <p className="mb-4">
            In <code>Info.plist</code> file, add following lines, replacing <code>server-url</code>{' '}
            with your server:
          </p>

          <pre className="code-block">
            <code>{`<key>CodePushServerURL</key>
<string>server-url</string>`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Testing Your Configuration</h2>

        <p className="mb-4">
          To verify that your React Native application is properly configured to use your DOTA
          server:
        </p>

        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Ensure your DOTA server is up and running</li>
          <li>In your React Native application, implement a basic CodePush integration</li>
          <li>Check the application logs for successful connection to your DOTA server</li>
          <li>Try releasing an update through DOTA and verify that your application receives it</li>
        </ol>

        <div className="alert-tip mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="alert-icon"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <div className="alert-content">
            <strong>Tip:</strong>
            <p>
              Always test your DOTA integration thoroughly in a development environment before using
              it in production.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Advanced Configuration</h2>

        <p className="mb-4">
          For advanced configurations, you can implement custom behavior in your React Native
          application:
        </p>

        <h3 className="text-xl font-semibold mb-3">Custom Update Dialog</h3>
        <pre className="code-block">
          <code>{`import codePush from 'react-native-code-push';
import { Alert } from 'react-native';

// Custom update dialog
const codePushOptions = {
  updateDialog: {
    appendReleaseDescription: true,
    title: 'An update is available!',
    mandatoryUpdateMessage: 'An update is required to continue using the app.',
    mandatoryContinueButtonLabel: 'Install now',
    optionalUpdateMessage: 'An update is available. Would you like to install it?',
    optionalIgnoreButtonLabel: 'Later',
    optionalInstallButtonLabel: 'Install now',
  },
  installMode: codePush.InstallMode.IMMEDIATE,
};

export default codePush(codePushOptions)(YourApp);`}</code>
        </pre>

        <h3 className="text-xl font-semibold mb-3 mt-6">Check for Updates Manually</h3>
        <pre className="code-block">
          <code>{`import codePush from 'react-native-code-push';

const checkForUpdates = () => {
  codePush.sync({
    updateDialog: true,
    installMode: codePush.InstallMode.IMMEDIATE
  },
  (status) => {
    switch(status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log('Checking for updates...');
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log('Downloading update package...');
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        console.log('Installing update...');
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        console.log('App is up to date!');
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        console.log('Update installed!');
        break;
    }
  });
};`}</code>
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>

        <h3 className="text-xl font-semibold mb-3">Common Issues</h3>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-card">
              <button
                onClick={() => toggleFaq(index)}
                className="faq-question"
                aria-expanded={expandedFaq === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-medium text-lg">{faq.question}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-300 text-primary ${
                    expandedFaq === index ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`faq-answer ${expandedFaq === index ? 'open' : ''}`}
              >
                <div className="pt-2">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3">Next Steps</h3>
        <p className="mb-4">After configuring your React Native application:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Set up{' '}
            <a href="/cli/installation" className="text-dota-600 hover:underline">
              DOTA CLI
            </a>{' '}
            for managing your deployments
          </li>
          <li>
            Learn how to use the{' '}
            <a href="/documentation/sdk/integration" className="text-dota-600 hover:underline">
              CLI commands
            </a>{' '}
            to publish updates
          </li>
          <li>
            Review{' '}
            <a href="/advanced/metrics" className="text-dota-600 hover:underline">
              Metrics
            </a>{' '}
            to monitor your deployments
          </li>
        </ul>
      </div>
    </div>
  );
}
