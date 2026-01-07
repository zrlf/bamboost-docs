# Documentation Site for [bamboost](https://bamboost.ch)

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

To edit doc content, modify the files under `content/docs`.
The rendering pipeline uses [Quarto](https://quarto.org/) and [Fumadocs](https://fumadocs.dev).
The site is updated automatically when changes are pushed to the
`main` branch.

## Dependencies

- [pnpm](https://pnpm.io/) - node package manager
- [Node.js](https://nodejs.org/) - JavaScript runtime environment
- [uv](docs.astral.sh/uv) - python package manager
- [Quarto](https://quarto.org/docs/get-started/) - something something

## Installation

Sync python environment using `uv`:

```bash
uv sync
```

Install node dependencies using `pnpm`:

```bash
pnpm install
```

## Development

Extract the API of bamboost and dump it to `lib/`:
The package that provides the command `fumadocs-autodoc` is custom and part of
this repository (but fetched from pypi).

```bash
fumadocs-autodoc bamboost -d lib
```

To execute the quarto rendering pipeline and generate the doc content, run:

```bash
pnpm quarto-build
```

The `dev` command includes the quarto build step automatically.
To start the development server, run:

```bash
pnpm dev
```

To build the site for production, run:

```bash
pnpm build
```

To update the orama cloud index, run (needs private API key):

```bash
pnpm sync-oramacloud
```

## Tips

- the config for the api docs is in `fumapy.config.ts`.
  To add another package to be documented, add it in sources. E.g. `nbformat`
  at the route `/nbformat`:

```typescript
{
  sources: {
    bamboost: {
      baseUrl: "apidocs",
      title: "API Reference",
      pkgName: "bamboost",
      options: {
        className: "route-api",
      },
      sortClassMethods: true,
      gitUrl: "https://gitlab.com/cmbm-ethz/bamboost/-/blob/main/bamboost",
      excludeModules: [],
    },
    nbformat: {
      baseUrl: "nbformat",
      title: "API Reference",
      pkgName: "nbformat",
      options: {
        className: "route-api",
      },
      sortClassMethods: true,
      gitUrl: "https://gitlab.com/cmbm-ethz/bamboost/-/blob/main/bamboost",
      excludeModules: [],
    },
  },
}
```
