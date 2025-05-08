export default function Contribution() {
  return (
    <div className="content">
      <h1 className="text-4xl font-bold mb-8" id="contribution">Contributing to DOTA</h1>
      
      <div className="mb-8">
        <p className="mb-4">
          We appreciate your interest in contributing to DOTA! This guide will help you get started with contributing to the project.
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" id="community">Join Our Community</h2>
        
        <div className="mb-6">
          <p className="mb-4">Join the DreamSportsLabs Discord server to connect with the community and get help with your contributions:</p>
          
          <div className="discord-container">
            <a 
              href="https://discord.gg/dreamsportslabs" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="discord-link"
            >
              <div className="discord-content">
                <div className="discord-logo">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" fill="#fff">
                    <path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53s-5.05 12.69-11.44 12.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.04 12.69-11.43 12.69Z"/>
                  </svg>
                </div>
                <div className="discord-text">
                  <h3>DreamSportsLabs Discord</h3>
                  <p>Join our community to discuss DOTA, get help, and contribute</p>
                </div>
              </div>
              <div className="discord-join">
                Join Server
              </div>
            </a>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" id="ways-to-contribute">Ways to Contribute</h2>
        
        <p className="mb-4">There are many ways to contribute to DOTA:</p>
        
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Report bugs and issues</li>
          <li>Suggest new features</li>
          <li>Improve documentation</li>
          <li>Submit pull requests with code improvements</li>
          <li>Help other users in the community</li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" id="github-workflow">GitHub Workflow</h2>
        
        <ol className="list-decimal pl-6 mb-6 space-y-4">
          <li>
            <h3 className="text-xl font-semibold mb-2">Fork the Repository</h3>
            <p>Start by forking the repository on GitHub.</p>
          </li>
          
          <li>
            <h3 className="text-xl font-semibold mb-2">Clone Your Fork</h3>
            <pre className="code-block">
              <code>git clone https://github.com/dream-sports-labs/dota.git</code>
            </pre>
          </li>
          
          <li>
            <h3 className="text-xl font-semibold mb-2">Create a Branch</h3>
            <pre className="code-block">
              <code>git checkout -b feature/your-feature-name</code>
            </pre>
          </li>
          
          <li>
            <h3 className="text-xl font-semibold mb-2">Make Your Changes</h3>
            <p>Implement your changes, adhering to the existing code style.</p>
          </li>
          
          <li>
            <h3 className="text-xl font-semibold mb-2">Commit Your Changes</h3>
            <pre className="code-block">
              <code>{`git add .
git commit -m "Description of your changes"`}</code>
            </pre>
          </li>
          
          <li>
            <h3 className="text-xl font-semibold mb-2">Push to Your Fork</h3>
            <pre className="code-block">
              <code>git push origin feature/your-feature-name</code>
            </pre>
          </li>
          
          <li>
            <h3 className="text-xl font-semibold mb-2">Create a Pull Request</h3>
            <p>Open a pull request from your fork to the main repository.</p>
          </li>
        </ol>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" id="code-standards">Code Standards</h2>
        
        <p className="mb-4">Please follow these guidelines when contributing code:</p>
        
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Follow the existing code style</li>
          <li>Write unit tests for new features</li>
          <li>Ensure all tests pass before submitting</li>
          <li>Update documentation as needed</li>
          <li>Keep pull requests focused on a single issue or feature</li>
        </ul>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 dark:bg-blue-900/20 dark:border-blue-600">
        <div className="flex">
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-bold">Note:</span> By contributing to this project, you agree to license your work under the same license as the project.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" id="getting-help">Getting Help</h2>
        
        <p className="mb-4">
          If you have any questions or need help with your contributions, please reach out through:
        </p>
        
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Discord:</strong> Join our <a href="https://discord.gg/dreamsportslabs" target="_blank" rel="noopener noreferrer" className="text-dota-600 hover:underline">DreamSportsLabs Discord server</a>
          </li>
          <li>
            <strong>GitHub Issues:</strong> Open an issue on our <a href="https://github.com/dream-sports-labs/dota/issues" target="_blank" rel="noopener noreferrer" className="text-dota-600 hover:underline">GitHub repository</a>
          </li>
        </ul>
      </div>
    </div>
  );
} 