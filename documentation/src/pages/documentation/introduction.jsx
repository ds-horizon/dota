import React from 'react';

export default function Introduction() {
  return (
    <div className="content">
      <h1 className="text-4xl font-bold mb-6">Introduction</h1>
      <p className="mb-4">
        Welcome to DOTA! An end-to-end testing and deployment framework to manage over the air React Native releases. It is a simplified build sharing and testing system that skips all the tedious hassles of generating a new APK or IPA build everytime you make react native code changes. Once done with testing, the same bundle can be promoted to production to be consumed by your users. Sending OTA updates has never been simpler!
      </p>
      <div className="alert-note mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="alert-icon">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <div className="alert-content">
          <strong>Note:</strong>
          <p>Please read the CLI Docs as well to get a better understanding of the complete workflow.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Open Source & Contributions</h2>
      <p className="mb-4">
        DOTA SDK and CLI are open-source! 🎉 We believe in creating an accessible, collaborative platform that thrives on community contributions.
      </p>
      <p className="mb-6">
        <strong>Contribute:</strong> Interested in helping us improve? Check out our <a href="https://github.com/ds-horizon/dota" target="_blank" rel="noopener noreferrer" className="text-dota-600 hover:underline">GitHub repository</a> to get started! From feature suggestions to bug fixes, all contributions are welcome.
      </p>

      <h2 className="text-2xl font-bold mb-4">Features Offered</h2>
      <p className="mb-4">
        DOTA is more than just another npm module. It's a complete toolkit designed for superfast OTA updates. Key features include:
      </p>
      <ul className="list-disc pl-6 mb-6">
        <li className="mb-2">
          <strong>Command Line Tool:</strong> Used to create a React Native bundle for a specific version of your code and upload it to DOTA servers along with release notes and other meta information.
        </li>
        <li className="mb-2">
          <strong>Mobile SDK:</strong> Enables users to download and install a React Native update published by a developer without having to install a new app build (like apk/aab, ipa). DOTA SDK provides an intuitive UX from where a tester can manage and test different versions of your app conveniently. SDK provides an exhaustive API to manage and customize production installation strategies.
        </li>
        <li className="mb-2">
          <strong>Console:</strong> To manage everything related to your app like React Native bundles, adoption analytics, manual rollbacks, organization settings, team members, access control and distribution buckets.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
      <div className="grid gap-6 md:grid-cols-2 mb-6">

        <div className="rounded-lg border border-border-color bg-accent shadow-sm p-6">
          <h3 className="text-xl font-bold mb-2">Configure React Native</h3>
          <p className="text-muted-foreground mb-4">Set up your React Native application to work with DOTA</p>
          <a href="/documentation/sdk/react-native" className="text-dota-600 hover:text-dota-700 font-medium">
            Learn more →
          </a>
        </div>
        <div className="rounded-lg border border-border-color bg-accent shadow-sm p-6">
          <h3 className="text-xl font-bold mb-2">Get Started with CLI</h3>
          <p className="text-muted-foreground mb-4">Get up and running quickly with the DOTA server locally & CLI</p>
          <a href="/documentation/deployment/local" className="text-dota-600 hover:text-dota-700 font-medium">
            Learn more →
          </a>
        </div>
      </div>
    </div>
  );
} 