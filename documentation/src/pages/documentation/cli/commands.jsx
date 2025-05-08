export default function CLICommands() {
  return (
    <div>
      <div className="mb-4 text-sm text-muted-foreground">
        <span>Docs</span>
        <span className="mx-2">/</span>
        <span>CLI</span>
        <span className="mx-2">/</span>
        <span>Commands Reference</span>
      </div>

      <div className="flex flex-col">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-6">CLI Commands Reference</h1>
          
          <div className="mb-8">
            <p className="mb-4">
              This section contains a comprehensive reference for all DOTA CLI commands.
            </p>
          </div>
          
          <div className="mb-8" id="app-management">
            <h2 className="text-2xl font-bold mb-4">App Management</h2>
            
            <p className="mb-4">
              Before you can deploy any updates, you need to register an app with the DOTA service
              using the following command:
            </p>
            
            <pre className="code-block mb-6">
              <code>dota app add &lt;app-name&gt;</code>
            </pre>
            
            <p className="mb-4">
              If your app targets both iOS and Android, please create separate apps for each
              platform with DOTA (see the note below for details). This way, you can manage and
              release updates to them separately, which in the long run, also tends to make things
              simpler. The naming convention that most folks use is to suffix the app name with -iOS
              and -Android. For example:
            </p>
            
            <pre className="code-block mb-6">
              <code>{`dota app add MyApp-Android
dota app add MyApp-iOS`}</code>
            </pre>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>
                  Using the same app for iOS and Android may cause installation exceptions because
                  the DOTA update package produced for iOS will have different content from the
                  update produced for Android.
                </p>
              </div>
            </div>
            
            <p className="mb-4">
              All new apps automatically come with two deployments (Staging and Production) so that
              you can begin distributing updates to multiple channels without needing to do anything
              extra (see deployment instructions below). After you create an app, the CLI will
              output the deployment keys for the Staging and Production deployments, which you can
              begin using to configure your mobile clients with the React Native SDK.
            </p>
            
            <p className="mb-4">
              If you decide that you don't like the name you gave to an app, you can rename it at
              any time using the following command:
            </p>
            
            <pre className="code-block mb-6">
              <code>dota app rename &lt;old-app-name&gt; &lt;new-app-name&gt;</code>
            </pre>
            
            <p className="mb-4">
              The app's name is only meant to be recognizable from the management side, and
              therefore, you can feel free to rename it as necessary. It won't actually impact the
              running app, since update queries are made via deployment keys.
            </p>
            
            <p className="mb-4">
              If at some point you no longer need an app, you can remove it from the server using
              the following command:
            </p>
            
            <pre className="code-block mb-6">
              <code>dota app rm &lt;app-name&gt;</code>
            </pre>
            
            <div className="alert-warning mb-6">
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
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <div className="alert-content">
                <strong>Caution:</strong>
                <p>
                  Do this with caution since any apps that have been configured to use it will
                  obviously stop receiving updates.
                </p>
              </div>
            </div>
            
            <p className="mb-4">
              Finally, if you want to list all apps that you've registered with the DOTA server, you
              can run the following command:
            </p>
            
            <pre className="code-block mb-6">
              <code>dota app ls</code>
            </pre>
          </div>

          <div className="mb-8" id="deployment-management">
            <h2 className="text-2xl font-bold mb-4">Deployment Management</h2>
            
            <p className="mb-4">
              From the DOTA perspective, an app is simply a named grouping for one or more things
              called "deployments". While the app represents a conceptual "namespace" or "scope" for
              a platform-specific version of an app (e.g. the iOS port of Foo app), its deployments
              represent the actual target for releasing updates (for developers) and synchronizing
              updates (for end-users). Deployments allow you to have multiple "environments" for
              each app in-flight at any given time, and help model the reality that apps typically
              move from a dev's personal environment to a testing/QA/staging environment, before
              finally making their way into production.
            </p>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>
                  As you'll see below, the release, promote and rollback commands require both an
                  app name and a deployment name is order to work, because it is the combination of
                  the two that uniquely identifies a point of distribution (e.g. I want to release
                  an update of my iOS app to my beta testers).
                </p>
              </div>
            </div>
            
            <p className="mb-4">
              Whenever an app is registered with the DOTA service, it includes two deployments by
              default: Staging and Production. This allows you to immediately begin releasing
              updates to an internal environment, where you can thoroughly test each update before
              pushing them out to your end-users. This workflow is critical for ensuring your
              releases are ready for mass-consumption, and is a practice that has been established
              in the web for a long time.
            </p>
            
            <p className="mb-4">
              If having a staging and production version of your app is enough to meet your needs,
              then you don't need to do anything else. However, if you want an alpha, dev, etc.
              deployment, you can easily create them using the following command:
            </p>
            
            <pre className="code-block mb-6">
              <code>dota deployment add &lt;app-name&gt; &lt;deployment-name&gt;</code>
            </pre>
            
            <p className="mb-4">
              Just like with apps, you can remove and rename deployments as well, using the
              following commands respectively:
            </p>
            
            <pre className="code-block mb-6">
              <code>{`dota deployment rm &lt;app-name&gt; &lt;deployment-name&gt;
dota deployment rename &lt;app-name&gt; &lt;deployment-name&gt; &lt;new-deployment-name&gt;`}</code>
            </pre>
            
            <p className="mb-4">
              If at any time you'd like to view the list of deployments that a specific app
              includes, you can simply run the following command:
            </p>
            
            <pre className="code-block mb-6">
              <code>dota deployment ls &lt;app-name&gt; [--displayKeys|-k]</code>
            </pre>
            
            <p className="mb-4">
              This will display not only the list of deployments, but also the update metadata (e.g.
              mandatory, description) and installation metrics for their latest release:
            </p>
            
            <p className="mb-4 text-center font-bold">Deployment list</p>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>
                  Due to their infrequent use and needed screen real estate, deployment keys aren't
                  displayed by default. If you need to view them, simply make sure to pass the -k
                  flag to the deployment ls command.
                </p>
              </div>
            </div>
            
            <p className="mb-4">The install metrics have the following meaning:</p>
            
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Active</strong> - The number of successful installs that are currently
                running this release (i.e. if the user opened your app, they would see/run this
                version). This number will increase and decrease as end-users upgrade to and away
                from this release, respectively. This metric shows both the total of active users,
                as well as what percentage of your overall audience that represents. This makes it
                easy to determine the distribution of updates that your users are currently running,
                as well as answer questions such as "How many of my users have received my latest
                update?".
              </li>
              <li>
                <strong>Total</strong> - The total number of successful installations that this
                update has received overall. This number only ever increases as new users/devices
                install it, and therefore, this is always a superset of the total active count. An
                update is considered successful once notifyApplicationReady (or sync) is called
                after it was installed. Between the moment that an update is downloaded, and it is
                marked as being successful, it will be reported as a "pending" update (see below for
                details).
              </li>
              <li>
                <strong>Pending</strong> - The number of times this release has been downloaded, but
                not yet installed (i.e. the app was restarted to apply the changes). Therefore, this
                metric increases as updates are downloaded, and decreases as those corresponding
                downloaded updates are installed. This metric primarily applies to updates that
                aren't configured to install immediately, and helps provide the broader picture of
                release adoption for apps that rely on app resume and/or restart to apply an update
                (e.g. I want to rollback an update and I'm curious if anyone has downloaded it yet).
                If you've configured updates to install immediately, and are still seeing pending
                updates being reported, then it's likely that you're not calling
                notifyApplicationReady (or sync) on app start, which is the method that initiates
                sending install reports and marks installed updates as being considered successful.
              </li>
              <li>
                <strong>Rollbacks</strong> - The number of times that this release has been
                automatically rolled back on the client. Ideally this number should be zero, and in
                that case, this metric isn't even shown. However, if you released an update that
                includes a crash as part of the installation process, the CodePush plugin will roll
                the end-user back to the previous release, and report that issue back to the server.
                This allows your end-users to remain unblocked in the event of broken releases, and
                by being able to see this telemetry in the CLI, you can identify erroneous releases
                and respond to them by rolling it back on the server.
              </li>
              <li>
                <strong>Rollout</strong> - Indicates the percentage of users that are eligible to
                receive this update. This property will only be displayed for releases that
                represent an "active" rollout, and therefore, have a rollout percentage that is less
                than 100%. Additionally, since a deployment can only have one active rollout at any
                given time, this label would only be present on the latest release within a
                deployment.
              </li>
              <li>
                <strong>Disabled</strong> - Indicates whether the release has been marked as
                disabled or not, and therefore, is downloadable by end users. This property will
                only be displayed for releases that are actually disabled.
              </li>
            </ul>
            
            <p className="mb-4">
              When the metrics cell reports <em>No installs recorded</em>, that indicates that the
              server hasn't seen any activity for this release. This could either be because it
              precluded the plugin versions that included telemetry support, or no end-users have
              synchronized with the DOTA server yet. As soon as an install happens, you will begin
              to see metrics populate in the CLI for the release.
            </p>
          </div>

          <div className="mb-8" id="releasing-updates">
            <h2 className="text-2xl font-bold mb-4">Releasing Updates</h2>
            
            <p className="mb-4">
              Once your app has been configured to query for updates against the DOTA server, you
              can begin releasing updates to it. In order to provide both simplicity and
              flexibility, the DOTA CLI includes two different commands for releasing updates:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>General</strong> - Releases an update to the DOTA server that was generated
                by an external tool or build script (e.g. a Gulp task, the react-native bundle
                command). This provides the most flexibility in terms of fitting into existing
                workflows, since it strictly deals with DOTA-specific step, and leaves the
                app-specific compilation process to you.
              </li>
              <li>
                <strong>React Native</strong> - Performs the same functionality as the general
                release command, but also handles the task of generating the updated app contents
                for you (JS bundle and assets), instead of requiring you to run both react-native
                bundle and then dota release.
              </li>
            </ul>
            
            <p className="mb-4">
              Which of these commands you should use is mostly a matter of requirements and/or
              preference. However, we generally recommend using the platform-specific command to
              start (since it greatly simplifies the experience), and then leverage the
              general-purpose release command if/when greater control is needed.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Releasing Updates (General)</h3>
            
            <pre className="code-block mb-6">
              <code>{`dota release <app-name> <update-contents-path> <target-binary-version>
[--deploymentName <deployment-name>]
[--description <description>]
[--disabled <disabled>]
[--mandatory]
[--noDuplicateReleaseError]
[--rollout <rollout-percentage>]`}</code>
            </pre>
            
            <p className="mb-4">
              <strong>App name parameter</strong>
              <br />
              This specifies the name of the DOTA app that this update is being released for. This
              value corresponds to the friendly name that you specified when originally calling dota
              app add (e.g. "MyApp-Android"). If you need to look it up, you can run the dota app ls
              command to see your list of apps.
            </p>
            
            <p className="mb-4">
              <strong>Update contents parameter</strong>
              <br />
              This specifies the location of the updated app code and assets you want to release.
              You can provide either a single file (e.g. a JS bundle for a React Native app), or a
              path to a directory. Note that you don't need to ZIP up multiple files or directories
              in order to deploy those changes, since the CLI will automatically ZIP them for you.
            </p>
            
            <p className="mb-4">
              It's important that the path you specify refers to the platform-specific,
              prepared/bundled version of your app. The following table outlines which command you
              should run before releasing, as well as the location you can subsequently refer to
              using the updateContents parameter:
            </p>
            
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Platform</th>
                  <th className="border p-2 text-left">Prepare command</th>
                  <th className="border p-2 text-left">Package path (relative to project root)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">React Native wo/assets (Android)</td>
                  <td className="border p-2">
                    react-native bundle --platform android --entry-file &lt;entryFile&gt;
                    --bundle-output &lt;bundleOutput&gt; --dev false
                  </td>
                  <td className="border p-2">Value of the --bundle-output option</td>
                </tr>
                <tr>
                  <td className="border p-2">React Native w/assets (Android)</td>
                  <td className="border p-2">
                    react-native bundle --platform android --entry-file &lt;entryFile&gt;
                    --bundle-output &lt;releaseFolder&gt;/&lt;bundleOutput&gt; --assets-dest
                    &lt;releaseFolder&gt; --dev false
                  </td>
                  <td className="border p-2">
                    Value of the --assets-dest option, which should represent a newly created
                    directory that includes your assets and JS bundle
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">React Native wo/assets (iOS)</td>
                  <td className="border p-2">
                    react-native bundle --platform ios --entry-file &lt;entryFile&gt;
                    --bundle-output &lt;bundleOutput&gt; --dev false
                  </td>
                  <td className="border p-2">Value of the --bundle-output option</td>
                </tr>
                <tr>
                  <td className="border p-2">React Native w/assets (iOS)</td>
                  <td className="border p-2">
                    react-native bundle --platform ios --entry-file &lt;entryFile&gt;
                    --bundle-output &lt;releaseFolder&gt;/&lt;bundleOutput&gt; --assets-dest
                    &lt;releaseFolder&gt; --dev false
                  </td>
                  <td className="border p-2">
                    Value of the --assets-dest option, which should represent a newly created
                    directory that includes your assets and JS bundle
                  </td>
                </tr>
              </tbody>
            </table>
            
            <p className="mb-4">
              <strong>Target binary version parameter</strong>
              <br />
              This specifies the store/binary version of the application you are releasing the
              update for, so that only users running that version will receive the update, while
              users running an older and/or newer version of the app binary will not. This is useful
              for the following reasons:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                If a user is running an older binary version, it's possible that there are breaking
                changes in the DOTA update that wouldn't be compatible with what they're running.
              </li>
              <li>
                If a user is running a newer binary version, then it's presumed that what they are
                running is newer (and potentially incompatible) with the DOTA update.
              </li>
            </ul>
            
            <p className="mb-4">
              If you ever want an update to target multiple versions of the app store binary, we
              also allow you to specify the parameter as a semver range expression. That way, any
              client device running a version of the binary that satisfies the range expression
              (i.e. semver.satisfies(version, range) returns true) will get the update. Examples of
              valid semver range expressions are as follows:
            </p>
            
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Range Expression</th>
                  <th className="border p-2 text-left">Who gets the update</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">1.2.3</td>
                  <td className="border p-2">
                    Only devices running the specific binary app store version 1.2.3 of your app
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">*</td>
                  <td className="border p-2">
                    Any device configured to consume updates from your DOTA app
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">1.2.x</td>
                  <td className="border p-2">
                    Devices running major version 1, minor version 2 and any patch version of your
                    app
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">1.2.3 - 1.2.7</td>
                  <td className="border p-2">
                    Devices running any binary version between 1.2.3 (inclusive) and 1.2.7
                    (inclusive)
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">&gt;=1.2.3 &lt;1.2.7</td>
                  <td className="border p-2">
                    Devices running any binary version between 1.2.3 (inclusive) and 1.2.7
                    (exclusive)
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">~1.2.3</td>
                  <td className="border p-2">Equivalent to &gt;=1.2.3 &lt;1.3.0</td>
                </tr>
                <tr>
                  <td className="border p-2">^1.2.3</td>
                  <td className="border p-2">Equivalent to &gt;=1.2.3 &lt;2.0.0</td>
                </tr>
              </tbody>
            </table>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>
                  If your semver expression starts with a special shell character or operator such
                  as &gt;, ^, or * , the command may not execute correctly if you do not wrap the
                  value in quotes as the shell will not supply the right values to our CLI process.
                  Therefore, it is best to wrap your targetBinaryVersion parameter in double quotes
                  when calling the release command, e.g. dota release MyApp-iOS updateContents
                  "&gt;1.2.3".
                </p>
              </div>
            </div>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>
                  As defined in the semver spec, ranges only work for non pre-release versions:
                  https://github.com/npm/node-semver#prerelease-tags. If you want to update a
                  version with pre-release tags, then you need to write the exact version you want
                  to update (1.2.3-beta for example).
                </p>
              </div>
            </div>
            
            <p className="mb-4">
              The following table outlines the version value that DOTA expects your update's semver
              range to satisfy for each respective app type:
            </p>
            
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Platform</th>
                  <th className="border p-2 text-left">Source of app store version</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">React Native (Android)</td>
                  <td className="border p-2">
                    The android.defaultConfig.versionName property in your build.gradle file
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">React Native (iOS)</td>
                  <td className="border p-2">
                    The CFBundleShortVersionString key in the Info.plist file
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">React Native (Windows)</td>
                  <td className="border p-2">
                    The &lt;Identity Version&gt; key in the Package.appxmanifest file
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>
                  If the app store version in the metadata files are missing a patch version, e.g.
                  2.0, it will be treated as having a patch version of 0, i.e. 2.0 {'>'} 2.0.0.
                </p>
              </div>
            </div>
            
            <p className="mb-4">
              <strong>Deployment name parameter</strong>
              <br />
              This specifies which deployment you want to release the update to. This defaults to
              Staging, but when you're ready to deploy to Production, or one of your own custom
              deployments, just explicitly set this argument.
            </p>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>The parameter can be set using either "--deploymentName" or "-d".</p>
              </div>
            </div>
            
            <p className="mb-4">
              <strong>Description parameter</strong>
              <br />
              This provides an optional "change log" for the deployment. The value is simply round
              tripped to the client so that when the update is detected, your app can choose to
              display it to the end-user (e.g. via a "What's new?" dialog). This string accepts
              control characters such as \n and \t so that you can include whitespace formatting
              within your descriptions for improved readability.
            </p>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>This parameter can be set using either "--description" or "-des"</p>
              </div>
            </div>
            
            <p className="mb-4">
              <strong>Disabled parameter</strong>
              <br />
              This specifies whether an update should be downloadable by end users or not. If left
              unspecified, the update will not be disabled (i.e. users will download it the moment
              your app calls sync). This parameter can be valuable if you want to release an update
              that isn't immediately available, until you explicitly patch it when you want end
              users to be able to download it (e.g. an announcement blog post went live).
            </p>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>This parameter can be set using either "--disabled" or "-x"</p>
              </div>
            </div>
            
            <p className="mb-4">
              <strong>Mandatory parameter</strong>
              <br />
              This specifies whether the update should be considered mandatory or not (e.g. it
              includes a critical security fix). This attribute is simply round tripped to the
              client, who can then decide if and how they would like to enforce it.
            </p>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>
                  This parameter is simply a "flag", and therefore, its absence indicates that the
                  release is optional, and its presence indicates that it's mandatory. You can
                  provide a value to it (e.g. --mandatory true), however, simply specifying
                  --mandatory is sufficient for marking a release as mandatory.
                </p>
              </div>
            </div>
            
            <p className="mb-4">
              The mandatory attribute is unique because the server will dynamically modify it as
              necessary in order to ensure that the semantics of your releases are maintained for
              your end-users. For example, imagine that you released the following three updates to
              your app:
            </p>
            
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Release</th>
                  <th className="border p-2 text-left">Mandatory?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">v1</td>
                  <td className="border p-2">No</td>
                </tr>
                <tr>
                  <td className="border p-2">v2</td>
                  <td className="border p-2">Yes</td>
                </tr>
                <tr>
                  <td className="border p-2">v3</td>
                  <td className="border p-2">No</td>
                </tr>
              </tbody>
            </table>
            
            <p className="mb-4">
              If an end-user is currently running v1, and they query the server for an update, it
              will respond with v3 (since that is the latest), but it will dynamically convert the
              release to mandatory, since a mandatory update was released in between. This behavior
              is important since the code contained in v3 is incremental to that included in v2, and
              therefore, whatever made v2 mandatory, continues to make v3 mandatory for anyone that
              didn't already acquire v2.
            </p>
            
            <p className="mb-4">
              If an end-user is currently running v2, and they query the server for an update, it
              will respond with v3, but leave the release as optional. This is because they already
              received the mandatory update, and therefore, there isn't a need to modify the policy
              of v3. This behavior is why we say that the server will "dynamically convert" the
              mandatory flag, because as far as the release goes, its mandatory attribute will
              always be stored using the value you specified when releasing it. It is only changed
              on-the-fly as necessary when responding to an update check from an end-user.
            </p>
            
            <p className="mb-4">
              If you never release an update that is marked as mandatory, then the above behavior
              doesn't apply to you, since the server will never change an optional release to
              mandatory unless there were intermingled mandatory updates as illustrated above.
              Additionally, if a release is marked as mandatory, it will never be converted to
              optional, since that wouldn't make any sense. The server will only change an optional
              release to mandatory in order to respect the semantics described above.
            </p>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>This parameter can be set using either --mandatory or -m</p>
              </div>
            </div>
            
            <p className="mb-4">
              <strong>No duplicate release error parameter</strong>
              <br />
              This specifies that if the update is identical to the latest release on the
              deployment, the CLI should generate a warning instead of an error. This is useful for
              continuous integration scenarios where it is expected that small modifications may
              trigger releases where no production code has changed.
            </p>
            
            <p className="mb-4">
              <strong>Rollout parameter</strong>
              <br />
            </p>
            
            <div className="alert-warning mb-6">
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
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <div className="alert-content">
                <strong>Important:</strong>
                <p>
                  In order for this parameter to actually take affect, your end users need to be
                  running version 1.9.0-beta+ (for React Native) of the CodePush plugin. If you
                  release an update that specifies a rollout property, no end user running an older
                  version of React Native plugins will be eligible for the update. Therefore, until
                  you have adopted the neccessary version of the platform-specific CodePush plugin
                  (as previously mentioned), we would advise not setting a rollout value on your
                  releases, since no one would end up receiving it.
                </p>
              </div>
            </div>
            
            <p className="mb-4">
              This specifies the percentage of users (as an integer between 1 and 100) that should
              be eligible to receive this update. It can be helpful if you want to "flight" new
              releases with a portion of your audience (e.g. 25%), and get feedback and/or watch for
              exceptions/crashes, before making it broadly available for everyone. If this parameter
              isn't set, it is set to 100%, and therefore, you only need to set it if you want to
              actually limit how many users will receive it.
            </p>
            
            <p className="mb-4">
              When leveraging the rollout capability, there are a few additional considerations to
              keep in mind:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                You cannot release a new update to a deployment whose latest release is an "active"
                rollout (i.e. its rollout property is non-null). The rollout needs to be "completed"
                (i.e. setting the rollout property to 100) before you can release further updates to
                the deployment.
              </li>
              <li>
                If you rollback a deployment whose latest release is an "active" rollout, the
                rollout value will be cleared, effectively "deactivating" the rollout behavior
              </li>
              <li>
                Unlike the mandatory and description fields, when you promote a release from one
                deployment to another, it will not propagate the rollout property, and therefore, if
                you want the new release (in the target deployment) to have a rollout value, you
                need to explicitly set it when you call the promote command.
              </li>
            </ul>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>This parameter can be set using either --rollout or -r</p>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-3">Releasing Updates (React Native)</h3>
            
            <pre className="code-block mb-6">
              <code>{`dota release-react <appName> <platform>
[--bundleName <bundleName>]
[--deploymentName <deploymentName>]
[--description <description>]
[--development <development>]
[--disabled <disabled>]
[--entryFile <entryFile>]
[--gradleFile <gradleFile>]
[--mandatory]
[--noDuplicateReleaseError]
[--outputDir <outputDir>]
[--plistFile <plistFile>]
[--plistFilePrefix <plistFilePrefix>]
[--sourcemapOutput <sourcemapOutput>]
[--targetBinaryVersion <targetBinaryVersion>]
[--rollout <rolloutPercentage>]
[--useHermes <useHermes>]
[--podFile <podFile>]
[--extraHermesFlags <extraHermesFlags>]
[--privateKeyPath <privateKeyPath>]`}</code>
            </pre>
            
            <p className="mb-4">
              The release-react command is a React Native-specific version of the "vanilla" release
              command, which supports all of the same parameters (e.g. --mandatory, --description),
              yet simplifies the process of releasing updates by performing the following additional
              behavior:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Running the react-native bundle command in order to generate the update contents (JS
                bundle and assets) that will be released to the DOTA server. It uses sensible
                defaults as much as possible (e.g. creating a non-dev build, assuming an iOS entry
                file is named index.ios.js), but also exposes the relevant react-native bundle
                parameters to enable flexibility (e.g. --sourcemapOutput).
              </li>
              <li>
                Inferring the targetBinaryVersion of this release by using the version name that is
                specified in your project's Info.plist (for iOS) and build.gradle (for Android)
                files.
              </li>
            </ul>
            
            <p className="mb-4">
              To illustrate the difference that the release-react command can make, the following is
              an example of how you might generate and release an update for a React Native app
              using the "vanilla" release command:
            </p>
            
            <pre className="code-block mb-6">
              <code>{`mkdir ./CodePush

react-native bundle --platform ios \\
--entry-file index.ios.js \\
--bundle-output ./CodePush/main.jsbundle \\
--assets-dest ./CodePush \\
--dev false

dota release MyApp-iOS ./CodePush 1.0.0`}</code>
            </pre>
            
            <p className="mb-4">
              Achieving the equivalent behavior with the release-react command would simply require
              the following command, which is generally less error-prone:
            </p>
            
            <pre className="code-block mb-6">
              <code>dota release-react MyApp-iOS ios</code>
            </pre>
          </div>
          
          <div className="mb-8" id="patching-update-metadata">
            <h2 className="text-2xl font-bold mb-4">Patching Update Metadata</h2>
            
            <p className="mb-4">
              After releasing an update, there may be scenarios where you need to modify one or more
              of the metadata attributes associated with it (e.g. you forgot to mark a critical bug
              fix as mandatory, you want to increase the rollout percentage of an update). You can
              easily do this by running the following command:
            </p>
            
            <pre className="code-block mb-6">
              <code>{`dota patch <appName> <deploymentName>
[--label <releaseLabel>]
[--mandatory <isMandatory>]
[--description <description>]
[--rollout <rolloutPercentage>]
[--disabled <isDisabled>]
[--targetBinaryVersion <targetBinaryVersion>]`}</code>
            </pre>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>
                  This command doesn't allow modifying the actual update contents of a release. If
                  you need to respond to a release that has been identified as being broken, you
                  should use the rollback command to immediately roll it back, and then if
                  necessary, release a new update with the appropriate fix when it is available.
                </p>
              </div>
            </div>
            
            <p className="mb-4">
              Aside from the appName and deploymentName, all parameters are optional, and therefore,
              you can use this command to update just a single attribute or all of them at once.
              Calling the patch command without specifying any attribute flag will result in a
              no-op.
            </p>
            
            <pre className="code-block mb-6">
              <code>{`# Mark the latest production release as mandatory
dota patch MyApp-iOS Production -m

# Increase the rollout for v23 to 50%
dota patch MyApp-iOS Production -l v23 -rollout 50%`}</code>
            </pre>
            
            <p className="mb-4">
              <strong>Label parameter</strong>
              <br />
              Indicates which release (e.g. v23) you want to update within the specified deployment.
              If ommitted, the requested changes will be applied to the latest release in the
              specified deployment. In order to look up the label for the release you want to
              update, you can run the dota deployment history command and refer to the Label column.
            </p>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>This parameter can be set using either --label or -l</p>
              </div>
            </div>
            
            <p className="mb-4">
              <strong>Mandatory parameter</strong>
              <br />
              This is the same parameter as the one described in the above section, and simply
              allows you to update whether the release should be considered mandatory or not. Note
              that --mandatory and --mandatory true are equivalent, but the absence of this flag is
              not equivalent to --mandatory false. Therefore, if the parameter is ommitted, no
              change will be made to the value of the target release's mandatory property. You need
              to set this to --mandatory false to explicitly make a release optional.
            </p>
            
            <p className="mb-4">
              <strong>Description parameter</strong>
              <br />
              This is the same parameter as the one described in the above section, and simply
              allows you to update the description associated with the release (e.g. you made a typo
              when releasing, or you forgot to add a description at all). If this parameter is
              ommitted, no change will be made to the value of the target release's description
              property.
            </p>
            
            <p className="mb-4">
              <strong>Disabled parameter</strong>
              <br />
              This is the same parameter as the one described in the above section, and simply
              allows you to update whether the release should be disabled or not. Note that
              --disabled and --disabled true are equivalent, but the absence of this flag is not
              equivalent to --disabled false. Therefore, if the parameter is ommitted, no change
              will be made to the value of the target release's disabled property. You need to set
              this to --disabled false to explicitly make a release acquirable if it was previously
              disabled.
            </p>
            
            <p className="mb-4">
              <strong>Rollout parameter</strong>
              <br />
              This is the same parameter as the one described in the above section, and simply
              allows you to increase the rollout percentage of the target release. This parameter
              can only be set to an integer whose value is greater than the current rollout value.
              Additionally, if you want to "complete" the rollout, and therefore, make the release
              available to everyone, you can simply set this parameter to --rollout 100. If this
              parameter is ommitted, no change will be made to the value of the target release's
              rollout parameter.
            </p>
            
            <p className="mb-4">
              Additionally, as mentioned above, when you release an update without a rollout value,
              it is treated equivalently to setting the rollout to 100. Therefore, if you released
              an update without a rollout, you cannot change the rollout property of it via the
              patch command since that would be considered lowering the rollout percentage.
            </p>
            
            <p className="mb-4">
              <strong>Target binary version parameter</strong>
              <br />
              This is the same parameter as the one described in the above section, and simply
              allows you to update the semver range that indicates which binary version(s) a release
              is compatible with. This can be useful if you made a mistake when originally releasing
              an update (e.g. you specified 1.0.0 but meant 1.1.0) or you want to increase or
              decrease the version range that a release supports (e.g. you discovered that a release
              doesn't work with 1.1.2 after all). If this parameter is ommitted, no change will be
              made to the value of the target release's version property.
            </p>
            
            <pre className="code-block mb-6">
              <code>{`# Add a "max binary version" to an existing release
# by scoping its eligibility to users running >= 1.0.5
dota patch MyApp-iOS Staging -t "1.0.0 - 1.0.5"`}</code>
            </pre>
          </div>
          
          <div className="mb-8" id="promoting-updates">
            <h2 className="text-2xl font-bold mb-4">Promoting Updates</h2>
            
            <p className="mb-4">
              Once you've tested an update against a specific deployment (e.g. Staging), and you
              want to promote it "downstream" (e.g. dev{'>'}staging, staging{'>'}production), you
              can simply use the following command to copy the release from one deployment to
              another:
            </p>
            
            <pre className="code-block mb-6">
              <code>{`dota promote <appName> <sourceDeploymentName> <destDeploymentName>
[--description <description>]
[--label <label>]
[--disabled <disabled>]
[--mandatory]
[--noDuplicateReleaseError]
[--rollout <rolloutPercentage>]
[--targetBinaryVersion <targetBinaryVersion>]`}</code>
            </pre>
            
            <p className="mb-4">
              The promote command will create a new release for the destination deployment, which
              includes the exact code and metadata (description, mandatory and target binary
              version) from the latest release of the source deployment. While you could use the
              release command to "manually" migrate an update from one environment to another, the
              promote command has the following benefits:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                It's quicker, since you don't need to reassemble the release assets you want to
                publish or remember the description/app store version that are associated with the
                source deployment's release.
              </li>
              <li>
                It's less error-prone, since the promote operation ensures that the exact thing that
                you already tested in the source deployment (e.g. Staging) will become active in the
                destination deployment (e.g. Production).
              </li>
            </ul>
            
            <p className="mb-4">
              We recommend that all users take advantage of the automatically created Staging and
              Production environments, and do all releases directly to Staging, and then perform a
              promote from Staging to Production after performing the appropriate testing.
            </p>
            
            <p className="mb-4">
              <strong>Description parameter</strong>
              <br />
              This is the same parameter as the one described in the above section, and simply
              allows you to override the description that will be used for the promoted release. If
              unspecified, the new release will inherit the description from the release being
              promoted.
            </p>
            
            <p className="mb-4">
              <strong>Label parameter</strong>
              <br />
              This optional parameter allows you to pick the specified label from the source
              deployment and promote it to the destination deployment. If unspecified, the latest
              release on the source deployment will be promoted.
            </p>
            
            <p className="mb-4">
              <strong>Disabled parameter</strong>
              <br />
              This is the same parameter as the one described in the above section, and simply
              allows you to override the value of the disabled flag that will be used for the
              promoted release. If unspecified, the new release will inherit the disabled property
              from the release being promoted.
            </p>
            
            <p className="mb-4">
              <strong>Mandatory parameter</strong>
              <br />
              This is the same parameter as the one described in the above section, and simply
              allows you to override the mandatory flag that will be used for the promoted release.
              If unspecified, the new release will inherit the mandatory property from the release
              being promoted.
            </p>
            
            <p className="mb-4">
              <strong>No duplicate release error parameter</strong>
              <br />
              This is the same parameter as the one described in the above section.
            </p>
            
            <p className="mb-4">
              <strong>Rollout parameter</strong>
              <br />
              This is the same parameter as the one described in the above section, and allows you
              to specify whether the newly created release should only be made available to a
              portion of your users. Unlike the other release metadata parameters (e.g.
              description), the rollout of a release is not carried over/inherited as part of a
              promote, and therefore, you need to explicitly set this if you don't want the newly
              created release to be available to all of your users.
            </p>
            
            <p className="mb-4">
              <strong>Target binary version parameter</strong>
              <br />
              This is the same parameter as the one described in the above section, and simply
              allows you to override the target binary version that will be used for the promoted
              release. If unspecified, the new release will inherit the target binary version
              property from the release being promoted.
            </p>
            
            <pre className="code-block mb-6">
              <code>{`# Promote the release to production and make it
# available to all versions using that deployment
dota promote MyApp-iOS Staging Production -t "*"`}</code>
            </pre>
          </div>
          
          <div className="mb-8" id="rolling-back-updates">
            <h2 className="text-2xl font-bold mb-4">Rolling Back Updates</h2>
            
            <p className="mb-4">
              A deployment's release history is immutable, so you cannot delete or remove an update
              once it has been released. However, if you release an update that is broken or
              contains unintended features, it is easy to roll it back using the rollback command:
            </p>
            
            <pre className="code-block mb-6">
              <code>{`dota rollback <appName> <deploymentName>
dota rollback MyApp-iOS Production`}</code>
            </pre>
            
            <p className="mb-4">
              This has the effect of creating a new release for the deployment that includes the
              exact same code and metadata as the version prior to the latest one. For example,
              imagine that you released the following updates to your app:
            </p>
            
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Release</th>
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2 text-left">Mandatory</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">v1</td>
                  <td className="border p-2">Initial release!</td>
                  <td className="border p-2">Yes</td>
                </tr>
                <tr>
                  <td className="border p-2">v2</td>
                  <td className="border p-2">Added new feature</td>
                  <td className="border p-2">No</td>
                </tr>
                <tr>
                  <td className="border p-2">v3</td>
                  <td className="border p-2">Bug fixes</td>
                  <td className="border p-2">Yes</td>
                </tr>
              </tbody>
            </table>
            
            <p className="mb-4">
              If you ran the rollback command on that deployment, a new release (v4) would be
              created that included the contents of the v2 release.
            </p>
            
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Release</th>
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2 text-left">Mandatory</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">v1</td>
                  <td className="border p-2">Initial release!</td>
                  <td className="border p-2">Yes</td>
                </tr>
                <tr>
                  <td className="border p-2">v2</td>
                  <td className="border p-2">Added new feature</td>
                  <td className="border p-2">No</td>
                </tr>
                <tr>
                  <td className="border p-2">v3</td>
                  <td className="border p-2">Bug fixes</td>
                  <td className="border p-2">Yes</td>
                </tr>
                <tr>
                  <td className="border p-2">v4 (Rollback from v3 to v2)</td>
                  <td className="border p-2">Added new feature</td>
                  <td className="border p-2">No</td>
                </tr>
              </tbody>
            </table>
            
            <p className="mb-4">
              End-users that had already acquired v3 would now be "moved back" to v2 when the app
              performs an update check. Additionally, any users that were still running v2, and
              therefore, had never acquired v3, wouldn't receive an update since they are already
              running the latest release (this is why our update check uses the package hash in
              addition to the release label).
            </p>
            
            <p className="mb-4">
              If you would like to rollback a deployment to a release other than the previous (e.g.
              v3 {'->'} v2), you can specify the optional --targetRelease parameter:
            </p>
            
            <pre className="code-block mb-6">
              <code>dota rollback MyApp-iOS Production --targetRelease v34</code>
            </pre>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>
                  The release produced by a rollback will be annotated in the output of the
                  deployment history command to help identify them more easily.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-8" id="viewing-release-history">
            <h2 className="text-2xl font-bold mb-4">Viewing Release History</h2>
            
            <p className="mb-4">
              You can view a history of the 50 most recent releases for a specific app deployment
              using the following command:
            </p>
            
            <pre className="code-block mb-6">
              <code>dota deployment history &lt;appName&gt; &lt;deploymentName&gt;</code>
            </pre>
            
            <p className="mb-4">
              The history will display all attributes about each release (e.g. label, mandatory) as
              well as indicate if any releases were made due to a promotion or a rollback operation.
            </p>
            
            <p className="mb-4 text-center font-bold">Deployment History</p>
            
            <p className="mb-4">
              Additionally, the history displays the install metrics for each release. You can view
              the details about how to interpret the metric data in the documentation for the
              deployment ls command above.
            </p>
            
            <p className="mb-4">
              By default, the history doesn't display the author of each release, but if you are
              collaborating on an app with other developers, and want to view who released each
              update, you can pass the additional --displayAuthor (or -a) flag to the history
              command.
            </p>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>The history command can also be run using the "h" alias</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8" id="clearing-release-history">
            <h2 className="text-2xl font-bold mb-4">Clearing Release History</h2>
            
            <p className="mb-4">
              You can clear the release history associated with a deployment using the following
              command:
            </p>
            
            <pre className="code-block mb-6">
              <code>dota deployment clear &lt;appName&gt; &lt;deploymentName&gt;</code>
            </pre>
            
            <p className="mb-4">
              After running this command, client devices configured to receive updates using its
              associated deployment key will no longer receive the updates that have been cleared.
              This command is irreversible, and therefore should not be used in a production
              deployment.
            </p>
          </div>
          
          <div className="mb-8" id="debugging-codepush">
            <h2 className="text-2xl font-bold mb-4">Debugging CodePush Integration</h2>
            
            <p className="mb-4">
              Once you've released an update, React Native plugin has been integrated into your app,
              it can be helpful to diagnose how the plugin is behaving, especially if you run into
              an issue and want to understand why. In order to debug the CodePush update discovery
              experience, you can run the following command in order to easily view the diagnostic
              logs produced by the CodePush plugin within your app:
            </p>
            
            <pre className="code-block mb-6">
              <code>{`dota debug <platform>

# View all CodePush logs from a running
# instace of the iOS simulator.
dota debug ios

# View all CodePush logs from a running
# Android emulator or attached device.
dota debug android`}</code>
            </pre>
            
            <p className="mb-4">
              Under the covers, this command simply automates the usage of the iOS system logs and
              ADB logcat, but provides a platform-agnostic, filtered view of all logs coming from
              the CodePush plugin. This way, you don't need to learn and/or use another tool simply
              to be able to answer basic questions about how CodePush is behaving.
            </p>
            
            <div className="alert-note mb-6">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="alert-content">
                <strong>Note:</strong>
                <p>
                  The debug command supports both emulators and devices for Android, but currently
                  only supports listening to logs from the iOS simulator. We hope to add device
                  support soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
