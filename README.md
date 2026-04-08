# ORIGO

Premium e-commerce/showroom platform for collectible products — mechanical models, engineering kits, figures, statues, and accessories.

## Stack

- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS**
- **Zustand** (state)
- **React Hook Form** + **Zod** (forms, ready for use)
- **Framer Motion** (animation, ready for use)

## Architecture

- **Feature-Sliced Design**–inspired layout under `src/`:
  - `app/` — routes and pages
  - `entities/` — product & category model, types, API
  - `features/` — product gallery, specs, badges, availability, add-to-cart
  - `widgets/` — header, footer, product grid, category grid, product page, hero, CTA
  - `shared/` — UI primitives, lib, types, constants, styles

- **Product model**: shared `ProductBase` + type-specific details (discriminated union on `productType`).
- **Single product route** `/products/[slug]` with a **template resolver** that picks the right product template by `productType`.

## Product types

- `engineering-model`
- `model-kit`
- `collectible-figure`
- `toy-figure`
- `statue`
- `accessory`

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home — categories + featured products |
| `/products` | All products |
| `/products/featured` | Featured products (infinite scroll) |
| `/products/[slug]` | Product detail (template by type) |
| `/categories` | All categories |
| `/categories/[slug]` | Category listing |
| `/about` | About |
| `/contact` | Contact |

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deploy (GitHub Pages)

The app is set up for static export and deployment via GitHub Actions. Pushing to `main` runs the workflow in `.github/workflows/deploy.yml`: it builds the site and deploys the `out` directory to GitHub Pages.

- **Project site** (e.g. `username.github.io/origo`): `NEXT_PUBLIC_BASE_PATH` is set in the workflow to `/<repository-name>` so links and assets work under the project path. No local change needed.
- **User/org site** (e.g. `username.github.io`): set `NEXT_PUBLIC_BASE_PATH=` (empty) in the workflow and ensure **Settings → Pages → Source** is **GitHub Actions**.

## Data

Catalog and categories use in-memory mock data in `entities/*/api/data.ts`. Types and API functions are structured so you can swap in a CMS, REST API, or database later without changing UI.
