# On Sight

A daily boulder problem guessing game. Guess the name of a boulder problem from a zoomed-in photo — the photo reveals more with each wrong guess.

## Adding Puzzles

Open `puzzles.js` — this is the only file you need to edit when adding new problems. Add a new entry to the `PUZZLES` array for each day:

```js
{
  date: "2026-03-25",          // YYYY-MM-DD — the date this puzzle appears
  name: "The Mandala",         // Exact name players must guess (case-insensitive)
  aliases: ["Mandala"],        // Optional alternate accepted answers
  grade: "V12",                // Always in V# format
  location: "Bishop, CA",      // Where the boulder is
  photo: "images/mandala.jpg"  // Path to your photo in the images/ folder
}
```

Hints are auto-generated from `grade` and `location` — no need to enter them separately:
- Guess 3 hint → `Hint: V12 boulder`
- Guess 4 hint → `Hint: Located in Bishop, CA`

## Adding Photos

Drop your boulder photos into the `images/` folder. Recommended:
- Square crop (1:1 ratio)
- At least 800x800px
- JPG format for smaller file sizes
- Name them clearly: `mandala.jpg`, `midnight-lightning.jpg`, etc.
- Avoid spaces in filenames — use underscores instead

## Project Structure

```
on-sight/
├── index.html       ← The app (HTML + CSS + game logic)
├── puzzles.js       ← All puzzle data — edit this to add new problems
├── manifest.json    ← PWA manifest (app name, icon, colors)
├── sw.js            ← Service worker (offline support)
├── README.md        ← This file
└── images/
    ├── Icon.png     ← App icon
    └── your-boulder-photos.jpg
```

## Deploying

1. Push this folder to GitHub
2. Connect repo to Netlify
3. Point your domain to Netlify
4. Done — auto-deploys on every push!
