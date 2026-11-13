// 街坊的 prototype settings: the only file the owner needs to edit.
window.KAIFONG_CONFIG = {
  // Paste your two sign-up form links (Google Forms or Tally) between the quotes.
  // Leave a link empty ("") and its button shows "sign-up opening soon".
  riderFormUrl: "https://forms.gle/BjCH8FJwkQnhD2tV6",
  driverFormUrl: "https://forms.gle/KmXADjk5oKDaN9NS6",
  // Live sign-up counts: publish ONLY a "count" tab of each responses sheet as CSV (File > Share > Publish to web)
  // and paste the link here. The tab must contain just the number (e.g. =COUNTA('Form Responses 1'!A2:A)).
  riderCountCsv: "",
  driverCountCsv: "",
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
