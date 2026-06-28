# Deployment Guide - x402 AI Multi-Provider Inference

This guide covers deploying the x402-ai-multi-provider application to Vercel with custom domain and per-provider pricing configuration.

## Prerequisites

- [Node.js 20+](https://nodejs.org/) (recommended: 24 LTS)
- [Git](https://git-scm.com/)
- [Vercel Account](https://vercel.com/signup)
- [GitHub Account](https://github.com/)
- API keys from AI providers (OpenAI, Anthropic, Groq, DeepInfra)
- [thirdweb Account](https://thirdweb.com/dashboard) for x402 payments

---

## Step 1: Fork the Repository

Fork the repository to your GitHub account:

[![Fork on GitHub](https://github.com/fork-button)](https://github.com/igor-holt/x402-ai-multi-provider/fork)

Or use the CLI:
```bash
gh repo fork igor-holt/x402-ai-multi-provider
```

---

## Step 2: Deploy to Vercel

### Option A: One-Click Deploy (RECOMMENDED)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Figor-holt%2Fx402-ai-multi-provider&env=OPENAI_API_KEY,ANTHROPIC_API_KEY,GROQ_API_KEY,DEEPINFRA_API_KEY,THIRDWEB_SECRET_KEY,THIRDWEB_SERVER_WALLET_ADDRESS,NEXT_PUBLIC_THIRDWEB_CLIENT_ID&project-name=x402-ai-multi-provider&repository-name=x402-ai-multi-provider)

This will automatically:
- Clone the repository to your Vercel account
- Create a new project
- Pre-configure environment variables
- Deploy to production

### Option B: CLI Deployment

```bash
# 1. Clone your fork
git clone https://github.com/YOUR_USERNAME/x402-ai-multi-provider.git
cd x402-ai-multi-provider

# 2. Install dependencies
npm install

# 3. Log in to Vercel
vercel login

# 4. Link project (if existing) or create new
vercel link

# 5. Deploy to production
vercel --prod
```

### Option C: Dashboard Import

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **"Import"** from Git
3. Select your forked repository
4. Configure environment variables (see below)
5. Click **Deploy**

---

## Step 3: Configure Environment Variables

In your Vercel project dashboard, navigate to **Settings > Environment Variables** and add the following:

### AI Provider API Keys

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key | Yes | `sk-...` |
| `ANTHROPIC_API_KEY` | Anthropic API key | Yes | `sk_ant_...` |
| `GROQ_API_KEY` | Groq API key | Yes | `gsk_...` |
| `DEEPINFRA_API_KEY` | DeepInfra API key | Yes | `...` |

**Get API Keys:**
- OpenAI: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Anthropic: [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
- Groq: [console.groq.com/keys](https://console.groq.com/keys)
- DeepInfra: [deepinfra.com/dashboard/api-keys](https://deepinfra.com/dashboard/api-keys)

### thirdweb Configuration

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `THIRDWEB_SECRET_KEY` | thirdweb secret key | Yes | `...` |
| `THIRDWEB_SERVER_WALLET_ADDRESS` | Your wallet address | Yes | `0x123...` |
| `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` | thirdweb client ID | Yes | `...` |

**Get thirdweb Keys:**
- Dashboard: [thirdweb.com/dashboard](https://thirdweb.com/dashboard)
- Settings > API Keys

---

## Step 4: Configure Custom Domain

### Option A: Vercel Dashboard

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings > Domains**
3. Click **"Add Domain"**
4. Enter your custom domain (e.g., `ai.yourdomain.com`)
5. Follow the DNS verification steps
6. Configure DNS records with your registrar

### Option B: CLI

```bash
# Add domain
vercel domains add ai.yourdomain.com

# Verify DNS configuration
vercel domains verify ai.yourdomain.com

# Assign to project
vercel link
vercel domains assign ai.yourdomain.com
```

### DNS Configuration

Add the following DNS records at your registrar:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | ai.yourdomain.com | cname.vercel-dns.com | Auto |
| CNAME | www.ai.yourdomain.com | cname.vercel-dns.com | Auto |

For root domain (yourdomain.com):
| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | Auto |

---

## Step 5: Configure Per-Provider Pricing

Pricing is configured in `/lib/pricing.ts`. You can customize it to match your costs and desired profit margins.

### Default Pricing Structure

```typescript
// In lib/pricing.ts

// Base prices per provider (in wei = 1/1,000,000 USDC)
export const PRICING_PER_TOKEN_WEI: Record<string, bigint> = {
  openai: BigInt(1),        // $0.000001 per token
  anthropic: BigInt(2),     // $0.000002 per token
  groq: BigInt(0.5),       // $0.0000005 per token
  deepinfra: BigInt(0.8),   // $0.0000008 per token
};

// Model-specific overrides
export const MODEL_PRICING_OVERRIDES: Partial<Record<modelID, bigint>> = {
  "gpt-5.1": BigInt(2),           // $0.000002 per token
  "gpt-5": BigInt(2),            // $0.000002 per token
  "claude-3-opus": BigInt(3),     // $0.000003 per token
  "groq-llama-3.1-405b": BigInt(1), // $0.000001 per token
};
```

### Pricing Strategy Recommendations

| Provider | Recommended Markup | Notes |
|----------|-------------------|-------|
| OpenAI | 1.5-2x | GPT-5 is premium |
| Anthropic | 1.5-2x | Claude Opus is expensive |
| Groq | 1.2-1.5x | Fast, lower cost base |
| DeepInfra | 1.3-1.6x | Open-source models |

### How to Update Pricing

1. Edit `/lib/pricing.ts`
2. Adjust the `PRICING_PER_TOKEN_WEI` values
3. Add model-specific overrides as needed
4. Commit and push to trigger redeployment

**Example: Higher profit margin**
```typescript
export const PRICING_PER_TOKEN_WEI = {
  openai: BigInt(2),        // $0.000002
  anthropic: BigInt(3),     // $0.000003
  groq: BigInt(1),         // $0.000001
  deepinfra: BigInt(1.5),   // $0.0000015
};
```

---

## Step 6: GitHub Actions Auto-Deployment

The repository includes a GitHub Actions workflow for automatic deployment on every push to `main`.

### Setup GitHub Secrets

Go to your repository **Settings > Secrets and variables > Actions** and add:

| Secret | Description | How to Get |
|--------|-------------|------------|
| `VERCEL_TOKEN` | Vercel API token | `vercel tokens create` or [Account Settings](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Team/Org ID | `vercel whoami --json` |
| `VERCEL_PROJECT_ID` | Project ID | `vercel link` or [Dashboard](https://vercel.com/dashboard) |

### Workflow Features

- **Triggers**: Push to `main` or pull requests
- **Production**: Auto-deploys on `main` branch
- **Preview**: Creates preview deployments for PRs
- **Node Version**: 24 (LTS)

### Manual Trigger

1. Go to **Actions** tab in your repository
2. Select **Deploy to Vercel** workflow
3. Click **Run workflow** dropdown
4. Select **main** branch
5. Click **Run workflow**

---

## Step 7: Verify Deployment

After deployment completes:

1. **Check the deployment URL** (shown in Vercel dashboard)
2. **Test with a wallet** containing USDC on Arbitrum
3. **Try different models** from the dropdown
4. **Verify costs** are calculated correctly

### Test Cases

1. **OpenAI GPT-5.1**: Should show ~$0.000002 per token
2. **Claude 3.7 Sonnet**: Should show ~$0.000002 per token
3. **Groq Llama 3.1 405B**: Should show ~$0.000001 per token
4. **DeepInfra Llama 3.1 405B**: Should show ~$0.0000008 per token

---

## Troubleshooting

### Build Failures

**Error: "No existing credentials found"**
- Solution: Run `vercel login` or ensure `VERCEL_TOKEN` is set

**Error: "Project not found"**
- Solution: Verify `VERCEL_PROJECT_ID` is correct

**Error: "API key not configured"**
- Solution: Add all required environment variables in Vercel dashboard

### Payment Issues

**Error: "Insufficient funds"**
- Solution: Add USDC to your wallet on Arbitrum

**Error: "Payment verification failed"**
- Solution: Ensure `THIRDWEB_SECRET_KEY` is correct and wallet has funds

### Model Issues

**Error: "Model not found"**
- Solution: Verify the model ID exists in `/lib/models.ts`

**Error: "API key invalid"**
- Solution: Verify the API key for the provider is correct

---

## Monitoring and Analytics

### Vercel Analytics
- Go to your project dashboard
- Navigate to **Analytics** tab
- View traffic, errors, and performance

### Logging
- View deployment logs: `vercel logs`
- View function logs: Available in Vercel dashboard

---

## Advanced Configuration

### Multiple Environments

Create separate Vercel projects for staging and production:

```bash
# Staging
vercel --env staging

# Production
vercel --prod --env production
```

### Custom Build Settings

Edit `vercel.json` for advanced configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "installCommand": "npm install",
        "zeroConfig": true
      }
    }
  ],
  "regions": ["iad1", "sfo1"]
}
```

### Edge Functions

Enable Edge Functions for faster response times:

1. Go to project settings
2. Enable **Edge Middleware**
3. Configure regions

---

## Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Rotate keys regularly** - Every 3-6 months
3. **Use spending limits** - Set API provider spending limits
4. **Enable rate limiting** - Consider adding rate limiting
5. **Monitor usage** - Set up alerts for unusual activity

---

## Cost Optimization

### Caching
- Enable Vercel caching for static assets
- Consider Redis for session caching

### Model Selection
- Use cheaper models for non-critical tasks
- Limit access to premium models
- Set token limits per request

### Pricing Strategy
- Adjust pricing based on demand
- Offer bulk discounts
- Consider subscription options

---

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **thirdweb Documentation**: [portal.thirdweb.com](https://portal.thirdweb.com)
- **AI SDK Documentation**: [ai-sdk.dev](https://ai-sdk.dev)
- **x402 Protocol**: [portal.thirdweb.com/x402](https://portal.thirdweb.com/x402)

---

## Deployment Checklist

- [ ] Forked repository to your GitHub
- [ ] Deployed to Vercel (one-click or CLI)
- [ ] Added all AI provider API keys
- [ ] Added thirdweb configuration
- [ ] Configured custom domain (optional)
- [ ] Customized pricing (optional)
- [ ] Set up GitHub Actions (optional)
- [ ] Tested with wallet
- [ ] Verified all models work

**You're ready to launch!** 🚀
