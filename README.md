# EZY Skills — quick and complete guide

Light, clear README with everything you need to run and understand the project.

Snapshot: full-stack Learning Platform (React + Vite frontend, Node + Express backend, PostgreSQL), uses Firebase for push notifications.

---

## Quick start (3 steps)

1. Clone

```bash
git clone https://github.com/saifmalkurdi/EZY.git
cd EZY
```

2. Server (API)

```bash
cd server
npm install
cp .env.example .env      # edit .env with real values
# create DB (Postgres) then run schema
psql -U postgres -c 'CREATE DATABASE ezy_skills;'
node database/runSchema.js
npm start                 # starts: http://localhost:3000
```

3. Client (web app)

```bash
cd client
npm install
cp .env.example .env      # edit the VITE_ entries
npm run dev               # starts: http://localhost:5173
```

---

## What to configure (.env essentials)

Server (server/.env — required):

- DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT
- JWT_SECRET, JWT_EXPIRES_IN
- PORT, CLIENT_URL, SERVER_URL
- FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY_ID, FIREBASE_PRIVATE_KEY
- FIREBASE_CLIENT_EMAIL, FIREBASE_CLIENT_ID, FIREBASE_CLIENT_CERT_URL

Client (client/.env — required):

- VITE_API_URL
- VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID
- VITE_FIREBASE_VAPID_KEY (for web push)

Tip: use `cp .env.example .env` in each folder and fill in values from your Firebase + DB.

---

## Firebase (quick)

- Create/choose Firebase project.
- In console: enable Cloud Messaging and generate a Web Push (VAPID) key.
- Download Firebase service-account JSON for SERVER and extract the private key & client email to server/.env.
- Add client Firebase settings to `client/.env` and `client/public/firebase-config.js` (see .env.example).

---

## Security: IMPORTANT (must read)

- Do NOT commit any `.env` files, Firebase private keys, or secrets.
- I found committed .env files in this repo — you MUST remove them and rotate the exposed secrets (Firebase key, DB password, JWT secret).
- To remove secrets from Git history: use `git filter-repo` or BFG and then rotate keys — coordinate a force push with contributors.

Commands (example to unstage from next commit):

```bash
git rm --cached server/.env client/.env
git commit -m "remove committed env files"
git push
```

---

## Project layout (short)

- client/ — React + Vite app (src/, public/, .env.example)
- server/ — Node/Express API (routes, controllers, model, database, .env.example)
- database/runSchema.js — DB schema / initial data

---

## Extras

- Roles: Customer, Teacher, Admin
- Notifications: Firebase Cloud Messaging
- Payments and purchases flow are supported (server + client)

---

## Tests & debug

- API test page (server): http://localhost:3000/test

---

## License & Contributing

- Licensed under MIT — see LICENSE
- Contributions, issues & PRs are welcome — open one on GitHub

---

Author: Saif Malkurdi — https://github.com/saifmalkurdi
