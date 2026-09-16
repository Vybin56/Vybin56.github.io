# Abdelrahman Almazlom, portfolio

Live at <https://vybin56.github.io>

Static site. No build step, no dependencies. Every file here is served exactly as it sits.

## Structure

```
index.html                  home: hero, selected work, experience, skills, education, contact
resume.html                 full resume, formatted to print as a clean PDF
projects/*.html             one write up per project
assets/css/site.css         design system: tokens, layout, components, motion
assets/css/resume.css       resume document view plus print rules
assets/js/site.js           scroll reveals, image lightbox, nav state
assets/img/                 optimized WebP imagery plus the social share card
```

## Adding your headshot

Save a portrait photo as `assets/img/headshot.jpg` (roughly 800 by 1000 px, portrait
orientation). The hero picks it up automatically. If the file is missing the hero falls back
to the monogram block, so nothing breaks either way.

## Publishing changes

```bash
git add -A && git commit -m "Update portfolio" && git push
```

GitHub Pages redeploys within a minute.

## Local preview

```bash
python -m http.server 4321
```

Then open <http://localhost:4321>.

## Design notes

- Type: Archivo (variable weight and width) with Azeret Mono for technical labels.
- Colour: signal vermilion on true neutral paper, near black ink. All body text is checked
  at 4.5:1 or better against its background.
- Images are served as WebP at two widths through `srcset`. Source files live outside this
  repo in the project folders.
