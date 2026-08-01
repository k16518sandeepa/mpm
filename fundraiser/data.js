/*
  MPM FUNDRAISER — DATA FILE
  ---------------------------------
  This is the ONLY file that holds real numbers. Both index.html (public page)
  and admin.html (entry tool) read it via <script src="data.js">.

  HOW TO UPDATE THE LIVE PAGE:
  1. Open admin.html on your own computer (double-click it, no server needed).
  2. Add/edit donations and expenses.
  3. Click "Export data.js" — it downloads an updated copy of this exact file.
  4. Upload that file to your host, replacing this one, next to index.html.
  That's it — no database, no backend.
*/
const FUNDRAISING_DATA = {
  "projectName": "MPM Server & Streaming Upgrade",
  "goal": 500000,
  "currency": "LKR",
  "startDate": "2026-06-01",
  "donations": [
    { "name": "Kasun P.", "amount": 7500, "date": "2026-06-02", "note": "", "anonymous": false },
    { "name": "Anonymous", "amount": 15000, "date": "2026-06-04", "note": "Keep up the good work", "anonymous": true },
    { "name": "Nadeesha W.", "amount": 5000, "date": "2026-06-06", "note": "", "anonymous": false },
    { "name": "Ravindu S.", "amount": 25000, "date": "2026-06-10", "note": "For the anime section", "anonymous": false },
    { "name": "Anonymous", "amount": 3000, "date": "2026-06-12", "note": "", "anonymous": true },
    { "name": "Dilshan F.", "amount": 10000, "date": "2026-06-18", "note": "", "anonymous": false },
    { "name": "Ishara G.", "amount": 5000, "date": "2026-06-25", "note": "", "anonymous": false },
    { "name": "Tharindu M.", "amount": 20000, "date": "2026-07-03", "note": "", "anonymous": false },
    { "name": "Sanduni K.", "amount": 2500, "date": "2026-07-10", "note": "", "anonymous": false },
    { "name": "Anonymous", "amount": 12000, "date": "2026-07-18", "note": "", "anonymous": true },
    { "name": "Chamath R.", "amount": 8000, "date": "2026-07-24", "note": "", "anonymous": false },
    { "name": "Hasitha N.", "amount": 5000, "date": "2026-07-29", "note": "", "anonymous": false }
  ],
  "expenses": [
    { "title": "VPS renewal — 6 months", "amount": 42000, "date": "2026-06-15", "category": "Hosting" },
    { "title": "Domain renewal (motionpicturemafia.com)", "amount": 6500, "date": "2026-06-20", "category": "Hosting" },
    { "title": "Storage upgrade — SeedVault", "amount": 18000, "date": "2026-07-05", "category": "Storage" },
    { "title": "Encoding server GPU rental", "amount": 25000, "date": "2026-07-15", "category": "Infrastructure" }
  ]
};
