# AI web editor

A floating "Editar con IA" button (bottom right) that lets the site's owner ask an AI for changes without leaving the
site. Each request becomes a GitHub issue; a GitHub Actions workflow runs Claude on it, Claude pushes, Vercel deploys.

From the button's panel:

- **Editar esta web / este diseño**: a request for the branch the site was built from
- **Crear un diseño nuevo**: a request for a new branch, `diseno-<issue>`, with its own Vercel address
- **Usar este diseño como principal** (designs only): asks the AI to merge this design's branch into `main`
- **Ver cambios** (with `changes` or `versionsUrl`): the `changes` entries of the branch you're on, and its earlier versions
- **Ver diseños**: `main` and the 10 most recently updated branches, each opened on the page you're on
- **Tus peticiones**: every request as a chat, with replies and up to 20 images (compressed to WebP before upload)

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

   Each site's images go to `<repo>/peticiones/` in the shared store.

### Per site

1. Import the repo in Vercel (https://vercel.com/new) if it isn't there yet.
2. From this repo, run:

   ```bash
   node src/_new/ai-web-editor/setup.js ../other-repo --client=<client's GitHub login>
   ```

   It copies this folder (always, so the site gets the editor's updates) and, only when missing, `api/ai-editor.js`,
   the workflows, `src/_new/scripts/design-domains.js`, the issue templates, `.claude/agents/client-reply.md`, the
   skills the workflow loads and an empty `src/_new/releaseNotesData.js`. Then it installs the dependencies and sets:

   - GitHub: secrets `CLAUDE_CODE_OAUTH_TOKEN` and `VERCEL_TOKEN`, variables `CLAUDE_ALLOWED_USERS` (yours,
     `--client` and the ones already there), `VERCEL_PROJECT` and `VERCEL_TEAM`
   - Vercel (production and preview): `GITHUB_TOKEN`, `BLOB_READ_WRITE_TOKEN` and a new `EDITOR_CODE`, printed for the
     client; an existing one is kept. Preview only: `VERCEL_PREVIEW_FEEDBACK_ENABLED=0`, which hides the Vercel Toolbar
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
   | `versionsUrl` | A JSON list of earlier versions, `[{ sha, date, title, url }]`                                 |
   | `apiUrl`      | Where the function is served (default `/api/ai-editor`)                                       |

   An entry shows only on its `branch`; without one, on its `issue`'s branch, else on `main`.

4. Commit and push: Vercel deploys it with the editor working.

Optional env vars in Vercel:

| Variable            | Value                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `GITHUB_REPO`       | `owner/repo` (default: the repo Vercel deploys from)                                         |
| `EDITOR_WORKFLOW`   | The Claude workflow's file (default `claude-issues.yml`)                                     |
| `EDITOR_MAIN_URL`   | The main site's address (default: the Vercel production domain); for the workflow, the repo variable `MAIN_URL` |
| `EDITOR_DESIGN_URL` | A design's address, with `{branch}` (default `https://<project>-{branch}.vercel.app`)        |

## Issues it writes

The workflow picks the branch from these sections only, up to "¿Qué quieres cambiar?", so the client's text can't change it:

| Section                     | Value                                                                       |
| --------------------------- | --------------------------------------------------------------------------- |
| `### Diseño`                | The branch the site was built from                                          |
| `### ¿Dónde?`               | `Actual` (that branch), `Nuevo diseño` (`diseno-<issue>`), `Web principal` (`main`) |
| `### Nombre del diseño`     | Only for `Nuevo diseño`: the name the client gave it, also the issue's title |
| `### Acción`                | Only `Usar este diseño como principal`: merge the "Diseño" branch into `main` |
| `### ¿Qué quieres cambiar?` | The client's text                                                           |
| `### Imágenes`              | `![name](url)` per uploaded image                                           |

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
- `server/`: the Vercel function (`?action=status|requests|request|designs|access|upload`), CommonJS
- `setup.js`: installs and configures the editor on a repo (Node, not bundled)
