import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/index.css'; // Ensure this path is correct

// SVG Icon Components (minor refactor for clarity if preferred, or keep as is)
const IconLock = () => (
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
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const IconLayers = () => (
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
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 17 12 22 22 17"></polyline>
    <polyline points="2 12 12 17 22 12"></polyline>
  </svg>
);
const IconClock = () => (
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
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const IconCode = () => (
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
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);
const IconUsers = () => (
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
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
const IconGitHub = () => (
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
    className="ml-2 h-5 w-5"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const ArrowRight = () => (
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
    className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200"
  >
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

function App() {
  const [activeTab, setActiveTab] = useState('features');
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Refs for sections
  const sectionRefs = {
    features: useRef(null),
    documentation: useRef(null),
    faq: useRef(null),
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20); // Slightly increased threshold

      // Optional: Update activeTab based on scroll position
      // This can be complex to get right with smooth scrolling, so it's often simpler to manage via clicks
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = id => {
    setActiveTab(id);
    setMobileMenuOpen(false); // Close mobile menu on navigation
    const element = sectionRefs[id]?.current;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleFaq = index => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const navigateToInternalDocumentation = () => {
    navigate('/documentation/introduction'); // Ensure this route exists in your Router setup
  };

  const renderIcon = iconName => {
    switch (iconName) {
      case 'lock':
        return <IconLock />;
      case 'layers':
        return <IconLayers />;
      case 'clock':
        return <IconClock />;
      case 'code':
        return <IconCode />;
      case 'users':
        return <IconUsers />;
      case 'github':
        return <IconGitHub />;
      default:
        return null;
    }
  };

  const featuresData = [
    {
      icon: 'lock',
      title: 'Complete Control',
      desc: 'Full control over your deployment process and user data security.',
    },
    {
      icon: 'layers',
      title: 'Flexible Integration',
      desc: 'Seamlessly integrates with your existing CI/CD workflows.',
    },
    {
      icon: 'clock',
      title: 'Quick Updates',
      desc: 'Deploy updates instantly without App Store review delays.',
    },
    {
      icon: 'code',
      title: 'Powerful CLI Tools',
      desc: 'Robust command-line interface for automation and CI/CD integration.',
    },
    {
      icon: 'users',
      title: 'User Targeting',
      desc: 'Target specific user segments for A/B testing and gradual rollouts.',
    },
    {
      icon: 'github',
      title: 'Open Source',
      desc: 'MIT licensed—inspect, modify, contribute, and make it your own.',
    },
  ];

  const faqData = [
    {
      q: 'Is DOTA completely free and open source?',
      a: 'Yes—DOTA is MIT-licensed and 100% free. You can inspect the code, modify it to suit your needs, and distribute it as you like.',
    },
    {
      q: 'Can I self-host DOTA?',
      a: 'Absolutely! DOTA is designed to be self-hosted. You run the server in your own environment for complete control and data privacy.',
    },
    {
      q: 'Does it support staged rollouts?',
      a: 'Yes—you can target specific user segments or percentages for A/B testing and gradual rollouts. This helps manage risk when deploying critical updates.',
    },
    {
      q: 'How do I integrate DOTA with my app?',
      a: 'DOTA provides a CLI for your build pipeline and a React Native SDK for your app. Our step-by-step documentation guides you through the entire process.',
    },
    {
      q: 'Is DOTA compatible with Expo?',
      a: 'Yes, DOTA works with both bare React Native projects and Expo managed projects using EAS Build.',
    },
  ];

  const docLinks = [
    {
      id: 'installation',
      title: 'Server Installation',
      desc: 'Step-by-step guide to set up your DOTA server.',
      action: () => navigate('/documentation/deployment/local'),
    },
    {
      id: 'cli-usage',
      title: 'Client SDK Integration',
      desc: 'Integrate the DOTA client into your React Native app.',
      action: () => navigate('/documentation/sdk/integration'),
    },
    {
      id: 'deployment',
      title: 'CLI Reference',
      desc: 'Complete reference for the DOTA command-line tools.',
      action: () => navigate('/documentation/cli/commands'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col docs-landing-page bg-page-background">
      {/* Header/Nav */}
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${
          isScrolled ? 'bg-white/90 shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* Replace with your actual logo if you have one */}
            <span className="text-text-primary font-bold text-2xl tracking-tight">DOTA</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {['features', 'documentation', 'faq'].map(tabId => (
              <button
                key={tabId}
                onClick={() => scrollToSection(tabId)}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary focus:outline-none focus:text-primary ${
                  activeTab === tabId ? 'text-primary' : 'text-text-secondary'
                }`}
              >
                {tabId === 'faq' ? 'FAQ' : tabId.charAt(0).toUpperCase() + tabId.slice(1)}
              </button>
            ))}
          </nav>
          <div className="hidden md:flex items-center">
            <button onClick={navigateToInternalDocumentation} className="btn btn-primary font-bold text-white">
              Get Started <ArrowRight />
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-text-secondary hover:text-primary hover:bg-primary-lightest focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
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
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-40 py-2">
            <nav className="flex flex-col space-y-2 px-4">
              {['features', 'documentation', 'faq'].map(tabId => (
                <button
                  key={tabId}
                  onClick={() => scrollToSection(tabId)}
                  className={`block w-full text-left py-2 px-3 rounded-md text-base font-medium transition-colors duration-200 hover:bg-primary-lightest hover:text-primary focus:outline-none focus:text-primary ${
                    activeTab === tabId ? 'text-primary bg-primary-lightest' : 'text-text-secondary'
                  }`}
                >
                  {tabId === 'faq' ? 'FAQ' : tabId.charAt(0).toUpperCase() + tabId.slice(1)}
                </button>
              ))}
              <button
                onClick={navigateToInternalDocumentation}
                className="btn btn-primary w-full mt-2 font-bold text-white"
              >
                Get Started <ArrowRight />
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden hero-section">
          <div className="hero-gradient-animation"></div>
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left animate-fade-in-up">
                <div className="badge badge-subtle mb-6">
                  <span className="badge-dot bg-primary-accent"></span>
                  Open Source & Self-Hosted
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-text-heading mb-6 leading-tight">
                  Over-the-air React Native Updates.{' '}
                  <span className="text-primary">Instantly.</span>
                </h1>
                <p className="text-lg text-text-secondary mb-10 max-w-xl">
                Deliver updates to your React Native apps quickly without waiting for App Store approval. Gain complete control over your deployment pipeline and user data.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={navigateToInternalDocumentation}
                    className="btn btn-primary btn-lg group font-bold text-white"
                  >
                    Get Started Free <ArrowRight />
                  </button>
                  <a
                    href="https://github.com/dream-sports-labs/dota"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-lg group"
                  >
                    View on GitHub {renderIcon('github')}
                  </a>
                </div>
              </div>
              <div className="hidden md:block relative animate-float-slow">
                <div className="bg-white rounded-xl shadow-2xl border border-border-color p-1 terminal-container max-w-md mx-auto">
                  <div className="terminal-header bg-gray-100/80 p-2 border-b border-border-color flex items-center">
                    <div className="flex space-x-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-400"></span>
                      <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                      <span className="w-3 h-3 rounded-full bg-green-400"></span>
                    </div>
                    <span className="text-xs text-gray-500 ml-auto font-mono">bash</span>
                  </div>
                  <div className="bg-gray-800 rounded-b-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                    <pre>
                      <code>
                        <span className="text-sky-400">$</span> npm run dota:cli
                        <br />
                        <span className="text-emerald-400">✓</span> Setup complete! You can now use the CLI.
                        <br />
                        <br />
                        <span className="text-sky-400">$</span> dota release MyApp-iOS ./bundle 1.0.0
                        <br />
                        <span className="text-emerald-400">✓</span> Building JS bundle...
                        <br />
                        <span className="text-emerald-400">✓</span> Uploading assets...
                        <br />
                        <span className="text-emerald-400">✓</span> Update published to
                        'production'!
                        <br />
                      </code>
                    </pre>
                  </div>
                </div>
                {/* Decorative Blobs - refined */}
                <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 opacity-70"></div>
                <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary-accent/10 rounded-full blur-3xl -z-10 opacity-70"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" ref={sectionRefs.features} className="py-20 lg:py-28 bg-section-bg">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="badge badge-primary mb-4 font-bold text-white">
                <span className="badge-dot bg-white/50"></span>
                Core Features
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-heading mb-4 simple-heading">
                Why Choose DOTA?
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Empower your React Native development with robust, self-hosted over-the-air updates.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuresData.map((feature, i) => (
                <div key={i} className="feature-card group">
                  <div className="feature-icon">{renderIcon(feature.icon)}</div>
                  <h3 className="text-xl font-semibold mb-3 text-text-heading group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Code Example Section */}
        <section className="py-20 lg:py-28">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="badge badge-subtle mb-4">
                  <span className="badge-dot bg-primary-accent"></span>
                  Simple Integration
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-heading mb-4 simple-heading">
                  Easy to Implement & Use
                </h2>
                <p className="text-lg text-text-secondary mb-6">
                  Integrate DOTA into your React Native app with minimal setup. Our SDK simplifies
                  update checks and application.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Auto-update on app launch',
                    'Force updates for critical changes',
                    'Silent background updates',
                  ].map(item => (
                    <li key={item} className="flex items-start">
                      <div className="mr-3 mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <CheckIcon />
                      </div>
                      <span className="text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/documentation/sdk/integration')}
                  className="btn btn-secondary group"
                >
                  Explore SDK <ArrowRight />
                </button>
              </div>
              <div
                className="code-window-wrapper animate-fade-in-up"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="code-window">
                  <div className="code-header">
                    <div className="code-dots">
                      <span className="code-dot bg-red-400"></span>
                      <span className="code-dot bg-yellow-400"></span>
                      <span className="code-dot bg-green-400"></span>
                    </div>
                    <span className="code-title">App.js</span>
                  </div>
                  <div className="code-content">
                    <pre className="text-sm">
                      <code className="language-javascript">
                        {`import React from 'react';
import codePush from "react-native-code-push";
let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

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
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section
          id="documentation"
          ref={sectionRefs.documentation}
          className="py-20 lg:py-28 bg-section-bg"
        >
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="badge badge-primary mb-4 font-bold text-white">
                <span className="badge-dot bg-white/50"></span>
                Documentation
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-heading mb-4 simple-heading">
                Get Started with DOTA
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Our comprehensive documentation provides everything you need to integrate and manage
                DOTA.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {docLinks.map(doc => (
                <div key={doc.id} onClick={doc.action} className="doc-card group">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">{doc.desc}</p>
                  <div className="flex items-center text-primary font-medium text-sm">
                    Read Documentation
                    <ArrowRight />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <button onClick={navigateToInternalDocumentation} className="btn btn-primary group font-bold text-white">
                View Full Documentation <ArrowRight />
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" ref={sectionRefs.faq} className="py-20 lg:py-28">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="badge badge-subtle mb-4">
                <span className="badge-dot bg-primary-accent"></span>
                Need Help?
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-heading mb-4 simple-heading">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Find answers to common questions about DOTA's features and implementation.
              </p>
            </div>

            <div className="space-y-4">
              {faqData.map((item, i) => (
                <div key={i} className="faq-card">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="faq-question"
                    aria-expanded={expandedFaq === i}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span className="font-semibold text-lg text-text-heading">{item.q}</span>
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
                        expandedFaq === i ? 'rotate-180' : 'rotate-0'
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    className={`faq-answer ${expandedFaq === i ? 'open' : ''}`}
                  >
                    <p className="text-text-secondary pt-2">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28 bg-primary-dark text-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 simple-heading text-white">
                Ready to Control Your App Updates?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-10">
                Start using DOTA today. Deploy instantly, manage effectively, and own your update
                process.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={navigateToInternalDocumentation}
                  className="btn btn-cta-primary group" // Special CTA button style
                >
                  Get Started Now <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-color bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start mb-4 md:mb-0">
              <span className="text-text-primary font-bold text-xl">DOTA</span>
            </div>
            <nav className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mb-4 md:mb-0">
              <a
                href="#features"
                onClick={e => {
                  e.preventDefault();
                  scrollToSection('features');
                }}
                className="text-sm text-text-secondary hover:text-primary"
              >
                Features
              </a>
              <a
                href="#documentation"
                onClick={e => {
                  e.preventDefault();
                  scrollToSection('documentation');
                }}
                className="text-sm text-text-secondary hover:text-primary"
              >
                Documentation
              </a>
              <a
                href="#faq"
                onClick={e => {
                  e.preventDefault();
                  scrollToSection('faq');
                }}
                className="text-sm text-text-secondary hover:text-primary"
              >
                FAQ
              </a>
              {/* Add other links like Privacy Policy, Terms, etc. if needed */}
            </nav>
            <div className="text-sm text-text-tertiary text-center md:text-right">
              &copy; {new Date().getFullYear()} DOTA Project. MIT Licensed.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
