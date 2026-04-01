# On Sight

A daily boulder problem guessing game. Guess the name of a boulder problem from a zoomed-in photo — the photo reveals more with each incorrect guess.

## Adding Puzzles

Update `puzzles.js` — this is the only file that needs to be updated when adding new problems. Add a new entry to the `PUZZLES` array for each day:

```js
{
  date: "2026-03-25",                // YYYY-MM-DD — the date this puzzle appears
  name: "The Finnish Line",          // Exact name players must guess (case-insensitive)
  aliases: ["Finish Line"],          // Optional alternate accepted answers
  grade: "V15",                      // Always in V# format
  location: "Rocklands, ZA",         // Where the boulder is
  photo: "images/finnish_line.jpg"   // Path to your photo in the images/ folder
}
```

Hints are auto-generated from `grade` and `location`:
- Guess 3 hint → `Hint: V15 boulder`
- Guess 4 hint → `Hint: Located in Rocklands, ZA`

## Adding Photos

Drop your boulder photos into the `images/` folder. Recommended:
- At least 800x800px
- JPG format for smaller file sizes
- Name them clearly: `finnish_line.jpg`, `midnight-lightning.jpg`, etc.
- Avoid spaces in filenames — use underscores instead

## Project Structure

```
on-sight/
├── index.html       ← The app (HTML + CSS)
├── app.js           ← Game logic
├── puzzles.js       ← All puzzle data — edit this to add new problems
├── manifest.json    ← PWA manifest (app name, icon, colors)
├── sw.js            ← Service worker (offline support)
├── README.md        ← This file
└── images/
    ├── Icon.png     ← App icon
    └── your-boulder-photos.jpg
```
