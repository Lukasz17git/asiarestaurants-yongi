---
name: simple-text
description: Writes short code comments in simple words (English or Spanish) that say what the code does, how, why and its edge cases. Use when the user asks to write, improve, shorten or explain a comment, docstring or JSDoc, AND whenever Claude writes a comment itself while coding, AND whenever Claude writes a README or docs that explain code, asked in any words or unasked (e.g. "write a readme for this hook", "document this folder", "añade un léeme"), AND whenever Claude's reply includes a commit message, however it was asked or even unasked (e.g. "write me a commit message", "...and suggest a commit msg at the end", "¿cómo lo commiteo?"), for its subject and points.
---

# Simple text

Write the shortest comment, in the simplest words, that tells the reader what the code can't tell them by itself. Every word must earn its place.

## When it applies

- Every comment Claude writes, asked for or not: new code, refactors, code moved or extracted to another file.
- English and Spanish alike, with the same rules (see [Spanish](#spanish)). Use the language of the file's other comments (English if none). Keep literal values exactly as in the code; for words that are also names in the code, see [Spanish](#spanish).
- JSDoc, docstrings, TODOs and section separators too (see [Other kinds of comments](#other-kinds-of-comments)).
- READMEs and docs that explain code (see [Docs that explain code](#docs-that-explain-code)).
- Commit messages, whenever a reply includes one (asked for in any words, or offered unasked): the subject and each point (see [Commit messages](#commit-messages)).
- Only to those pieces, never to the code or text around them (other code, analysis, explanations to the user). With several in one reply or file, apply the rules to each one on its own; when asked to redo them, give only those pieces again.

## When not to comment

- If clear names and simple code already say it, write no comment. A comment that repeats the code is noise the reader has to check.
- Match the file's comment density: don't comment every line in a file that comments a few key spots.
- Don't narrate the change or its history ("moved from X", "new filter", "fixed bug", "now uses a Set"). That belongs in the commit message.
- Don't leave commented-out code.
- When you change code that has a comment, update the comment or remove it if it's no longer true.

## What to say

In this order, and only the parts the code doesn't already make clear:

1. **What** it does. A verb first is usually the clearest ("Finds", "Keeps", "Sends", "Skips"); skip it when the text reads better without one (a choice as the subject: "`Map` keeps…"; a prop or value being listed). Name the real thing (`the rating's userId`), not "the item" or "the value". Say the result the code gets, not the step it takes: "Skips inactive users", not "Checks isActive". For a constant or variable, say what the code that uses it gets with it.
2. **How**, if it isn't obvious. Show the key value or rule as it appears in the code, including the constant's own value (`perPage > 100`, `'BB+' -> 'BB%2B'`), not a description of it ("the limit", "the encoded form").
3. **Why**, only if a reader would likely "fix" the code into something broken without it (e.g. remove a "useless" sort, drop an encoding step). Name the exact problem it avoids ("the server would read '+' as a space"). A why that is only nice to know, or that just says who uses the code, is not a why: cut it.
4. **Edge cases** a reader would otherwise have to work out: casing, empty or `null` values, arrays, a kept format, an order the code relies on, a backend rule. Show them with real values from the code's domain (`null`, `[]`, `'BB+'`), never "special characters" or "edge cases".

Leave out what the reader doesn't need to understand this code: where the data comes from or lives ("from the backend", "in the users store"), which other screen, filter or component uses it, and what the function or variable name already says. Keep it only when the comment makes no sense without it (e.g. a list of blocked ids must say what they are blocked from).

## Style

- One line is the goal. If it takes two, first cut words until it fits in one; keep a second line only if cutting would lose the what, the how or a real edge case. Up to 3 lines, 4 only if you would otherwise lose information.
- Keep each line under ~100 characters, counting indentation and `//`, and never past the file's print width. If it's longer, split it at a natural break (after a clause, before `e.g.` or `:`); never leave one long line.
- Simple, common words for everything that isn't a programming concept: "keeps", "skips", "runs once", never fancy words ("utilize", "leverage", "aforementioned").
- For a programming concept, use the standard developer term when it says it more exactly than any plain version, even if a simpler phrase exists: "race condition" over "two requests can finish in the wrong order", "re-render" over "draws the component again", "debounces 300ms" over "waits 300ms" when the timer restarts on every call. When a plain version is just as exact, it wins: "skips `null` and `undefined`" over "skips nullish" (it shows the values). Leave out spec wording developers don't use day to day ("integer-like keys", "abstract equality").
- Show instead of describing: real values in quotes or backticks as they appear in the code or on the wire, `->` for transformations, examples in parentheses. A `->` example shows the real input and the code's final output, not a step in between: `5400 -> '1h 30m'` for a duration formatter, not `5400 -> 90`. Use real values from the code's domain, never placeholders (`'abc'`, `'foo'`, `X`).
- Name only the values that are affected, not the whole range or list: the two characters that break, not every character the function touches. Say what the code protects and what would go wrong about those same values, without also listing what stays fine: "keeps '+' as is; without encoding it would arrive as a space", not "letters and digits stay the same, while '+' would turn into a space".
- Don't repeat a value, word or phrase in the same comment; point back to it instead ("them", "it", "lo"): "keeps '+' as is; without it, it would…", not "keeps '+'…; without it, '+' would…".
- When you name a field or variable, write it as it is in the code (`userId`, `perPage`), not spelled out ("user id", "per page"). This includes the thing the code finds, returns or sets: name it by the field it ends up in, in a readable phrase. If the code stores the admin's id in `adminUserId` and passes it on as `userId`, write "Finds the admin's userId", not the local variable ("Finds adminUserId") and not a vague or spelled-out word ("the admin's id", "user id"). Before finishing, check every noun in the comment against the code's identifiers.
- When the comment explains a choice (a type, a data structure, a library), make that choice the subject: "`Set` drops repeated ids", not "Uses a Set so that repeated ids are dropped".
- Prefer a plain phrase over a word for a code operation when both are equally exact: "without spaces at the ends" over "trimmed", "before ':'" over "prefix", "finds" over "matches".
- For an edge case, say what is handled, not a cause you can't confirm: "empty values are skipped" over "since the backend may send empty strings".
- Put related facts on one line, in parentheses or chained with `,` `;` `:`, instead of a sentence each.
- No filler ("This function…", "Note that…", "Basically…", "This is used to…", "Here we…").
- Match the file's comment syntax and conventions (`//`, `/* */`, `#`, JSDoc), and its capitalisation and punctuation (e.g. no final period if the file's comments don't use one).
- Don't invent facts. If the comment relies on how another system behaves (backend, library), check it in the code first. If you can't check it, leave it out or say it's assumed.

## Spanish

Same rules, same length, same order (what, how, why, edge cases). Things that change:

- When it starts with a verb, use the present tense, third person: "Busca", "Oculta", "Calcula", "Guarda", "Evita", "Ordena".
- Plain words: "primero", "al final", "antes de ':'", "sin espacios a los lados", "vacío" instead of English verbs turned Spanish ("hardcodear", "parsear", "matchear", "trimear"). Standard developer terms follow the same rule as in English and stay in English ("race condition", "re-render").
- No filler: "Esta función…", "Básicamente…", "Cabe destacar que…", "Se utiliza para…", "Aquí se…".
- Words that are also names in the code (fields, props, constants, domain terms), decided in this order:
  1. **Project terms stay as the project writes them, in every language.** Before translating a domain word, check how the project's own texts in that language write it (translation files, UI strings, other comments). If they keep it untranslated, keep it too: in a project whose Spanish UI says "Abrir ticket", write "cada ticket", never "cada incidencia".
  2. **A specific identifier you point the reader to stays exact, in backticks**: a constant, prop, function or type to look up in the code (`MAX_RETRIES`, `onSubmit`, `userRoles`).
  3. **Otherwise, translate common generic words** that just happen to be field names into the plain Spanish word: `password` -> "contraseña", `city` -> "ciudad", `createdAt` -> "fecha de creación". Write "Valida la contraseña de cada usuario", not "Valida el `password` de cada usuario".
- Spanish runs about 15% longer than English, so cutting words to stay on one line matters even more.

## Other kinds of comments

### JSDoc and docstrings

- Use them where the file or repo already does, or on exported functions whose hover text helps callers.
- Same rules as a `//` comment. One line (`/** Finds … */`) if it fits.
- Add `@param` or `@returns` only for something the name and type don't say (a unit, an allowed range, what `null` means). Don't repeat the type.

```ts
/** Rounds to the nearest 0.5 hours; `null` when no time was logged */
export const roundHours = (minutes: number | null) => ...
```

### TODOs

- Use the repo's marker (`// TODO:`). One line: what to do, then why or what blocks it, in parentheses.
- Make it actionable: "`// TODO: Move to translations file (only Spanish text for now)`", not "`// TODO: fix this`".

### Section separators

When the file groups code under block headers, match their exact format and give each block a short title in 2–4 words, starting with a capital letter. Put the explanation of each piece in its own comment below the header, not inside it:

```ts
/*
 * ------------------------------------------------------------
 * Max per page
 * ------------------------------------------------------------
 */

// Caps perPage at 100: bigger values make GET /ratings fail with 400
export const MAX_PER_PAGE = 100;
```

### Commit messages

- Same wording rules for the subject and for each "- " point: the shortest form, real values instead of descriptions, identifiers as in the code, the developer term when it's more exact, no repeated values, no filler (including "now" and "new").
- One line per point, under ~125 characters; the subject under ~100. These are limits, not targets: a point is as long as its change, so a one-line change is often just the value (`timeout: 5000 -> 10000`). Split a point that needs two sentences into two points, or cut it.
- At most 10 points, and as few as cover what matters: merge related changes into one point (several tweaks to the same element, even across its files; a feature and its fixes) and drop minor ones before dropping an important one. Short points don't mean more points: never split by file.
- `git log` decides only the subject's format (e.g. `type(scope): description`). Earlier subjects may inspire the type, scope or wording when they fit, but don't have to be copied. The subject is in the past tense ('fixed', 'dropped'), whatever tense the log uses.
- Say what changed. Add a why or effect only when the value doesn't show it, in a few words after "," or in parentheses. Leave out a why any dev reading the diff already knows, and any effect you didn't check in the code. A change made only because a tool asks for it (type checker, linter, compiler, library upgrade) gets no why at all, even if you know which version asks: `- api.ts: catch (e: unknown)`, not `… (TS strict mode requires it)`. Skip purely internal steps the reader doesn't need.

```
fix(Upload): retried failed chunk uploads

- Retries each failed chunk up to retries: 3, waiting 1s, 2s and 4s
- Sends 'BB+' as 'BB%2B' (the server read '+' as a space)
- maxChunkSize: 5MB -> 2MB, so a retry resends less
```

Too long: `- maxChunkSize is now 2MB instead of 5MB, which means that a failed retry has to resend much less data over slow networks` (filler "now", "which means that"; "over slow networks" isn't in the code).

### Docs that explain code

READMEs, docs pages and module notes that explain code (in a file or given in the chat) follow the same rules for every sentence that says what the code does, how, why or its edge cases. Explain the behavior, not a line-by-line tour of the code (e.g. a README section for a cache helper: what it keeps, when an entry expires, what a miss returns). Text that doesn't explain code (install steps, license, contact) is out of scope.

## Process

1. Read the code and its callers to learn the real inputs and why the code exists.
2. Decide if it needs a comment at all (see [When not to comment](#when-not-to-comment)).
3. Write the full version covering what / how / why / edge cases.
4. Cut it down: drop what the code or names already say, drop who uses it or where the data comes from, replace descriptions with real values, swap hard words for simple ones (but keep a developer term that is more exact), merge sentences.
5. Check each word and each line: does it belong to the what, how, why or an edge case? Could it go and the reader would still understand the code and not break it? Would a reader stop and think at it? Is any line over ~100 characters? Fix and repeat.
6. Edit the file in place (keep its line endings) and show the final comment in a code block.

### When the user asks for options

- Give ~10 numbered versions, from most explicit to shortest. Each must be correct and follow the rules above (no version over ~100 characters per line).
- Options are for comparing, not for copying yet: write each version in inline code (a multi-line comment as one inline code per line), never in fenced code blocks. The code block is only for the final comment, once the user picks one and it's in the file.
- Make them really different: vary which parts are kept (what / how / why / edge case) and the wording, not just one word.
- Recommend one or two and say in one line why, naming what the shorter ones lose.
- When the user picks one and changes it, compare it honestly with the list: say if it's better and why, or what it loses. Then put it in the file.

## Final checklist

- [ ] Says the result, not the step (usually with a verb first, unless it reads better without).
- [ ] Shows real values from the code; no placeholders, no "special characters".
- [ ] Names only the affected values, each once; fields as in the code (`userId`).
- [ ] No where-it-comes-from, no who-uses-it, no history, no filler.
- [ ] A why only if a reader would otherwise break the code.
- [ ] One line, or a reason for each extra line; every line under ~100 characters.
- [ ] Plain words, or the developer term when it's more exact; same language and format as the file's other comments.

## Examples

### What + how + edge case

For a constant used as `countries.find((c) => c.code.split('-')[1]?.toUpperCase() === SPAIN_ISO_CODE)?.id`:

```ts
// Finds Spain's countryId by the code ('ES') after '-', in any casing ('es-ES', 'es-es')
export const SPAIN_ISO_CODE = 'ES';
```

What ("Finds Spain's countryId"), how with the real value ("by the code ('ES') after '-'"), edge case shown with examples ("in any casing").

### What + why

For a dropdown's options built with `[...SPANISH_PROVINCES].map(...)`:

```ts
// Map keeps '01'..'09' first; an object would sort them last
export const SPANISH_PROVINCES = new Map([['01', 'Álava'], /* ... */ ['52', 'Melilla']]);
```

The choice (`Map`) is the subject, the why stops anyone turning it back into an object, and only the keys that would move are named.

### Spanish

For the countries list, where each `name` is replaced with the translated one:

```ts
// Traduce el nombre de cada país por el código tras '-' ('fr-FR' -> 'Francia'); sin él, '-'
const translatedCountries = data.map((item) => { /* split('-'), Intl.DisplayNames */ });
```

`name` is a common generic field, so it becomes "nombre"; the `->` shows the real input and final output.

### Spanish with a project term

In a project whose Spanish UI says "Clonar Rating", "rating" stays in English while common words around it are translated:

```ts
// Devuelve el usuario asignado al rating por cada rol, en su orden (`undefined` si no hay)
export const getAssignedUsers = (users, assignedUsers, roles) => roles.map(/* ... */);
```

### When more lines are needed

```ts
// URL-encodes filter values so reserved chars ('+', '&', '=', '#', '%', spaces) reach the backend,
// e.g. rating 'BB+' is sent as `BB%2B` instead of `BB+`, which the server would decode as 'BB '.
// Array filters encode each item and join with a literal ',': ['BB+', 'A-'] -> `BB%2B,A-`.
const encodeQueryValue = (value: unknown) =>
  Array.isArray(value)
    ? value.map((v) => encodeURIComponent(String(v))).join(',')
    : encodeURIComponent(String(value));
```

Three lines only because each adds something: the what and why, the failure it avoids, the array edge case.

### No comment needed

```ts
const activeUsers = users.filter((user) => user.isActive);
```

`// Gets the active users` would only repeat the code. Write nothing.
