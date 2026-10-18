# Community Help Desk (Node.js + Express + MongoDB)

Chatbot for local questions (garbage pickup, bus timings, helplines) with
English / Hindi / Marathi, a Services page, and an admin panel.

## Setup
1. Install Node.js (v18+) and MongoDB (local) or create a free MongoDB Atlas cluster.
2. In this folder run:  `npm install`
3. Copy `.env.example` to `.env` and set `ADMIN_PASSWORD`
   (and `MONGO_URI` if you use Atlas).
4. Load sample data:  `npm run seed`
5. Start the server:  `npm start`   (or `npm run dev` to auto-restart)
6. Open http://localhost:5000

Users must register and log in (`/login.html`) before they can use the chatbot.
The admin panel shows registered users and who asked what.

Pages: `/` chat, `/login.html` login/register, `/services.html` browse data, `/admin.html` admin panel.
Open the site through the Node server (not VS Code Live Server), because the pages call `/api/...`.

## Files
- `server.js` – Express API, admin login (JWT), chat logging
- `bot.js` – chatbot logic and replies in 3 languages
- `models.js` – MongoDB models (Area, Bus, Helpline, ChatLog)
- `seed.js` – sample data
- `public/` – website (index, services, admin, style.css, scripts)
