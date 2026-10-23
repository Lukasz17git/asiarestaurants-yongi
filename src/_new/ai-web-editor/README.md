# AI web editor

A floating "Editar con IA" button (bottom right) that lets the site's owner ask an AI for changes without leaving the
site. Each request becomes a GitHub issue; a GitHub Actions workflow runs Claude on it, Claude pushes, Vercel deploys.

From the button's panel:

- **Editar esta web / este diseño**: a request for the branch the site was built from
- **Crear un diseño nuevo**: a request for a new branch, `diseno-<issue>`, with its own Vercel address
- **Usar este diseño como principal** (designs only): asks the AI to merge this design's branch into `main`
- **Ver cambios** (with `changes`): the `changes` entries of the branch you're on
- **Diseños**: the 4 most recently updated branches (`main` included), each opened on the page you're on; **Ver todos** lists
  `main` and the 10 latest designs
- **Tus peticiones**: the requests of the branch you're on as chats, with replies. Replies only from that branch's newest
  version: elsewhere the chat links to it
- **Images**, up to 20 of each kind per message, compressed to WebP before upload (`imageBoxes` in `Composer.js`):
  - **Imágenes de referencia**: only for the AI to look at; deleted after 7 days by a daily Vercel cron
    (`/api/ai-editor/cleanup`, rewritten to `?action=cleanup` in `vercel.json`), and shown as «Imagen borrada» in the chat after that
  - **Imágenes para la web** (hidden for now, commented out in `imageBoxes`): the AI puts them on the site; kept for good
- **Versions** (under the address): the branch's last 10 Vercel deploys since the tag `v0` (`EDITOR_HISTORY_TAG`), one per
  commit and numbered from 1. Each opens on the page you're on at `/_history/<number>` of the site's address:
  `middleware.js` serves it from that deploy, so nothing is rebuilt or copied and visitors keep the newest. Numbers stay
  as long as no deploy after the tag is deleted. On an older one, **Volver a esta versión** asks, after a
  confirmation, for a new commit with that version's files, so the version it replaces can be brought back the same way

The button spins while the workflow runs or Vercel hasn't served the branch's latest commit yet, then offers a reload
that opens «Ver cambios». Visitors make one status call per page load (and one when the tab is back); it polls every
15s only while the panel is open, while the AI works or Vercel deploys, and for 3 min after sending a request.

## Install on another site

Needs a React 18 app deployed on Vercel from a GitHub repo. `setup.js` does the rest with tokens shared by every site.

### Once, for all your sites

1. Run `node src/_new/ai-web-editor/setup.js` once: it creates `~/.ai-web-editor.env` with each key and where to get it.
2. Fill it in:

   | Key                       | Where                                                                                       |
   | ------------------------- | ------------------------------------------------------------------------------------------- |
   | `GITHUB_TOKEN`            | https://github.com/settings/personal-access-tokens/new, "All repositories": Issues read/write, Actions and Contents read |
   | `CLAUDE_CODE_OAUTH_TOKEN` | `claude setup-token`                                                                        |
   | `VERCEL_TOKEN`            | https://vercel.com/account/tokens                                                           |
   | `VERCEL_TEAM`             | The team in your Vercel addresses (`vercel.com/<team>`)                                     |
   | `BLOB_READ_WRITE_TOKEN`   | One Blob store for every site (https://vercel.com/dashboard/stores), its ".env.local" tab   |
   | `CLAUDE_ALLOWED_USERS`    | Your GitHub login (comma-separated if more)                                                 |

   Each site's images go to `<repo>/referencias/` (deleted after 7 days) and `<repo>/peticiones/` (for the web) in the
   shared store.

### Per site

1. Import the repo in Vercel (https://vercel.com/new) if it isn't there yet.
2. From this repo, run:

   ```bash
   node src/_new/ai-web-editor/setup.js ../other-repo --client=<client's GitHub login>
   ```

   It copies this folder (always, so the site gets the editor's updates) and, only when missing, `api/ai-editor.js`, `middleware.js`,
   the workflows, `src/_new/scripts/design-domains.js`, the issue templates, `.claude/agents/client-reply.md`, the
   skills the workflow loads and an empty `src/_new/releaseNotesData.js`, and adds the cleanup cron and its rewrite to `vercel.json`.
   Then it installs the dependencies and sets:

   - GitHub: secrets `CLAUDE_CODE_OAUTH_TOKEN` and `VERCEL_TOKEN`, variables `CLAUDE_ALLOWED_USERS` (yours,
     `--client` and the ones already there), `VERCEL_PROJECT` and `VERCEL_TEAM`
   - Vercel (production and preview): `GITHUB_TOKEN`, `BLOB_READ_WRITE_TOKEN`, `EDITOR_VERCEL_TOKEN`, `EDITOR_VERCEL_TEAM` and
     `EDITOR_VERCEL_PROJECT` (for the versions list), a new `EDITOR_CODE`, printed for the
     client, and a new `CRON_SECRET` (the cleanup cron's); existing ones are kept. Preview only: `VERCEL_PREVIEW_FEEDBACK_ENABLED=0`, which hides the Vercel Toolbar
     on the designs

   Without a folder it sets up the repo it's in and redeploys it. Run it again whenever a token changes.

3. Mount the editor once, if the script says it isn't:

   ```jsx
   import AiWebEditor from './_new/ai-web-editor'
   import releaseNotes from './_new/releaseNotesData'

   <AiWebEditor changes={releaseNotes} />
   ```

   The panel and its libraries load on the first click, so the page doesn't wait for them. Props, all optional:

   | Prop          | Value                                                                                          |
   | ------------- | ---------------------------------------------------------------------------------------------- |
   | `changes`     | Release notes, newest first: `{ date: 'YYYY-MM-DD', title, summary, changes: [{ text }], issue, branch }` |
   | `apiUrl`      | Where the function is served (default `/api/ai-editor`)                                       |

   An entry shows only on its `branch`; without one, on its `issue`'s branch, else on `main`.

   For the versions at `/_history/<number>`, the build must use relative paths and the router its basename:

   - `package.json`: `"homepage": "."`
   - `<BrowserRouter basename={historyBasename}>`, with `import AiWebEditor, { historyBasename } from './_new/ai-web-editor'`
   - `public/index.html`, first in `<head>`, so the relative files of `/_history/3/menu` load from `/_history/3/`:

     ```html
     <script>
       var base = document.createElement('base')
       base.href = (location.pathname.match(/^\/_history\/\d+/) || [''])[0] + '/'
       document.head.appendChild(base)
     </script>
     ```

   Then tag the commit the versions start after: `git tag v0 && git push origin v0`.

4. Commit and push: Vercel deploys it with the editor working.

Optional env vars in Vercel:

| Variable            | Value                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `GITHUB_REPO`       | `owner/repo` (default: the repo Vercel deploys from)                                         |
| `EDITOR_WORKFLOW`   | The Claude workflow's file (default `claude-issues.yml`)                                     |
| `EDITOR_MAIN_URL`   | The main site's address (default: the Vercel production domain); for the workflow, the repo variable `MAIN_URL` |
| `EDITOR_DESIGN_URL` | A design's address, with `{branch}` (default `https://<project>-{branch}.vercel.app`)        |
| `EDITOR_HISTORY_TAG`| The tag the versions start after (default `v0`; without it, every deploy counts)            |

## Issues it writes

The workflow picks the branch from these sections only, up to "¿Qué quieres cambiar?", so the client's text can't change it:

| Section                     | Value                                                                       |
| --------------------------- | --------------------------------------------------------------------------- |
| `### Diseño`                | The branch the site was built from                                          |
| `### ¿Dónde?`               | `Actual` (that branch), `Nuevo diseño` (`diseno-<issue>`), `Web principal` (`main`) |
| `### Nombre del diseño`     | Only for `Nuevo diseño`: the name the client gave it, also the issue's title |
| `### Acción`                | `Usar este diseño como principal`: merge the "Diseño" branch into `main`; `Volver a una versión anterior`: a new commit on the "Diseño" branch with the files of `### Versión` |
| `### Versión`               | Only for `Volver a una versión anterior`: the sha of an earlier commit of that branch |
| `### ¿Qué quieres cambiar?` | The client's text                                                           |
| `### Imágenes de referencia` | `![name](url)` per image only for the AI to look at (also in replies)     |
| `### Imágenes para la web`  | `![name](url)` per image to put on the site (also in replies)              |
| `### Imágenes`              | Issues from before the two kinds: images to put on the site                 |

## Theme

Every color comes from a CSS variable, so a site restyles it from its own CSS:

```css
:root {
    --aiwe-accent: #2f6fed;
    --aiwe-on-accent: #fff;
    --aiwe-bg: #fff;
    --aiwe-z: 2000;
}
```

The rest (`--aiwe-bg2`, `--aiwe-line`, `--aiwe-text`, `--aiwe-muted`, `--aiwe-font`...) are at the top of
`ai-web-editor.scss`. After editing it, recompile:

```bash
npx --yes sass@1.77.8 --no-source-map src/_new/ai-web-editor/ai-web-editor.scss src/_new/ai-web-editor/ai-web-editor.css
```

## Files

- `index.js`: the only export, `AiWebEditor`
- `AiWebEditor.js`: the button and status; lazy-loads `Panel.js` (the views, dialogs and shared `EditorContext`)
- `api.js`: calls to the function, the saved code and image uploads
- `server/`: the Vercel function (`?action=status|requests|request|designs|versions|history|access|upload|cleanup`), CommonJS;
  `historyMiddleware.js` (ESM) is the site's `middleware.js`
- `versionPath.js`: the `/_history/<number>` an older version is opened at
- `setup.js`: installs and configures the editor on a repo (Node, not bundled)
