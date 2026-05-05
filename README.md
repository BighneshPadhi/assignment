# Admin Console (Next.js + MUI + Zustand + NextAuth)

## Setup

1. Install dependencies

```bash
npm install
```

2. Create a local env file

```bash
cp .env.example .env.local
```

3. Run the dev server

```bash
npm run dev
```

The app runs at http://localhost:3000.

## Demo credentials

- Username: kminchelle
- Password: 0lelplR

## State Management Notes

Zustand was chosen for its simplicity, small footprint, and built-in async actions. It keeps state logic lightweight and readable without the boilerplate that Redux often introduces for small to medium apps.

Caching is implemented in the list stores to reduce duplicate API calls for identical pagination and filter queries.

## Project Highlights

- NextAuth credential login wired to DummyJSON auth
- Zustand stores for auth, users, and products
- MUI-based responsive UI for list and detail views

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
