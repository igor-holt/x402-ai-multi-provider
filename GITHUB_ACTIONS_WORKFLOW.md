# GitHub Actions Workflow Setup

Due to GitHub OAuth scope limitations, the workflow file needs to be added manually to your repository.

## Step 1: Create Workflow Directory

```bash
mkdir -p .github/workflows
```

## Step 2: Create Deploy Workflow File

Create a new file at `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Pull Vercel environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build project
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to preview
        if: github.ref != 'refs/heads/main'
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
```

## Step 3: Add GitHub Secrets

Go to your repository **Settings > Secrets and variables > Actions** and add the following secrets:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `VERCEL_TOKEN` | Vercel API token | Run `vercel tokens create` or get from [Account Settings](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel Team/Organization ID | Run `vercel whoami --json` to find your org ID |
| `VERCEL_PROJECT_ID` | Vercel Project ID | Run `vercel link` in your project directory, or find in [Vercel Dashboard](https://vercel.com/dashboard) |

## Step 4: Commit and Push

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions workflow"
git push origin main
```

## How It Works

- **Triggers**: On every push to `main` branch or pull requests
- **Node Version**: Uses Node.js 24 (LTS)
- **Dependencies**: Installs with `npm ci`
- **Production**: Deploys to production on `main` branch
- **Preview**: Creates preview deployments for pull requests

## Workflow Permissions

The workflow requires the following GitHub Actions permissions:
- Read repository contents
- Write repository contents (for deployment)

## Troubleshooting

If the workflow fails with permission errors:

1. **"Workflow scope required"**: Your GitHub OAuth token doesn't have workflow permissions. Use a [Personal Access Token (PAT)](https://github.com/settings/tokens) with `workflow` scope instead.

2. **"VERCEL_TOKEN not found"**: Make sure the secret is added in GitHub repository settings.

3. **"VERCEL_PROJECT_ID not found"**: Verify the project ID is correct and the project exists in your Vercel account.

## Alternative: Manual Deployment

If you can't set up GitHub Actions, you can deploy manually:

```bash
# Install dependencies
npm install

# Deploy to production
vercel --prod
```

## Generating Vercel Token

To create a Vercel API token:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Create a new token
vercel tokens create
```

Or visit: [https://vercel.com/account/tokens](https://vercel.com/account/tokens)

## Getting Vercel Project ID

```bash
# Navigate to your project
cd x402-ai-multi-provider

# Link to existing project
vercel link

# The project ID will be shown in the output
```

Or find it in your [Vercel Dashboard](https://vercel.com/dashboard) project settings.
