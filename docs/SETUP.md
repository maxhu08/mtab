# setup

How to setup:

## requirements

requirements:

- nodejs >= v21.7.2
- bun >= v1.1.9
- zip >= v3.0

OS: (Windows/macOS/Linux)

### windows

- install nodejs from website: https://nodejs.org/en/download
- install bun here: https://bun.sh/docs/installation

### linux (arch)

```shell
pacman -S nodejs npm zip
npm i -g bun
```

## building

clone repo

```shell
git clone https://github.com/maxhu08/mtab
cd mtab
```

install dependencies

```shell
bun i
```

to build

```shell
bun build-chrome
bun build-firefox
```

to package

```shell
bun package-chrome
bun package-firefox
```

Want to [contribute](./CONTRIBUTING.md)?
