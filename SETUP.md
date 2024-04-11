# setup

How to setup (for firefox):

requirements:

- nodejs (using v21.7.2)
- pnpm (using v8.15.2)

OS: (Windows/macOS/Linux)

### installing required programs

if on windows:

- install nodejs from website: https://nodejs.org/en/download
- install pnpm here: https://pnpm.io/installation

if on linux (arch):

`pacman -S nodejs npm pnpm`

### setting up and building

clone repo

```
git clone https://github.com/maxhu08/mtab
cd mtab
```

install dependencies

```
pnpm i
```

make create_manifest_firefox.sh executable

```
chmod +x ./scripts/create_manifest_firefox.sh
```

build for firefox

```
pnpm build-firefox
```

the build output will be in dist/
