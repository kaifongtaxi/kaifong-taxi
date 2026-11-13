// 街坊的 prototype settings: the only file the owner needs to edit.
window.KAIFONG_CONFIG = {
  // Paste your two sign-up form links (Google Forms or Tally) between the quotes.
  // Leave a link empty ("") and its button shows "sign-up opening soon".
  riderFormUrl: "https://forms.gle/BjCH8FJwkQnhD2tV6",
  driverFormUrl: "https://forms.gle/KmXADjk5oKDaN9NS6",
  // Live sign-up counts: publish ONLY a "count" tab of each responses sheet as CSV (File > Share > Publish to web)
  // and paste the link here. The tab must contain just the number (e.g. =COUNTA('Form Responses 1'!A2:A)).
  // Published "count" tab: rows like "Passengers,0" and "Drivers,0" (or A1 / B1 numbers).
  countCsv: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT04ZsNsAS3sy-QORRqa_ADOtOYY4HL88VStb5ppM1uHEiacRZf0G5v1So2o-WW226FiLiIQNHSCUJ3/pub?gid=0&single=true&output=csv",
  riderCountCsv: "",
  driverCountCsv: "",
  // Public progress log (newest first) and running totals, shown on the site. Update weekly.
  progress: [
    { date: "2026-11-13", zh: "開始同第一批街坊分享，睇吓邊個想一齊做", en: "Started sharing with the first neighbours to see who wants to join" },
    { date: "2026-11-13", zh: "私隱政策、使用條款同俾意見表格上線", en: "Added the privacy policy, terms of use and a feedback form" },
    { date: "2026-11-13", zh: "示範版上線，乘客同師傅登記表開放", en: "Demo went live; passenger and driver sign-up forms opened" }
  ],
  spentHKD: 0,
  incomeHKD: 0,
  feedbackFormUrl: "https://forms.gle/CQHRyohfGWj1SUxF7",
  contactEmail: "kaifongtaxi@gmail.com",

  // Launch progress, shown on the home page. Update the two counts by hand (e.g. weekly) from the form responses.
  driversSignedUp: 0,
  ridersSignedUp: 0,
  // Step 1: enough interest to build the real app
  buildDrivers: 10,
  buildRiders: 100,
  buildBy: "2026-12-15",
  // Step 2: enough people to open the trial
  launchDrivers: 30,
  launchRiders: 300,
  launchDate: "2027-03-01"
};
