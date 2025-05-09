import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import TableOfContents from './TableOfContents';
import ScrollToTop from './ScrollToTop';
import '../styles/globals.css';

// Define the navigation structure that matches the sidebar
const navigationItems = [
  { path: '/documentation/introduction', title: 'Introduction' },
  { path: '/documentation/installation', title: 'Installation' },
  {
    title: 'Deployment',
    children: [
      { path: '/documentation/deployment/local', title: 'Local Deployment' },
      { path: '/documentation/deployment/aws', title: 'AWS' },
      { path: '/documentation/deployment/azure', title: 'Azure App Service' },
    ],
  },
  {
    title: 'Configuration',
    children: [
      { path: '/documentation/configuration/environment', title: 'Environment Variables' },
      { path: '/documentation/configuration/oauth', title: 'OAuth Apps' },
    ],
  },
  {
    title: 'SDK',
    children: [
      { path: '/documentation/sdk/react-native', title: 'React Native Setup' },
      { path: '/documentation/sdk/integration', title: 'SDK Integration' },
    ],
  },
  {
    title: 'CLI',
    children: [
      { path: '/documentation/cli/installation', title: 'Installation' },
      { path: '/documentation/cli/commands', title: 'Commands Reference' },
    ],
  },
  {
    title: 'Advanced',
    children: [
      { path: '/documentation/advanced/metrics', title: 'Metrics' },
      { path: '/documentation/advanced/naming', title: 'Naming Limitations' },
    ],
  },
];

// Flatten the navigation to get a list of all routes in order
const flattenNavigation = items => {
  return items.reduce((acc, item) => {
    if (item.path) {
      acc.push({ path: item.path, title: item.title });
    }
    if (item.children) {
      acc = acc.concat(flattenNavigation(item.children));
    }
    return acc;
  }, []);
};

export default function Layout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const flatNav = flattenNavigation(navigationItems);

  // Find current page index in the flattened navigation
  const currentIndex = flatNav.findIndex(item => item.path === currentPath);

  // Determine previous and next pages
  const prevPage = currentIndex > 0 ? flatNav[currentIndex - 1] : null;
  const nextPage = currentIndex < flatNav.length - 1 ? flatNav[currentIndex + 1] : null;

  return (
    <div className="layout">
      <ScrollToTop />
      <Header />
      <div className="main-container">
        <aside className="sidebar-container">
          <Sidebar />
        </aside>
        <main className="content-container">
          <div className="content">
            <Outlet />
          </div>
          <div className="nav-buttons">
            {prevPage && (
              <Link to={prevPage.path} className="nav-button prev">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <div>
                  <div className="text-sm text-muted-foreground">Previous</div>
                  <div>{prevPage.title}</div>
                </div>
              </Link>
            )}
            {!prevPage && <div />}
            {nextPage && (
              <Link to={nextPage.path} className="nav-button next">
                <div>
                  <div className="text-sm text-muted-foreground">Next</div>
                  <div>{nextPage.title}</div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            )}
          </div>
          <Footer />
        </main>
        <aside className="toc-container">
          <TableOfContents />
        </aside>
      </div>
    </div>
  );
}
