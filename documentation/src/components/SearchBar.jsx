import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// This would come from a build process in a real app
// For demo purposes, we're defining some hard-coded search content
const searchableContent = [
  {
    title: 'Introduction',
    path: '/documentation/introduction',
    content:
      'DOTA is a React Native over-the-air update service. DOTA allows developers to deploy mobile app updates directly to users.',
    headings: ['Introduction', 'Features', 'Getting Started'],
  },
  {
    title: 'Installation',
    path: '/documentation/installation',
    content:
      'DOTA Server is a Node.js application that powers the DOTA Service. It allows users to deploy and manage over-the-air updates for their react-native applications.',
    headings: ['Installation', 'Deployment Options', 'Prerequisites'],
  },
  {
    title: 'Local Deployment',
    path: '/documentation/deployment/local',
    content:
      'The DOTA Server requires storage to operate. For the local setup, there is an option to use emulated local storage with Azurite.',
    headings: ['Prerequisites', 'Steps', 'HTTPS Configuration'],
  },
  {
    title: 'AWS Deployment',
    path: '/documentation/deployment/aws',
    content:
      'Before deploying DOTA Server to AWS, ensure you have an AWS account with appropriate permissions, AWS CLI installed, and your DOTA codebase ready.',
    headings: [
      'Prerequisites',
      'Deployment Architecture',
      'Deployment Steps',
      'Monitoring and Scaling',
    ],
  },
  {
    title: 'Azure App Service Deployment',
    path: '/documentation/deployment/azure',
    content:
      'Deploy DOTA Server to Azure App Service with Azure Blob Storage for bundles and Azure Key Vault for secrets management.',
    headings: [
      'Prerequisites',
      'Azure Resource Setup',
      'Deployment Steps',
      'Scaling and Monitoring',
    ],
  },
  {
    title: 'Environment Variables',
    path: '/documentation/configuration/environment',
    content:
      'DOTA Server is configured using environment variables. This page lists all available environment variables, their descriptions and default values.',
    headings: [
      'Server Configuration',
      'Storage Configuration',
      'Authentication Configuration',
      'Redis Configuration',
    ],
  },
  {
    title: 'React Native Setup',
    path: '/documentation/configuration/react-native',
    content:
      'Learn how to integrate DOTA with your React Native application for over-the-air updates.',
    headings: ['Setup', 'Installation', 'Configuration', 'Usage'],
  },
  {
    title: 'OAuth Apps Configuration',
    path: '/documentation/configuration/oauth',
    content:
      'DOTA uses GitHub and Microsoft as identity providers, so for authentication purposes, you need to have an OAuth App registration for DOTA.',
    headings: [
      'GitHub OAuth',
      'Microsoft OAuth',
      'Environment Configuration',
      'Testing Authentication',
    ],
  },
  {
    title: 'CLI Installation',
    path: '/documentation/cli/installation',
    content:
      'Learn how to install and set up the DOTA CLI tool for managing your over-the-air updates from the command line.',
    headings: ['Prerequisites', 'Installation Steps', 'Verification'],
  },
  {
    title: 'SDK Integration & Usage',
    path: '/documentation/sdk/integration',
    content:
      'Comprehensive guide to using the DOTA CLI tool and its API for managing over-the-air updates in React Native applications.',
    headings: ['Basic Commands', 'Advanced Usage', 'API Reference', 'Examples'],
  },
  {
    title: 'Metrics',
    path: '/documentation/advanced/metrics',
    content:
      'Learn how to monitor and analyze the performance and adoption of your over-the-air updates using DOTA metrics.',
    headings: ['Overview', 'Configuration', 'Available Metrics', 'Visualization'],
  },
  {
    title: 'Naming Limitations',
    path: '/documentation/advanced/naming',
    content:
      'Understanding the naming conventions and limitations in DOTA for packages, deployments, and other resources.',
    headings: ['Length Restrictions', 'Character Limitations', 'Reserved Names', 'Best Practices'],
  },
  {
    title: 'Documentation',
    path: '/documentation',
    content:
      'DOTA complete documentation covering all aspects of the React Native over-the-air update service.',
    headings: ['Getting Started', 'Core Concepts', 'Advanced Topics'],
  },
];

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  const performSearch = query => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Search through content (in a real app, this would be an API call)
    const results = searchableContent
      .filter(item => {
        const lowerQuery = query.toLowerCase();

        // Search in title
        if (item.title.toLowerCase().includes(lowerQuery)) {
          return true;
        }

        // Search in content
        if (item.content.toLowerCase().includes(lowerQuery)) {
          return true;
        }

        // Search in headings
        if (
          item.headings &&
          item.headings.some(heading => heading.toLowerCase().includes(lowerQuery))
        ) {
          return true;
        }

        return false;
      })
      .map(item => {
        // Find matching content to show context
        const lowerQuery = query.toLowerCase();
        let contextMatch = '';

        // Try to find a sentence containing the query
        const sentences = item.content.split('. ');
        for (const sentence of sentences) {
          if (sentence.toLowerCase().includes(lowerQuery)) {
            contextMatch = sentence;
            break;
          }
        }

        // If no sentence found, just use the first 100 chars
        if (!contextMatch) {
          contextMatch = item.content.slice(0, 100) + '...';
        }

        return {
          title: item.title,
          path: item.path,
          context: contextMatch,
        };
      });

    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSearchChange = e => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
    setShowResults(true);
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (searchResults.length > 0) {
      // Navigate to the first result
      navigate(searchResults[0].path);
      setShowResults(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
          onFocus={() => {
            if (searchQuery.length >= 2) {
              setShowResults(true);
            }
          }}
        />
        <button type="submit" className="search-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>

      {showResults && searchQuery.length >= 2 && (
        <div className="search-results-dropdown">
          {isSearching ? (
            <div className="search-loading">Searching...</div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="search-results-count">{searchResults.length} results</div>
              <ul className="search-results-list">
                {searchResults.map((result, index) => (
                  <li key={index} className="search-result-item">
                    <a
                      href={result.path}
                      onClick={e => {
                        e.preventDefault();
                        navigate(result.path);
                        setShowResults(false);
                        setSearchQuery('');
                      }}
                      className="search-result-link"
                    >
                      <span className="search-result-title">{result.title}</span>
                      <p className="search-result-context">{result.context}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="search-no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
