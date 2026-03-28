// ─── PUZZLE DATA ───────────────────────────────────────────────────────────────
// To add new puzzles: add entries to this array.
// Each puzzle is tied to a date (YYYY-MM-DD). The puzzle for today's date will be shown.
// If no puzzle exists for today, puzzle index 0 is used as fallback.
// 
// Fields:
//   date     - "YYYY-MM-DD" string (today's puzzle)
//   name     - The correct boulder problem name (case-insensitive match)
//   grade    - e.g. "V7"
//   location - e.g. "Bishop, CA"
//   photo    - URL to the boulder photo (replace with your own hosted images)
//   aliases  - Array of additional accepted answers, e.g. ["Mandala", "The Mandala"]
//   (hints are auto-generated from grade and location — no need to enter separately)
//
// PHOTO NOTES: Replace the placeholder photo URLs below with your actual boulder photos.
// You can host photos on Google Drive, Dropbox, Imgur, or any image host.
// Use a direct image link (ending in .jpg, .png, etc.)

const PUZZLES = [
  {
    date: "2026-03-22",
    name: "Pamplemousse",
    aliases: ["Pamplemouse"],
    grade: "V10",
    location: "Brione, Switzerland",
    photo: "images/pamplemousse.png"
  },
  {
    date: "2026-03-23",
    name: "Mountain Man",
    aliases: [],
    grade: "V9",
    location: "Leavenworth, WA",
    photo: "images/mountain_man.jpg"
  },
  {
    date: "2026-03-24",
    name: "Hell or High Water",
    aliases: ["Hell or Highwater"],
    grade: "V11",
    location: "Leavenworth, WA",
    photo: "images/hell_or_high_water.jpg"
  },
  {
    date: "2026-03-25",
    name: "Drawn and Quartered",
    aliases: ["Drawn", "Drawn n Quartered", "Drawn & Quartered"],
    grade: "V13",
    location: "Leavenworth, WA",
    photo: "images/drawn_and_quartered.jpg"
  },
  {
    date: "2026-03-26",
    name: "Pimpsqueak",
    aliases: ["Pimp Squeak", "Pimpsqueek"],
    grade: "V8",
    location: "Leavenworth, WA",
    photo: "images/pimpsqueak.jpg"
  },
  {
    date: "2026-03-27",
    name: "The Finnish Line",
    aliases: ["Finnish Line", "Finish Line", "The Finish Line"],
    grade: "V15",
    location: "Rocklands, South Africa",
    photo: "images/finnish_line.jpg"
  },
  {
    date: "2026-03-28",
    name: "Loaded With Power",
    aliases: ["Loaded", "Loaded Direct"],
    grade: "V10",
    location: "Hueco, TX",
    photo: "images/loaded_with_power.jpg"
  },
  {
    date: "2026-03-29",
    name: "Gription",
    aliases: [],
    grade: "V9",
    location: "Moe's Valley, UT",
    photo: "images/gription.jpg"
  },
  {
    date: "2026-03-30",
    name: "Baba Hari Dass",
    aliases: ["Baba", "Babaharidass", "Baba Haridass", "Baba Haridas", "Baba Hari Das"],
    grade: "V7",
    location: "Squamish, BC",
    photo: "images/baba_hari_dass.jpg"
  },
  {
    date: "2026-03-31",
    name: "Takes a Village",
    aliases: ["It Takes a Village"],
    grade: "V13",
    location: "Gold Bar, WA",
    photo: "images/takes_a_village.jpg"
  },
  {
    date: "2026-04-01",
    name: "The Sleeping Lady",
    aliases: ["Sleeping Lady"],
    grade: "V2",
    location: "Leavenworth, WA",
    photo: "images/sleeping_lady.jpg"
  },
  {
    date: "2026-04-02",
    name: "The Beaten Path",
    aliases: ["Beaten Path"],
    grade: "V10",
    location: "Rocklands, South Africa",
    photo: "images/beaten_path.jpg"
  },
  {
    date: "2026-04-03",
    name: "Midnight Lightning",
    aliases: ["Midnite Lightning"],
    grade: "V8",
    location: "Yosemite, CA",
    photo: "images/midnight_lightning.jpg"
  },
  {
    date: "2026-04-04",
    name: "The Hatchling RIP",
    aliases: ["Hatchling"],
    grade: "V11",
    location: "Rocklands, South Africa",
    photo: "images/hatchling.jpg"
  },
  {
    date: "2026-04-05",
    name: "Volition",
    aliases: [],
    grade: "V11",
    location: "Gold Bar, WA",
    photo: "images/volition.jpg"
  },
  {
    date: "2026-04-06",
    name: "Jabberwocky",
    aliases: ["Jabberwock Arete", "Jabberwock", "Jabberwocky Arete", "Jaberwock", "Jaberwocky", "Jabberwocki", "Jaberwockey", "Jabberwalky"],
    grade: "V4",
    location: "Moe's Valley, UT",
    photo: "images/jabberwocky.jpg"
  },
  {
    date: "2026-04-07",
    name: "The Rhino",
    aliases: ["Rhino"],
    grade: "V8",
    location: "Rocklands, South Africa",
    photo: "images/rhino.jpg"
  }
];
