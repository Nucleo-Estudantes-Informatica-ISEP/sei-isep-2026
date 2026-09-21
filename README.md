# SEI'26 — Symposium on Engineering and Innovation

Website for the eighth edition of SEI, organised by DEI/NEI-ISEP and hosted at
Instituto Superior de Engenharia do Porto on **25 November 2026**.

Built with Astro 7 (static output), TypeScript in strict mode, and a pt/en
bilingual routing setup (`pt` is the default locale and both locales are
prefixed). Published at <https://sei.dei.isep.ipp.pt>.

This repository is the SEI'26 edition site, created from
[`template-sei-website`](https://github.com/Nucleo-Estudantes-Informatica-ISEP/template-sei-website).
Template improvements are pulled in from there; everything specific to this
edition — dates, committees, speakers, programme, images — lives here.

## Key dates

| Milestone               | Date             |
| ----------------------- | ---------------- |
| Paper submission        | 11 October 2026  |
| Acceptance notification | 28 October 2026  |
| Camera-ready            | 15 November 2026 |
| Symposium               | 25 November 2026 |

Registration opens on a date still to be announced. These dates are read from
`src/data/edition/edition.json` — update them there, not in this README.

Submissions go through
[EasyChair](https://easychair.org/conferences?conf=sei26).

## Getting started

Requires Node `>=22.12.0` and pnpm (pinned via Corepack in `package.json`).

```bash
pnpm install
pnpm dev        # dev server
pnpm build      # static build to dist/
pnpm preview    # serve the built dist/ locally
```

Checks:

```bash
pnpm lint          # eslint
pnpm format:check  # prettier, as CI runs it
pnpm validate:data # JSON content against the zod schemas
pnpm typecheck     # validate:data + astro check
pnpm test          # tsx --test
```

## Editing this edition's content

Content is data, not markup — nothing edition-specific is hardcoded in the
`.astro` components.

| What                                                            | Where                                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------- |
| Dates, links, images, venue, footer                             | `src/data/edition/edition.json`                               |
| Speakers, committees, programme, topics, gallery, past editions | `src/data/<domain>/<domain>.json`                             |
| UI copy (pt/en)                                                 | `src/i18n/pt.json`, `src/i18n/en.json`                        |
| Colours, spacing, type                                          | `src/styles/styles.override.css`                              |
| Images                                                          | `public/images/<edition\|gallery\|history\|logos\|speakers>/` |

Every JSON file is validated against a zod schema next to it, so `pnpm
validate:data` will tell you when something is missing or malformed. Text
fields that support both languages accept either a plain string or an
`{ "en": "...", "pt": "..." }` object.

See the [edition setup guide](docs/edition-setup.md) for a field-by-field
walkthrough.

## Configuration

The only environment variable is `GOOGLE_TRANSLATE_API_KEY` (see
`.env.example`). It is optional and read at build time only: with it set, the
programme entries synced from EasyChair get machine-translated per locale;
without it, the scraped text is shown as-is in both languages.

The EasyChair programme sync itself is off until
`links.easyChairProgram` is set in `src/data/edition/edition.json`. Both the
sync and the translation call are non-fatal — if either fails, the build falls
back to the committed `src/data/program/program.json`.

## Deployment

`main` is what is deployed live, via Coolify. The build is a multi-stage
Docker image served by unprivileged nginx on port 8080;
`docker-compose.app.yml` is the entry point:

```bash
docker compose -f docker-compose.app.yml up --build
```

## Still to do for this edition

Tracked as open issues: the 2026 banner and proceedings cover
([#2](https://github.com/Nucleo-Estudantes-Informatica-ISEP/sei-isep-2026/issues/2)),
the speaker line-up
([#4](https://github.com/Nucleo-Estudantes-Informatica-ISEP/sei-isep-2026/issues/4)),
and the colour palette matching the 2026 artwork
([#6](https://github.com/Nucleo-Estudantes-Informatica-ISEP/sei-isep-2026/issues/6)).
The programme and gallery datasets are intentionally empty until there is real
content for them.

## Documentation

- [Edition setup guide](docs/edition-setup.md) — which file to edit for what
- [Architecture](docs/implementation/architecture.md) — layout, data flow, routing
- [Translation system](docs/implementation/translation-system.md)
- [Decision records](docs/decisions/README.md) — why the stack looks like this
- [Contribution workflow](docs/agents/contribution.md) — branches, commits, PRs, releases
- [`AGENTS.md`](AGENTS.md) — the short version, for AI agents and humans in a hurry

## Contributing

Work lands on `dev` and is promoted to `main` in batches. Branch from `dev`
using a [Conventional Branch](https://conventionalbranch.org/) name, commit
with [Conventional Commits](https://www.conventionalcommits.org/), and open a
PR into `dev` — never into `main` directly. The full rules, including the
release labels a `dev` → `main` promotion PR needs, are in
[`docs/agents/contribution.md`](docs/agents/contribution.md).
