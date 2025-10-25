export default function AWSDeployment() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8" id="aws-deployment">
        AWS Deployment
      </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" id="prerequisites">
          Prerequisites
        </h2>
        <p className="mb-4">Before deploying DOTA Server to AWS, ensure you have the following:</p>

        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>An AWS account with appropriate permissions</li>
          <li>AWS CLI installed and configured with your credentials</li>
          <li>A basic understanding of AWS services (EC2, S3, IAM, etc.)</li>
          <li>Your DOTA codebase ready for deployment</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" id="deployment-architecture">
          Deployment Architecture
        </h2>
        <p className="mb-4">The recommended architecture for deploying DOTA on AWS includes:</p>

        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>EC2 instances to run the DOTA Server application</li>
          <li>S3 bucket for storing bundles and assets</li>
          <li>Elastic Load Balancer for distributing traffic</li>
          <li>IAM roles for managing permissions</li>
          <li>Optional: Amazon RDS for database (if using metrics)</li>
          <li>Optional: ElastiCache for Redis (if using metrics)</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" id="deployment-steps">
          Deployment Steps
        </h2>

        <ol className="list-decimal pl-6 space-y-4 mb-6">
          <li>
            <h3 className="text-xl font-semibold mb-2" id="setup-s3-bucket">
              Set up S3 Bucket
            </h3>
            <p className="mb-2">Create an S3 bucket to store DOTA bundles and assets:</p>
            <pre className="code-block">
              <code>
                aws s3 mb s3://dota-bundles-{'{your-identifier}'} --region {'{your-region}'}
              </code>
            </pre>
          </li>

          <li>
            <h3 className="text-xl font-semibold mb-2" id="create-iam-role">
              Create IAM Role
            </h3>
            <p className="mb-2">
              Create an IAM role with appropriate permissions for EC2 to access S3:
            </p>
            <pre className="code-block">
              <code>{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::dota-bundles-{your-identifier}",
        "arn:aws:s3:::dota-bundles-{your-identifier}/*"
      ]
    }
  ]
}`}</code>
            </pre>
          </li>

          <li>
            <h3 className="text-xl font-semibold mb-2" id="launch-ec2-instance">
              Launch EC2 Instance
            </h3>
            <p className="mb-2">Launch an EC2 instance with the following specifications:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Amazon Linux 2 or Ubuntu Server 20.04 LTS</li>
              <li>At least t3.small (2 vCPU, 2 GB RAM) for production</li>
              <li>Attach the IAM role created in step 2</li>
              <li>Configure security group to allow HTTP (80) and HTTPS (443)</li>
            </ul>
          </li>

          <li>
            <h3 className="text-xl font-semibold mb-2" id="install-dependencies">
              Install Dependencies
            </h3>
            <p className="mb-2">SSH into your EC2 instance and install required dependencies:</p>
            <pre className="code-block">
              <code>{`# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v14+)
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2`}</code>
            </pre>
          </li>

          <li>
            <h3 className="text-xl font-semibold mb-2" id="deploy-dota-server">
              Deploy DOTA Server
            </h3>
            <p className="mb-2">Clone and set up your DOTA Server:</p>
            <pre className="code-block">
              <code>{`# Clone repository
git clone https://github.com/ds-horizon/dota.git
cd dota-server

# Install dependencies
npm install

# Create .env file in api directory
cd api
cp .env.example .env
nano .env  # Edit with your configuration`}</code>
            </pre>

            <p className="mb-2">Configure your .env file with AWS-specific settings:</p>
            <pre className="code-block">
              <code>{`# AWS S3 Configuration
STORAGE_TYPE=s3
S3_BUCKET=dota-bundles-{your-identifier}
S3_REGION={your-region}

# Other required settings
SESSION_SECRET=your_secure_session_secret
# Authentication providers...
`}</code>
            </pre>
          </li>

          <li>
            <h3 className="text-xl font-semibold mb-2" id="start-server">
              Start the Server
            </h3>
            <p className="mb-2">Start DOTA Server using PM2:</p>
            <pre className="code-block">
              <code>{`# Build the application
npm run build

# Start with PM2
pm2 start npm --name "dota-server" -- start
pm2 save
pm2 startup  # Follow instructions to enable auto-start`}</code>
            </pre>
          </li>

          <li>
            <h3 className="text-xl font-semibold mb-2" id="setup-nginx">
              Set Up Nginx (Optional)
            </h3>
            <p className="mb-2">Install and configure Nginx as a reverse proxy:</p>
            <pre className="code-block">
              <code>{`# Install Nginx
sudo apt install -y nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/dota-server

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/dota-server /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx`}</code>
            </pre>
          </li>

          <li>
            <h3 className="text-xl font-semibold mb-2" id="setup-ssl">
              Set Up SSL with Let's Encrypt
            </h3>
            <p className="mb-2">Secure your DOTA Server with HTTPS:</p>
            <pre className="code-block">
              <code>{`# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Follow the prompts to complete the setup
`}</code>
            </pre>
          </li>
        </ol>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" id="monitoring-scaling">
          Monitoring and Scaling
        </h2>

        <p className="mb-4">For production deployments, consider implementing:</p>

        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>CloudWatch for monitoring server health and performance</li>
          <li>Auto Scaling Group to automatically adjust capacity</li>
          <li>Load Balancer to distribute traffic across multiple instances</li>
          <li>Route 53 for domain management</li>
        </ul>

        <div className="alert-tip">
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
              For larger deployments, consider using AWS Elastic Beanstalk or ECS for easier
              management and scaling.
            </p>
          </div>
        </div>
      </div>

      <div className="alert-warning mb-8">
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
            Always follow AWS security best practices, including using IAM roles with least
            privilege, enabling encryption for sensitive data, and regularly updating your server.
          </p>
        </div>
      </div>
    </div>
  );
}
