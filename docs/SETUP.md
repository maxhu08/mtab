# Setup

## Requirements

- Node.js `>= 25.2.1`
- Bun `>= 1.3.5`
- fnm `>= 1.38.1`
- zip `>= 3.0`

## Install Tools

### Windows

- Node.js: https://nodejs.org/en/download
- Bun: https://bun.sh/docs/installation
- fnm: https://github.com/Schniz/fnm

### macOS (Homebrew)

```sh
brew update
brew install node zip fnm
npm i -g bun
```

### Linux (Arch)

```sh
paru -S nodejs npm zip fnm
npm i -g bun
```

## Project Setup

```sh
git clone https://github.com/maxhu08/mtab
cd mtab
bun i
fnm use
```

## Common Commands

- Dev build: `bun run dev` or `bun run dev:firefox`
- Production builds: `bun run build:chrome`, `bun run build:firefox`
- Package zips: `bun run package:chrome`, `bun run package:firefox`
- Release candidate packages: `bun run rc:chrome`, `bun run rc:firefox`
- Source package zip: `bun run package:source`
- Validate changes: `bun run check`
- Format code: `bun run format`

## Load Extension Locally

1. Open browser extension settings.
2. Enable Developer Mode.
3. Click "Load unpacked".
4. Select the generated `dist/` directory.
