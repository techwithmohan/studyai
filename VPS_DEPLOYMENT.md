# 🚀 StudyAI — VPS Deployment Guide

## Prerequisites

| Requirement | Minimum |
|---|---|
| **OS** | Ubuntu 22.04+ / Debian 12+ |
| **RAM** | 1 GB |
| **Node.js** | v18+ |
| **Docker** | Latest (for PostgreSQL) |
| **Domain** (optional) | e.g. `studyai.yourdomain.com` |

---

## Step 1: SSH into Your VPS

```bash
ssh root@YOUR_VPS_IP
```

---

## Step 2: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com | sh

# Verify
node -v    # v20.x
npm -v     # 10.x
docker -v  # Docker 27.x
```

---

## Step 3: Clone the Repository

```bash
cd /opt
git clone https://github.com/techwithmohan/studyai.git
cd studyai
```

---

## Step 4: Start PostgreSQL with Docker

```bash
docker run -d \
  --name studyai-postgres \
  --restart always \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD \
  -e POSTGRES_DB=studyai \
  -p 5433:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15-alpine
```

> ⚠️ Replace `YOUR_STRONG_PASSWORD` with a real password. The `-v pgdata:` flag persists data across container restarts.

---

## Step 5: Install App Dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

---

## Step 6: Configure Environment

```bash
nano server/.env
```

Paste the following (edit values):

```env
GEMINI_API_KEY=your_google_ai_api_key
GEMINI_MODEL=gemini-3.1-flash-lite
PORT=5000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=studyai
DB_PASSWORD=YOUR_STRONG_PASSWORD
DB_PORT=5433
```

---

## Step 7: Build the Frontend

```bash
npm run build
```

This creates the `dist/` folder with optimized static files.

---

## Step 8: Serve Frontend from Express

Add static file serving to `server/index.js` — add this **before** the `app.listen()` line:

```js
// Serve frontend build
app.use(express.static(path.join(__dirname, '..', 'dist')));

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
});
```

> 💡 This eliminates the need for a separate frontend server. Everything runs on port 5000.

---

## Step 9: Install PM2 (Process Manager)

```bash
npm install -g pm2

# Start the app
pm2 start server/index.js --name studyai

# Auto-start on reboot
pm2 startup
pm2 save
```

**Useful PM2 commands:**

```bash
pm2 status          # Check app status
pm2 logs studyai    # View logs
pm2 restart studyai # Restart after changes
pm2 stop studyai    # Stop the app
```

---

## Step 10: Set Up Nginx Reverse Proxy

```bash
apt install -y nginx
nano /etc/nginx/sites-available/studyai
```

Paste this config:

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/studyai /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

---

## Step 11: Add SSL with Let's Encrypt (Optional but Recommended)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d YOUR_DOMAIN
```

This auto-configures HTTPS on your Nginx config.

---

## Step 12: Update Frontend API URL

If using a domain, rebuild with the correct API URL:

```bash
VITE_API_URL=https://YOUR_DOMAIN/api npm run build
pm2 restart studyai
```

---

## 🔄 Deploying Updates

```bash
cd /opt/studyai
git pull origin main
npm install
cd server && npm install && cd ..
npm run build
pm2 restart studyai
```

---

## 🛡️ Security Checklist

- [ ] Change default PostgreSQL password
- [ ] Firewall: only expose ports 80, 443, 22
- [ ] Never commit `server/.env`
- [ ] Enable `fail2ban` for SSH protection
- [ ] Set up automated backups for PostgreSQL

```bash
# UFW Firewall setup
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

---

## 📊 Architecture

```
Client (Browser)
      │ HTTPS
      ▼
Nginx (Port 80/443) — Reverse Proxy + SSL
      │ HTTP :5000
      ▼
Express.js (PM2 Managed)
├── Static Files (dist/)
├── API Routes (/api/*)
└── Upload Handler
      │
      ├──► PostgreSQL (Docker :5433)
      ├──► Google Gemini API
      └──► PDF Storage (/server/uploads)
```

---

## ❓ Troubleshooting

| Issue | Solution |
|---|---|
| `ECONNREFUSED` on DB | Check Docker: `docker ps` — ensure postgres is running |
| `API_KEY_INVALID` | Verify your key at [aistudio.google.com](https://aistudio.google.com/apikey) |
| Nginx 502 Bad Gateway | Check PM2: `pm2 logs studyai` |
| PDF upload fails | Ensure `server/uploads/` exists with write permissions: `mkdir -p server/uploads && chmod 755 server/uploads` |
| Port already in use | `lsof -i :5000` then `kill -9 <PID>` |
