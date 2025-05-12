import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Documentation Pages
import Documentation from './pages/documentation/index.jsx';
import Introduction from './pages/documentation/introduction.jsx';
import Installation from './pages/documentation/installation.jsx';
import Contribution from './pages/documentation/contribution.jsx';

// Advanced Topics
import NamingLimitations from './pages/documentation/advanced/naming.jsx';
import Metrics from './pages/documentation/advanced/metrics.jsx';

// Configuration
import EnvironmentConfig from './pages/documentation/configuration/environment.jsx';
import OAuthConfig from './pages/documentation/configuration/oauth.jsx';

// SDK
import ReactNativeConfig from './pages/documentation/sdk/react-native.jsx';
import SDKIntegration from './pages/documentation/sdk/integration.jsx';

// CLI
import CLICommands from './pages/documentation/cli/commands.jsx';
import CLIInstallation from './pages/documentation/cli/installation.jsx';

// Web Dashboard
import WebDashboard from './pages/documentation/web/dashboard.jsx';
import WebSetup from './pages/documentation/web/setup.jsx';

// Deployment
import AWSDeployment from './pages/documentation/deployment/aws.jsx';
import AzureDeployment from './pages/documentation/deployment/azure.jsx';
import LocalDeployment from './pages/documentation/deployment/local.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Home route without Layout */}
        <Route path="/" element={<App />} />

        {/* Documentation routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/documentation" element={<Navigate to="/documentation/introduction" replace />} />
          <Route path="/documentation/introduction" element={<Introduction />} />
          <Route path="/documentation/installation" element={<Installation />} />
          <Route path="/documentation/contribution" element={<Contribution />} />

          {/* Advanced Topics Routes */}
          <Route path="/documentation/advanced/naming" element={<NamingLimitations />} />
          <Route path="/documentation/advanced/metrics" element={<Metrics />} />

          {/* Configuration Routes */}
          <Route path="/documentation/configuration/environment" element={<EnvironmentConfig />} />
          <Route path="/documentation/configuration/oauth" element={<OAuthConfig />} />

          {/* SDK Routes */}
          <Route path="/documentation/sdk/react-native" element={<ReactNativeConfig />} />
          <Route path="/documentation/sdk/integration" element={<SDKIntegration />} />

          {/* CLI Routes */}
          <Route path="/documentation/cli/commands" element={<CLICommands />} />
          <Route path="/documentation/cli/installation" element={<CLIInstallation />} />

          {/* Web Dashboard Routes */}
          <Route path="/documentation/web/setup" element={<WebSetup />} />
          <Route path="/documentation/web/dashboard" element={<WebDashboard />} />

          {/* Deployment Routes */}
          <Route path="/documentation/deployment/aws" element={<AWSDeployment />} />
          <Route path="/documentation/deployment/azure" element={<AzureDeployment />} />
          <Route path="/documentation/deployment/local" element={<LocalDeployment />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
