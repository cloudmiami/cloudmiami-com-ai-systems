# Dokploy Deployment Guide

## Overview
Deploy n8n and Twenty CRM on your Dokploy VPS (cloudmiami.net).

---

## 1. Deploy n8n (n8n.cloudmiami.net)

### In Dokploy Dashboard:
1. Go to **Projects** → Create new project "Cloud Miami Stack"
2. Add **Service** → Docker Compose
3. Paste this docker-compose.yml:

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.cloudmiami.net
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.cloudmiami.net/
      - GENERIC_TIMEZONE=America/New_York
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

### Environment Variables:
| Variable | Value |
|----------|-------|
| `N8N_ENCRYPTION_KEY` | Generate with `openssl rand -hex 32` |

### Domain Setup:
1. Add domain: `n8n.cloudmiami.net`
2. Enable HTTPS (Let's Encrypt)
3. Set port to `5678`

---

## 2. Deploy Twenty CRM (crm.cloudmiami.org)

### In Dokploy Dashboard:
1. Add **Service** → Docker Compose to same project
2. Paste this docker-compose.yml:

```yaml
version: '3.8'

services:
  twenty:
    image: twentyhq/twenty:latest
    container_name: twenty
    restart: always
    ports:
      - "3000:3000"
    environment:
      - SERVER_URL=https://crm.cloudmiami.org
      - FRONT_BASE_URL=https://crm.cloudmiami.org
      - PG_DATABASE_URL=postgresql://twenty:${POSTGRES_PASSWORD}@postgres:5432/twenty
      - REDIS_URL=redis://redis:6379
      - ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}
      - LOGIN_TOKEN_SECRET=${LOGIN_TOKEN_SECRET}
      - REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET}
      - FILE_TOKEN_SECRET=${FILE_TOKEN_SECRET}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    container_name: twenty_postgres
    restart: always
    environment:
      - POSTGRES_USER=twenty
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=twenty
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: twenty_redis
    restart: always
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Environment Variables:
| Variable | Value |
|----------|-------|
| `POSTGRES_PASSWORD` | Generate secure password |
| `ACCESS_TOKEN_SECRET` | `openssl rand -hex 32` |
| `LOGIN_TOKEN_SECRET` | `openssl rand -hex 32` |
| `REFRESH_TOKEN_SECRET` | `openssl rand -hex 32` |
| `FILE_TOKEN_SECRET` | `openssl rand -hex 32` |

### Domain Setup:
1. Add domain: `crm.cloudmiami.org`
2. Enable HTTPS (Let's Encrypt)
3. Set port to `3000`

---

## 3. Configure n8n Credentials

After n8n is running at https://n8n.cloudmiami.net:

### OpenAI API:
1. Go to **Settings** → **Credentials**
2. Add new credential: **OpenAI API**
3. Enter your OpenAI API key

### Twenty API:
1. Log into Twenty CRM
2. Go to **Settings** → **Developers** → **API Keys**
3. Create new API key
4. In n8n, add **HTTP Header Auth** credential:
   - Name: `Twenty API Key`
   - Header Name: `Authorization`
   - Header Value: `Bearer YOUR_TWENTY_API_KEY`

---

## 4. Import Workflow

1. In n8n, go to **Workflows**
2. Click **Import from File**
3. Upload `n8n-workflow.json` from this project
4. Activate the workflow

---

## 5. Update Chatbot Webhook URL

Once n8n is deployed, verify the webhook URL:
- Default: `https://n8n.cloudmiami.net/webhook/chatbot`

The chatbot is already configured to use this URL.

---

## Quick Verification

1. **n8n**: Visit https://n8n.cloudmiami.net
2. **Twenty**: Visit https://crm.cloudmiami.org
3. **Test Chatbot**: Use the chat on cloudmiami.org
4. **Check Lead**: See if it appears in Twenty CRM
