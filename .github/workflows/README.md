# GitHub Actions Deployment

This workflow automatically deploys the x402-ai-multi-provider application to Vercel on every push to the `main` branch.

## Setup Instructions

### 1. Add Vercel Secrets to GitHub Repository

Go to your GitHub repository **Settings > Secrets and variables > Actions** and add the following secrets:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `VERCEL_TOKEN` | Vercel API token | Run `vercel tokens create` or get from [Vercel Account Settings](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel Team/Organization ID | Run `vercel whoami --json` to find your org ID |
| `VERCEL_PROJECT_ID` | Vercel Project ID | Run `vercel link` in your project directory, or find in [Vercel Dashboard](https://vercel.com/dashboard) |

### 2. Add Environment Variables to Vercel Project

In your [Vercel Dashboard](https://vercel.com/dashboard), go to your project and add these environment variables:

```
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GROQ_API_KEY=your_groq_key
DEEPINFRA_API_KEY=your_deepinfra_key
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
THIRDWEB_SERVER_WALLET_ADDRESS=your_wallet_address
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
```

### 3. Trigger First Deployment

Push any change to the `main` branch, or run the workflow manually from the GitHub Actions tab.

## Workflow Details

- **Triggers**: Push to `main` branch or pull requests
- **Node Version**: 24 (LTS)
- **Deployment**: 
  - Production: On `main` branch push
  - Preview: On pull requests

## Customizing

To change the deployment behavior:

1. **Change Node version**: Edit `node-version` in the `Install Node.js` step
2. **Change triggers**: Edit the `on:` section
3. **Add build steps**: Add steps before `vercel build`

## Troubleshooting

- **"No existing credentials found"**: Make sure `VERCEL_TOKEN` is set correctly
- **"Project not found"**: Verify `VERCEL_PROJECT_ID` is correct
- **Build failures**: Check the Vercel project settings and environment variables

## Manual Deployment

If the workflow fails, you can always deploy manually:

```bash
# Install dependencies
npm install

# Deploy to production
vercel --prod
```
