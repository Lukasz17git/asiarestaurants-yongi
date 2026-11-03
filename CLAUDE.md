# asiarestaurants-yongi

Test copy of asiarestaurants.es (Create React App). The `ioyi-ramen` branch is a local design for IOYI Ramen
(Vilafranca del Penedès): same pages, its own texts, photos (`src/_new/images/ioyi/`, loaded with `ioyiPhoto`) and theme.
Every push to `main` deploys to https://asiarestaurants-yongi.vercel.app in a few minutes.

## Client preferences

Lasting wishes from the client; follow them in every change and add new ones here.

- No `link`/`linkText` on the release-note changes (#3)
- Dish photos: only reuse photos already on the website or the restaurant's own ones in the assets site (see Images),
  one per dish and only when the match is sure; dishes without one stay without a photo, uncertain matches wait
  for the client's confirmation (#7)

## Where things are

- Everything added on top of the original site (features, scripts, data, images) lives in `src/_new/`, laid out like
  `src/` (`src/_new/images/`, `src/_new/pedidos/`), so deleting it leaves the original site; edits to the site's own
  pages and texts stay in their files. Only what a tool reads from a fixed place stays outside: `api/ai-editor.js`
  and `middleware.js` (Vercel), `.github/` (GitHub), `.claude/` and this file (Claude), `vercel.json`, `package.json` and `.gitignore`
- Pages (`src/App.js`): `/` Home, `/restaurant` Restaurants, `/menu` Menus, `/qr` and `/qr-new` QR menu pages,
  `/pedidos` «Pedir online», `/reservar` «Reservar»
- «Reservar» (`src/_new/reservar/`): a booking form (people, the next 6 days from the visitor's clock or another day,
  a time from IOYI's hours, name and phone) that opens WhatsApp with the reservation written (`createReservationUrl`
  in `src/_new/sections/reservation.js`)
- «Pedir online» (`src/_new/pedidos/`): the takeaway dishes from `takeaway-menu.json` (`takeawayMenu.js`), a cart kept in
  localStorage and a button that opens WhatsApp (`34644645938`) with the order written (`whatsappOrder.js`). Delivery
  fee and minimum order by postal code are in `deliveryRules.js`
- Texts and data, one file per section:
  - `src/Home/examplesData.js`: featured dishes on Home (`photo: 'unagi-don'` ->
    `src/_new/images/ioyi/dishes/unagi-don.webp`)
  - `src/Home/cocinaData.js`: the 4 «Un bol para cada uno» cards on Home (`photo: 'dishes/ramen-vegan'`, a path
    under `src/_new/images/ioyi/`)
  - `src/Menu/MenusData.js`: menus (name, hours, price, `image: 'dishes/x'` or `'place/x'`, `to`: a route or
    `'#platos'`)
  - Dish gallery on Menus: the sections of `takeaway-menu.json` but drinks, shown by `Dish.js`
  - `src/Restaurant/restaurantsData.js`: restaurants (address, phone, maps, WhatsApp)
  - `src/qr/qrData.js`: PDFs on the `/qr` page
  - `src/_new/pedidos/takeaway-menu.json`: IOYI's dishes by section (ramen, arroces, entrantes, baos, sandos, bebidas),
    used by `/pedidos`, Menus and the ramen guide on Home. Only `es`; each section's `kanji` goes on its button in `/pedidos`; `photo: 'akamaru'` ->
    `src/_new/images/ioyi/dishes/akamaru.webp`, `null` when IOYI has no photo of it
  - `src/_new/releaseNotesData.js`: the changes listed in «Editar con IA» -> «Ver cambios», newest entry first (one entry
    per change request, in Spanish for the client); each shows only on its `branch`
- Sections shared by Home and Menus (`src/_new/sections/`): the red `Marquee`, the photo `Gallery`, `MenusTeaser`,
  `FinalCall` and `reservation.js` (the WhatsApp booking link, and the message and time slots of `/reservar`). Scroll animations (`src/_new/reveal/`): `useReveal(pageRef)`
  fades in every `data-reveal='up|left|right|zoom'` of the page when it comes into view; `CountUp` counts a number up.
  Shared buttons and titles (`cta cta-red`, `cta cta-gold`, `kicker`, `heading` with `<em>` in red, `lead`) are in `App.scss`
- "Editar con IA" is the floating button at the bottom right: `src/_new/ai-web-editor/`, a self-contained module mounted once
  as `<AiWebEditor />` in `App.js` (see its `README.md`). Its panel edits this site, starts a new design, uses a design
  as the main web, lists the changes, the designs, the branch's requests (chat and images per request) and its last 10
  versions since the tag `v0` (Vercel deploys, opened at `/_history/<number>` by `middleware.js`; «Volver a esta versión»
  asks for a new commit with one's files);
  the button spins while the Claude workflow runs or Vercel hasn't served the branch's latest commit. Its only Vercel
  function is `api/ai-editor.js`
  (`?action=status|requests|request|designs|versions|history|access|upload|cleanup`, code in `src/_new/ai-web-editor/server/`).
  Images come in two kinds: «Imágenes de referencia» (only for the AI, under `<repo>/referencias/`, deleted after 7 days by
  the daily cron in `vercel.json`) and «Imágenes para la web» (under `<repo>/peticiones/`, hidden for now in `Composer.js`).
  Env vars: `EDITOR_CODE` (asked once per browser), `GITHUB_TOKEN` (Issues read/write, Actions and Contents read),
  `BLOB_READ_WRITE_TOKEN` (a Blob store shared by every site), `CRON_SECRET` (the cleanup cron's), `EDITOR_VERCEL_TOKEN`,
  `EDITOR_VERCEL_TEAM` and `EDITOR_VERCEL_PROJECT` (the versions list). All of them, and the
  GitHub secrets and variables the workflows use, are set by `node src/_new/ai-web-editor/setup.js` from `~/.ai-web-editor.env`;
  the same script installs the editor on another repo
- Every branch but `main` is a design, with its short address `asiarestaurants-yongi-<branch>.vercel.app`
  added by `src/_new/scripts/design-domains.js` (`design-domains.yml`)
- Issues use the sections of `.github/ISSUE_TEMPLATE/cambio*.yml` (`server/requests.js` writes the same ones,
  plus «Nombre del diseño», the issue's title, for a new design). "¿Dónde?"
  picks the branch in `claude-issues.yml`: "Actual" -> "Diseño" or main, "Nuevo diseño" -> `diseno-<issue>`,
  "Web principal" -> `main`; the request text never changes it. "Acción: Usar este diseño como principal" (sent from a
  design) merges the "Diseño" branch into `main`; "Acción: Volver a una versión anterior" (sent from an older version)
  commits the files of the "Versión" commit on the "Diseño" branch
- Texts are objects by language (`es`, `cat`, `it`, `en`); the site shows `es`
- Menu PDFs: `public/pdfs/`, linked as `'./pdfs/<file>.pdf'`

## Images

- The original site's images live in `src/images/`, all `.webp`; this branch only uses its icons and patterns
- IOYI's photos are in `src/_new/images/ioyi/` (`dishes/`, `place/`, logos and seal), loaded with
  `ioyiPhoto('dishes/akamaru')`; a wrong name passes the build and breaks the page when it renders.
  `place/` mixes IOYI's own photos with generic ramen-bar photos (alt "Ambiente de ramen japonés")
- Photos must be `.webp`. Convert others with `cwebp -q 80 -resize 800 0 in.jpg -o out.webp`
- The final call's background is set in `sections.scss` (`place/shop-night.webp`), the logos in `Navbar.scss`,
  `Footer.scss` and `BgTop.scss`

## Styles

- Components import `src/css/X.css`, compiled from `src/css/X.scss`: edit the `.scss`, then recompile:
  `npx --yes sass@1.77.8 --no-source-map src/css/X.scss src/css/X.css`
- `Home.css` is minified: add `--style=compressed` for it
- Styles under `src/_new/` sit next to their component (`src/_new/pedidos/pedidos.scss` -> `pedidos.css`)

## Checks

- `npm run build` must pass before pushing (lint warnings are fine)
- Don't commit `package-lock.json` or `build/`
