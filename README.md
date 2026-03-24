# Climb-a-Day

A daily boulder problem guessing game. Guess the name of a boulder problem from a zoomed-in photo — the photo reveals more with each wrong guess.

## Adding Puzzles

Open `index.html` and find the `PUZZLES` array near the top. Add a new entry for each day:

```js
{
  date: "2026-03-25",       // YYYY-MM-DD — the date this puzzle appears
  name: "The Mandala",      // Exact name players must guess (case-insensitive)
  grade: "V12",             // Always in V# format
  location: "Bishop, CA",   // Where the boulder is
  photo: "./images/mandala.jpg",  // Path to your photo in the images/ folder
  hint3: "V{12} boulder",   // Shown on 3rd guess
  hint4: "Located in Bishop, CA" // Shown on 4th guess
}
```

## Adding Photos

Drop your boulder photos into the `images/` folder. Recommended:
- Square crop (1:1 ratio)
- At least 800x800px
- JPG format for smaller file sizes
- Name them clearly: `mandala.jpg`, `midnight-lightning.jpg`, etc.

## Project Structure

```
climb-a-day/
├── index.html       ← The entire app
├── manifest.json    ← PWA manifest (app name, icon, colors)
├── sw.js            ← Service worker (offline support)
├── README.md        ← This file
└── images/
    ├── icon.svg     ← Source icon (edit this)
    ├── icon-192.png ← Generated PWA icon
    ├── icon-512.png ← Generated PWA icon
    └── your-boulder-photos.jpg
```

## Deploying

1. Push this folder to GitHub
2. Connect repo to Netlify
3. Point your domain to Netlify
4. Done — auto-deploys on every push!
