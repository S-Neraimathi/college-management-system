// Specify date and time components separately for clarity
const year = 2024;
const month = 3; // April is 3 (zero-based index)
const day = 24;
const hour = 9;
const minute = 20;
const second = 26;

// Create a Date object for the specified UTC date and time
const utcDateTime = new Date(Date.UTC(year, month, day, hour, minute, second));

// Convert UTC time to IST (Indian Standard Time)
const istDateTime = utcDateTime.toLocaleString("en-US", {
  timeZone: "Asia/Kolkata", // Indian Standard Time
  hour12: true,
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

// Output IST time to the console
console.log("IST Time:", istDateTime);
