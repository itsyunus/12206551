# AffordMed Assignment Submission – 12206551

This repository contains my full submission for the AffordMed evaluation task. It includes:

- ✅ Logging Middleware (Reusable, works in both frontend & backend)
- ✅ Backend Test Submission
- ✅ Frontend Test Submission
- ✅ Screenshots
- ✅ Token integration

---

## 📁 Folder Structure

12206551/
├── Logging Middleware/
├── Backend Test Submission/
├── Frontend Test Submission/


---

## 🧩 Logging Middleware

A reusable logging module (`logging.ts`) that works across Node.js and browser environments.

### ✨ Features

- Supports log levels: `debug`, `info`, `warn`, `error`, `fatal`
- Works in both **Node.js** & **Browser**
- Auto-detects auth token from:
  - `.env` (`VITE_LOG_AUTH_TOKEN`)
  - `window.__LOG_AUTH_TOKEN__` for browser
- Gracefully handles timeouts and invalid configs

### 🛠️ Sample Usage

import { logger } from './logging';

await logger.info('frontend', 'api', 'User clicked "Book Now"', 'YOUR_BEARER_TOKEN');
💻 Frontend Test Submission
Built using React + Vite, this part simulates logging events from UI actions.

📂 Key Files
App.tsx – triggers log on UI interaction

components/ – reusable UI elements

pages/ – sample navigation views

🧪 Log Example
logger.error('frontend', 'utils', 'Invalid user input', token);
📸 Screenshots
Home Page UI	Logging Trigger

🖥️ Backend Test Submission
Powered by Node.js + Express, this backend simulates common API endpoints and logs server-side actions.

📂 Key Files
routes/ – API routes

controllers/ – Business logic with logging

src/ – Main Express app

🧪 Log Example
logger.warn('backend', 'controller', 'User not found during login', token);
🔐 How to Get Bearer Token
Register
POST http://20.244.56.144/evaluation-service/register
with JSON body:

{
  "email": "your_email@example.com",
  "name": "Your Name",
  "mobileNo": "9876543210",
  "githubUsername": "yourGitHub",
  "rollNo": "12206551",
  "accessCode": "access_code_from_email"
}
Get Auth Token
POST http://20.244.56.144/evaluation-service/auth

{
  "clientID": "from_step1",
  "clientSecret": "from_step1"
}
Use "access_token" from the response in your logging functions.

▶️ How to Run the Apps
Frontend
cd "Frontend Test Submission"
npm install
npm run dev
Open browser at: http://localhost:5173

Backend
cd "Backend Test Submission"
npm install
npm start
Runs on: http://localhost:3000

📸 Screenshot Files
Screenshots are stored here:

Frontend Test Submission/screenshots/home.png
<img width="1682" height="1178" alt="Screenshot 2025-07-14 112931" src="https://github.com/user-attachments/assets/e4b45d85-aa72-47ff-9a19-c87eadee6f29" />

Frontend Test Submission/screenshots/log.png
<img width="1627" height="1188" alt="Screenshot 2025-07-14 112946" src="https://github.com/user-attachments/assets/8d15ba75-87c9-4f6e-a69d-b6fb7d6a71f5" />

Backend Test Submission/screenshots/api-call.png
<img width="1633" height="1175" alt="Screenshot 2025-07-14 113003" src="https://github.com/user-attachments/assets/53d3ef35-cde8-4252-a813-690093772a58" />

✅ Submission Checklist
 Public GitHub repo named 12206551

 No personal info or AffordMed branding

 Folder structure exactly as instructed

 Reusable Logging Middleware

 Screenshot proof of log events

 Token used in logging calls

🧾 Meta
Submitted by: Shaik Mohammad Yunus
Roll No: 12206551
Email: yunussm0@gmail.com
GitHub: @itsyunus

### ✅ Next Steps for You
- Replace any `"YOUR_BEARER_TOKEN"` placeholders with your real token (if safe to share).
- Push the repo to GitHub.

Let me know if you want this saved into a `.md` file or zipped along with folder structure!
