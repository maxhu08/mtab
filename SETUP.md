# setup

How to setup (for firefox):

requirements:

- nodejs (using v21.7.2)
- bun (using v1.1.9)

OS: (Windows/macOS/Linux)

### installing required programs

if on windows:

- install nodejs from website: https://nodejs.org/en/download
- install bun here: https://bun.sh/docs/installation

if on linux (arch):

`pacman -S nodejs bun`

### setting up and building

clone repo

```
git clone https://github.com/maxhu08/mtab
cd mtab
```

install dependencies

```
bun i
```

make create_manifest_firefox.sh executable

```
chmod +x ./scripts/create_manifest_firefox.sh
```

build for firefox

```
bun build-firefox
```

the build output will be in dist/
