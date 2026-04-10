// ─── PUZZLE DATA ───────────────────────────────────────────────────────────────
// To add new puzzles: add entries to this array.
// Each puzzle is tied to a date (YYYY-MM-DD). The puzzle for today's date will be shown.
// If no puzzle exists for today, puzzle index 0 is used as fallback.
// 
// Fields:
//   date     - "YYYY-MM-DD" string (today's puzzle)
//   name     - The correct boulder problem name (case-insensitive match)
//   grade    - e.g. "V10"
//   location - e.g. "Bishop, CA"
//   photo    - URL to the boulder photo (replace with your own hosted images)
//   aliases  - Array of additional accepted answers, e.g. ["Mandala", "The Mandala"]
//   (hints are auto-generated from grade and location — no need to enter separately)
//
// PHOTO NOTES:
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
    location: "Hueco Tanks, TX",
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
    name: "Volition",
    aliases: [],
    grade: "V11",
    location: "Gold Bar, WA",
    photo: "images/volition.jpg"
  },
  {
    date: "2026-04-05",
    name: "The Hatchling (RIP)",
    aliases: ["Hatchling", "The Hatchling"],
    grade: "V11",
    location: "Rocklands, South Africa",
    photo: "images/hatchling.jpg"
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
    name: "Pro Touch Traverse",
    aliases: ["Pro Touch", "Protouch Traverse", "Protouch"],
    grade: "V6",
    location: "Brione, Switzerland",
    photo: "images/pro_touch.jpg"
  },
  {
    date: "2026-04-08",
    name: "Detached Flake",
    aliases: [],
    grade: "V1",
    location: "Squamish, BC",
    photo: "images/detached_flake.jpg"
  },
  {
    date: "2026-04-09",
    name: "The Baptist",
    aliases: ["Baptist"],
    grade: "V10",
    location: "Sculptured Rocks, NH",
    photo: "images/baptist.jpg"
  },
  {
    date: "2026-04-10",
    name: "Bloody Knuckles",
    aliases: [],
    grade: "V11",
    location: "Horseshoe Canyon Ranch, AR",
    photo: "images/bloody_knuckles.jpg"
  },
  {
    date: "2026-04-11",
    name: "Sundial",
    aliases: ["Sun Dial"],
    grade: "V8",
    location: "Little Cottonwood Canyon, UT",
    photo: "images/sundial.jpg"
  },
  {
    date: "2026-04-12",
    name: "Checkerboard",
    aliases: ["The Checkerboard"],
    grade: "V8",
    location: "Bishop, CA",
    photo: "images/checkerboard.jpg"
  },
  {
    date: "2026-04-13",
    name: "ATD",
    aliases: [],
    grade: "V7",
    location: "Squamish, BC",
    photo: "images/atd.png"
  },
  {
    date: "2026-04-14",
    name: "Ghostface",
    aliases: ["Ghost Face"],
    grade: "V12",
    location: "Red Rocks, NV",
    photo: "images/ghostface.jpg"
  },
  {
    date: "2026-04-15",
    name: "King Air",
    aliases: ["Kingair"],
    grade: "V10",
    location: "Yosemite, CA",
    photo: "images/king_air.jpg"
  },
  {
    date: "2026-04-16",
    name: "No Troublems",
    aliases: [],
    grade: "V10",
    location: "Squamish, BC",
    photo: "images/no_troublems.jpg"
  },
  {
    date: "2026-04-17",
    name: "King Cobra",
    aliases: ["King Kobra", "Cobra", "Kobra"],
    grade: "V8",
    location: "Yosemite, CA",
    photo: "images/king_cobra.png"
  },
  {
    date: "2026-04-18",
    name: "Knob Job",
    aliases: ["Nob Job", "Knob"],
    grade: "V2",
    location: "Index, WA",
    photo: "images/knob_job.jpg"
  },
  {
    date: "2026-04-19",
    name: "The Rhino",
    aliases: ["Rhino"],
    grade: "V8",
    location: "Rocklands, South Africa",
    photo: "images/rhino.jpg"
  },
  {
    date: "2026-04-20",
    name: "Mega Man",
    aliases: ["Megaman"],
    grade: "V11",
    location: "Hospital Boulders, AL",
    photo: "images/mega_man.jpg"
  },
  {
    date: "2026-04-21",
    name: "The King",
    aliases: ["King and I", "The King and I", "King"],
    grade: "V6",
    location: "Yosemite, CA",
    photo: "images/king.jpg"
  },
  {
    date: "2026-04-22",
    name: "Nutsa",
    aliases: ["Nutza"],
    grade: "V11",
    location: "Rocklands, South Africa",
    photo: "images/nutsa.jpg"
  },
  {
    date: "2026-04-23",
    name: "Origami Titan",
    aliases: ["Bubblewrap", "Bubble Wrap"],
    grade: "V11",
    location: "Snake Hill, WV",
    photo: "images/origami_titan.jpg"
  },
  {
    date: "2026-04-24",
    name: "Pan Galactic Gargle Blaster",
    aliases: ["Pan Galactic", "Gargle Blaster", "Pangalactic", "Pan Galactic Gargle Blasters", "Pangalactic Gargle Blaster"],
    grade: "V10",
    location: "Ibex, UT",
    photo: "images/pan_galactic_gargle_blaster.jpg"
  },
  {
    date: "2026-04-25",
    name: "The Shield",
    aliases: ["Shield"],
    grade: "V12",
    location: "Stone Fort, TN",
    photo: "images/shield.jpg"
  },
  {
    date: "2026-04-26",
    name: "Plumber's Crack",
    aliases: ["Plumbers Crack"],
    grade: "V2",
    location: "Red Rocks, NV",
    photo: "images/plumbers_crack.jpg"
  },
  {
    date: "2026-04-27",
    name: "Majestic",
    aliases: [],
    grade: "V6",
    location: "Squamish, BC",
    photo: "images/majestic.jpg"
  },
  {
    date: "2026-04-28",
    name: "Roses and Bluejays",
    aliases: ["Roses", "Roses and Blue Jays", "Roses & Bluejays", "Roses & Blue Jays"],
    grade: "V13",
    location: "Great Barrington, MA",
    photo: "images/roses_and_bluejays.jpg"
  },
  {
    date: "2026-04-29",
    name: "Squoze",
    aliases: ["Squoz"],
    grade: "V14",
    location: "Red Rocks, NV",
    photo: "images/squoze.jpg"
  },
  {
    date: "2026-04-30",
    name: "Blue Steel",
    aliases: [],
    grade: "V8",
    location: "Little Cottonwood Canyon, UT",
    photo: "images/blue_steel.jpg"
  },
  {
    date: "2026-05-01",
    name: "The Sword",
    aliases: ["Sword"],
    grade: "V3",
    location: "Leavenworth, WA",
    photo: "images/sword.jpg"
  },
  {
    date: "2026-05-02",
    name: "Pinotage",
    aliases: ["Pino Tage", "Pinotage Sit"],
    grade: "V8",
    location: "Rocklands, South Africa",
    photo: "images/pinotage.jpg"
  },
  {
    date: "2026-05-03",
    name: "Wookie Charms",
    aliases: ["Wooky Charms"],
    grade: "V12",
    location: "Chattanooga, TN",
    photo: "images/wookie_charms.jpg"
  },
  {
    date: "2026-05-04",
    name: "Pipe Dreams",
    aliases: ["Pipe Dream"],
    grade: "V10",
    location: "Farley, MA",
    photo: "images/pipe_dreams.jpg"
  },
  {
    date: "2026-05-05",
    name: "Golden Harvest",
    aliases: ["Gold Harvest", "Golden Showers"],
    grade: "V10",
    location: "Rocktown, GA",
    photo: "images/golden_harvest.jpg"
  },
  {
    date: "2026-05-06",
    name: "Tiger Claw",
    aliases: ["Tigerclaw"],
    grade: "V11",
    location: "Rocklands, South Africa",
    photo: "images/tiger_claw.jpg"
  },
  {
    date: "2026-05-07",
    name: "Resident Evil",
    aliases: [],
    grade: "V10",
    location: "Joe's Valley, UT",
    photo: "images/resident_evil.jpg"
  },
  {
    date: "2026-05-08",
    name: "Drawn and Quartered",
    aliases: ["Drawn", "Drawn n Quartered", "Drawn & Quartered"],
    grade: "V13",
    location: "Leavenworth, WA",
    photo: "images/drawn_and_quartered.png"
  },
  {
    date: "2026-05-09",
    name: "Icarus",
    aliases: [],
    grade: "V7",
    location: "Roy, NM",
    photo: "images/icarus.png"
  },
  {
    date: "2026-05-10",
    name: "Sunseeker",
    aliases: ["Sun Seeker"],
    grade: "V12",
    location: "Mt. Evans, CO",
    photo: "images/sunseeker.jpg"
  },
  {
    date: "2026-05-11",
    name: "Robot Heart",
    aliases: ["Robot Hearts"],
    grade: "V8",
    location: "Index, WA",
    photo: "images/robot_heart.jpg"
  },
  {
    date: "2026-05-12",
    name: "The Game",
    aliases: ["Game"],
    grade: "V15",
    location: "Boulder Canyon, CO",
    photo: "images/the_game.png"
  },
  {
    date: "2026-05-13",
    name: "Everest",
    aliases: ["Sagarmatha", "Everest aka Sagarmatha"],
    grade: "V5",
    location: "Joe's Valley, UT",
    photo: "images/everest.jpg"
  },
  {
    date: "2026-05-14",
    name: "Flux for Life",
    aliases: [],
    grade: "V13",
    location: "RMNP, CO",
    photo: "images/flux_for_life.jpg"
  },
  {
    date: "2026-05-15",
    name: "Bierstadt",
    aliases: ["Beirstadt"],
    grade: "V10",
    location: "Mt. Evans, CO",
    photo: "images/bierstadt.jpg"
  },
  {
    date: "2026-05-16",
    name: "Circus Trick",
    aliases: ["Circus Tricks"],
    grade: "V6",
    location: "Moab, UT",
    photo: "images/circus_trick.jpg"
  },
  {
    date: "2026-05-17",
    name: "The Zodiac",
    aliases: ["Zodiac"],
    grade: "V12",
    location: "Joe's Valley, UT",
    photo: "images/the_zodiac.jpg"
  },
  {
    date: "2026-05-18",
    name: "Paint it Black",
    aliases: ["Paint It Black"],
    grade: "V15",
    location: "RMNP, CO",
    photo: "images/paint_it_black.jpg"
  },
  {
    date: "2026-05-19",
    name: "Iron Man Traverse",
    aliases: ["Ironman Traverse", "Iron Man", "Ironman"],
    grade: "V4",
    location: "Bishop, CA",
    photo: "images/iron_man_traverse.jpg"
  },
  {
    date: "2026-05-20",
    name: "Hell Belly",
    aliases: ["Hellbelly"],
    grade: "V11",
    location: "Moab, UT",
    photo: "images/hell_belly.jpg"
  },
  {
    date: "2026-05-21",
    name: "Vecchio Leone",
    aliases: ["Old Lion", "Vechio Leone"],
    grade: "V13",
    location: "Brione, Switzerland",
    photo: "images/vecchio_leone.jpg"
  },
  {
    date: "2026-05-22",
    name: "Bloodline",
    aliases: ["Blood Line"],
    grade: "V7",
    location: "Hueco Tanks, TX",
    photo: "images/bloodline.png"
  },
  {
    date: "2026-05-23",
    name: "Two Sizes Too Big",
    aliases: ["2 Sizes 2 Big"],
    grade: "V12",
    location: "RMNP, CO",
    photo: "images/two_sizes_too_big.jpg"
  },
  {
    date: "2026-05-24",
    name: "Cole's Corner",
    aliases: ["Coles Corner"],
    grade: "V8",
    location: "Leavenworth, WA",
    photo: "images/coles_corner.jpg"
  },
  {
    date: "2026-05-25",
    name: "The Big Island",
    aliases: ["Big Island", "Soudain Seul", "Soudain Soul", "The Island"],
    grade: "V15",
    location: "Fontainebleau, France",
    photo: "images/the_big_island.jpg"
  },
  {
    date: "2026-05-26",
    name: "Fingerhut",
    aliases: ["Finger Hut"],
    grade: "V10",
    location: "Joe's Valley, UT",
    photo: "images/fingerhut.png"
  },
  {
    date: "2026-05-27",
    name: "Tommy's Arete",
    aliases: ["Tommys Arete", "Tommy Arete"],
    grade: "V7",
    location: "RMNP, CO",
    photo: "images/tommys_arete.png"
  },
  {
    date: "2026-05-28",
    name: "Amber",
    aliases: [],
    grade: "V13",
    location: "Brione, Switzerland",
    photo: "images/amber.jpg"
  },
  {
    date: "2026-05-29",
    name: "Running Scared",
    aliases: [],
    grade: "V10",
    location: "RMNP, CO",
    photo: "images/running_scared.jpg"
  },
  {
    date: "2026-05-30",
    name: "Graviton",
    aliases: [],
    grade: "V6",
    location: "Fontainebleau, France",
    photo: "images/graviton.jpg"
  },
  {
    date: "2026-05-31",
    name: "Mirror Reality",
    aliases: [],
    grade: "V14",
    location: "RMNP, CO",
    photo: "images/mirror_reality.jpg"
  },
  {
    date: "2026-06-01",
    name: "Seduce and Destroy",
    aliases: ["Seduce & Destroy"],
    grade: "V11",
    location: "Flock Hill, New Zealand",
    photo: "images/seduce_and_destroy.jpg"
  },
  {
    date: "2026-06-02",
    name: "Chalk on Rock",
    aliases: [],
    grade: "V8",
    location: "Lincoln Lake, CO",
    photo: "images/chalk_on_rock.jpg"
  },
  {
    date: "2026-06-03",
    name: "The Angler",
    aliases: ["Angler"],
    grade: "V2",
    location: "Joe's Valley, UT",
    photo: "images/angler.png"
  },
  {
    date: "2026-06-04",
    name: "Both Sides of the Spectrum",
    aliases: ["Both Sides"],
    grade: "V12",
    location: "RMNP, CO",
    photo: "images/both_sides_of_the_spectrum.jpg"
  },
  {
    date: "2026-06-05",
    name: "Speed of Sound",
    aliases: [],
    grade: "V14",
    location: "Rocklands, South Africa",
    photo: "images/speed_of_sound.jpg"
  },
  {
    date: "2026-06-06",
    name: "Imothep Assis",
    aliases: ["Imhotep Assis", "Imothep", "Imotep", "Imotep Assis", "Imothep Project", "Imothep Assis"],
    grade: "Project",
    location: "Fontainebleau, France",
    photo: "images/imothep_assis_project.jpg"
  },
  {
    date: "2026-06-07",
    name: "Pretty Hate Machine",
    aliases: ["Pretty Hate", "Pretty Machine"],
    grade: "V8",
    location: "Leavenworth, WA",
    photo: "images/pretty_hate_machine.jpg"
  },
  {
    date: "2026-06-08",
    name: "Old Man of the Mountain",
    aliases: ["Old Man on the Mountain"],
    grade: "V10",
    location: "Holy Cross Wilderness, CO",
    photo: "images/old_man_of_the_mountain.jpg"
  },
  {
    date: "2026-06-09",
    name: "Jade",
    aliases: ["Green 45", "Green 45 Stand"],
    grade: "V14",
    location: "RMNP, CO",
    photo: "images/jade.jpg"
  },
  {
    date: "2026-06-10",
    name: "Seven Spanish Angels",
    aliases: ["The Ruckus", "Ruckus"],
    grade: "V6",
    location: "Bishop, CA",
    photo: "images/seven_spanish_angels.png"
  },
  {
    date: "2026-06-11",
    name: "Hour of Power",
    aliases: [],
    grade: "V13",
    location: "Little Cottonwood Canyon, UT",
    photo: "images/hour_of_power.jpg"
  },
  {
    date: "2026-06-12",
    name: "F5",
    aliases: ["F-5"],
    grade: "V10",
    location: "New River Gorge, WV",
    photo: "images/f5.jpg"
  },
  {
    date: "2026-06-13",
    name: "Chaos",
    aliases: [],
    grade: "V8",
    location: "Moab, UT",
    photo: "images/chaos.jpg"
  },
  {
    date: "2026-06-14",
    name: "Buttermilker",
    aliases: ["The Buttermilker", "Butter Milker"],
    grade: "V13",
    location: "Bishop, CA",
    photo: "images/buttermilker.png"
  },
  {
    date: "2026-06-15",
    name: "Under Heaven",
    aliases: ["Heaven"],
    grade: "V12",
    location: "The Horn, UT",
    photo: "images/under_heaven.jpg"
  },
  {
    date: "2026-06-16",
    name: "Arrowhead Arete",
    aliases: ["Arrowhead"],
    grade: "V10",
    location: "Morrison, CO",
    photo: "images/arrowhead_arete.jpg"
  },
  {
    date: "2026-06-17",
    name: "The Color",
    aliases: ["Color"],
    grade: "V13",
    location: "Roy, NM",
    photo: "images/the_color.jpg"
  },
  {
    date: "2026-06-18",
    name: "Limited Edition",
    aliases: ["Special Edition"],
    grade: "V10",
    location: "Brione, Switzerland",
    photo: "images/special_edition.jpg"
  },
  {
    date: "2026-06-19",
    name: "The Teacup",
    aliases: ["Teacup", "Tea Cup"],
    grade: "V13",
    location: "Leavenworth, WA",
    photo: "images/the_teacup.jpg"
  }
];
