# setup

How to setup:

## requirements

requirements:

- nodejs >= v21.7.2
- bun >= v1.1.37
- fnm >= v1.37.1
- zip >= v3.0

OS: (Windows/macOS/Linux)

### windows

- install nodejs here: https://nodejs.org/en/download
- install bun here: https://bun.sh/docs/installation
- install fnm here: https://github.com/Schniz/fnm

### macOS (Homebrew)

```shell
# updates homebrew
brew update

# installs nodejs and zip via homebrew
brew install node
brew install zip
brew install fnm

# installs bun via npm
npm i -g bun
```

### linux (Arch)

```shell
pacman -S nodejs npm zip
npm i -g bun
curl -fsSL https://fnm.vercel.app/install | bash
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

select correct node version

```shell
fnm use
```

to run in dev mode
go to `extensions > manage extensions > enable developer mode`
then click load unpacked and choose the dist folder

```shell
bun d
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
