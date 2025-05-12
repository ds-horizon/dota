import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const isActive = path => {
    return location.pathname === path ? { fontWeight: 'bold', color: 'var(--dota-600)' } : {};
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h3 className="sidebar-title">
          <Link to="/documentation/introduction" style={isActive('/documentation/introduction')}>
            Documentation
          </Link>
        </h3>
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <Link to="/documentation/introduction" style={isActive('/documentation/introduction')}>
              Introduction
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/documentation/installation" style={isActive('/documentation/installation')}>
              Installation
            </Link>
          </li>

          <li className="sidebar-section">
            <h4 className="sidebar-heading">Deployment</h4>
            <ul className="sidebar-subnav">
              <li className="sidebar-subitem">
                <Link
                  to="/documentation/deployment/local"
                  style={isActive('/documentation/deployment/local')}
                >
                  Local Deployment
                </Link>
              </li>
              <li className="sidebar-subitem">
                <Link
                  to="/documentation/deployment/aws"
                  style={isActive('/documentation/deployment/aws')}
                >
                  AWS
                </Link>
              </li>
              <li className="sidebar-subitem">
                <Link
                  to="/documentation/deployment/azure"
                  style={isActive('/documentation/deployment/azure')}
                >
                  Azure App Service
                </Link>
              </li>
            </ul>
          </li>

          <li className="sidebar-section">
            <h4 className="sidebar-heading">Configuration</h4>
            <ul className="sidebar-subnav">
              <li className="sidebar-subitem">
                <Link
                  to="/documentation/configuration/environment"
                  style={isActive('/documentation/configuration/environment')}
                >
                  Environment Variables
                </Link>
              </li>
              <li className="sidebar-subitem">
                <Link
                  to="/documentation/configuration/oauth"
                  style={isActive('/documentation/configuration/oauth')}
                >
                  OAuth Apps
                </Link>
              </li>
            </ul>
          </li>

          <li className="sidebar-section">
            <h4 className="sidebar-heading">SDK</h4>
            <ul className="sidebar-subnav">
              <li className="sidebar-subitem">
                <Link
                  to="/documentation/sdk/react-native"
                  style={isActive('/documentation/sdk/react-native')}
                >
                  React Native Setup
                </Link>
              </li>
              <li className="sidebar-subitem">
                <Link
                  to="/documentation/sdk/integration"
                  style={isActive('/documentation/sdk/integration')}
                >
                  SDK Integration
                </Link>
              </li>
            </ul>
          </li>

          <li className="sidebar-section">
            <h4 className="sidebar-heading">CLI</h4>
            <ul className="sidebar-subnav">
              <li className="sidebar-subitem">
                <Link
                  to="/documentation/cli/installation"
                  style={isActive('/documentation/cli/installation')}
                >
                  Installation
                </Link>
              </li>
              <li className="sidebar-subitem">
                <Link
                  to="/documentation/cli/commands"
                  style={isActive('/documentation/cli/commands')}
                >
                  Commands Reference
                </Link>
              </li>
            </ul>
          </li>

          <li className="sidebar-section">
            <h4 className="sidebar-heading">Web Dashboard</h4>
            <ul className="sidebar-subnav">
              <li className="sidebar-subitem">
                <Link
                  to="/documentation/web/setup"
                  style={isActive('/documentation/web/setup')}
                >
                  Setup
                </Link>
              </li>
              <li className="sidebar-subitem">
                <Link
                  to="/documentation/web/dashboard"
                  style={isActive('/documentation/web/dashboard')}
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </li>

          <li className="sidebar-section">
            <h4 className="sidebar-heading">Advanced</h4>
            <ul className="sidebar-subnav">
              <li className="sidebar-subitem">
                <Link
                  to="/documentation/advanced/metrics"
                  style={isActive('/documentation/advanced/metrics')}
                >
                  Metrics
                </Link>
              </li>
              <li className="sidebar-subitem">
                <Link
                  to="/documentation/advanced/naming"
                  style={isActive('/documentation/advanced/naming')}
                >
                  Naming Limitations
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
