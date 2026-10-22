# Damas Donde Sea

Spanish checkers in the browser (TypeScript + Vite, no runtime dependencies).

## Scripts
- `npm run dev` – local dev server
- `npm run build` – production build in `dist/` (static, deploy to Vercel as is)
- `npm run pack:desktop` – Windows desktop build (`DamasDondeSea.exe`, Electron) in `release/`

## Structure
- `src/core` – pure game logic: rules, types, minimax AI
- `src/app` – session (game flow), settings, saved games, sound, themes
- `src/ui` – DOM components and screens (menu, map select, game, settings, rules)
- `src/styles` – CSS

## Legacy
The original JavaFX version lives in `legacy-javafx/`.

## Assets
The logo animations in `public/video/` are the original MP4s converted to transparent WebM.
