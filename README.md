**trezor-wallet /**
[Readme](https://cosmic.plus/#view:js-trezor-wallet)
• [Contributing](https://cosmic.plus/#view:js-trezor-wallet/CONTRIBUTING)
• [Changelog](https://cosmic.plus/#view:js-trezor-wallet/CHANGELOG)

# Readme

![Licence](https://img.shields.io/github/license/cosmic-plus/js-trezor-wallet.svg)
[![Dependencies](https://badgen.net/david/dep/cosmic-plus/js-trezor-wallet)](https://david-dm.org/cosmic-plus/js-trezor-wallet)
![Vulnerabilities](https://snyk.io/test/npm/@cosmic-plus/trezor-wallet/badge.svg)
![Downloads](https://badgen.net/npm/dt/@cosmic-plus/trezor-wallet)
![Bundle](https://badgen.net/badgesize/gzip/cosmic-plus/js-trezor-wallet-web/master/trezor-wallet.js?label=bundle)

Easy Trezor wallet support for Stellar applications.

## Introduction

This library is a convenient wrapper around the official
[TrezorConnect](https://github.com/trezor/connect) library.

It provides a way to support Trezor devices with a few one-liners:

```js
// Step 1: Register to Trezor Connect Manifest
trezorWallet.register("example.org", "dev@example.org")

// Step 2: Connect
await trezorWallet.connect()

// Step 3: Get public key
const pubkey = trezorWallet.publicKey

// Step 4: Sign
await trezorWallet.sign(transaction)
```

This library is browser-only.

**Beta Release**

This is a beta release that is made public for testing purposes. While the
library is stable & secure, several issues are still being worked out with
Trezor teams.

A few operations & parameters are not supported yet. An explicit error
message will get thrown if you try to sign a transaction including them:

- Binary text memo containing NULL characters,
- The `inflation` operation,
- The `manageData` operation,
- The `manageBuyOffer` operation,

If you encounter an unexpected error, please play the game and [fill an
issue](https://github.com/cosmic-plus/js-trezor-wallet/issues/new/choose).

The public release will possibly contain one or more breaking changes.
Please check the [changelog](CHANGELOG.md) before upgrading.

## Installation

### NPM/Yarn

- NPM: `npm install @cosmic-plus/trezor-wallet`
- Yarn: `yarn add @cosmic-plus/trezor-wallet`

In your script: `const trezorWallet = require("@cosmic-plus/trezor-wallet")`

### Bower

`bower install cosmic-plus-trezor-wallet`

In your HTML page:

```HTML
<script src="./bower_components/cosmic-plus-trezor-wallet/trezor-wallet.js"></script>
```

### HTML

In your HTML page:

```HTML
<script src="https://cdn.cosmic.plus/trezor-wallet@0.x"></script>
```

_Note:_ For production release it is advised to serve your copy of the library.

## Usage

### Methods

#### trezorWallet.register(appUrl, email)

Registers yourself in the Trezor Connect Manifest. This provides them the
ability to reach you in case of any required maintenance.

This subscription is mandatory.

**See**: [Trezor Connect Manifest](https://github.com/trezor/connect/blob/develop/docs/index.md#trezor-connect-manifest)

| Param  | Type     | Description      |
| ------ | -------- | ---------------- |
| appUrl | `String` | Application URL. |
| email  | `String` | Developer email. |

#### await trezorWallet.connect([account])

Waits for a connection with a Trezor wallet. If **account** is not provided,
account 1 is used. The library will stop listening for a connection if
`trezorWallet.disconnect()` is called.

Once the connection is established, you can use `await trezorWallet.connect()` again at any time to ensure the device is still
connected.

When switching to another **account**, you can `await trezorWallet.connect(new_account)` without prior disconnection.

_Note:_ To stay consistent with the way Trezor number accounts, **account**
starts at 1 (derivation path: `m/44'/148'/0'`).

| Param     | Type                 | Default | Description                                                                         |
| --------- | -------------------- | ------- | ----------------------------------------------------------------------------------- |
| [account] | `Number` \| `String` | `1`     | Either an account number (starts at 1) or a derivation path (e.g: `m/44'/148'/0'`). |

#### await trezorWallet.sign(transaction)

Prompts the user to accept **transaction** using the connected account of
their Trezor device.

If the user accepts, adds the signature to **transaction**. Else, throws an
error.

| Param       | Type          | Description              |
| ----------- | ------------- | ------------------------ |
| transaction | `Transaction` | A StellarSdk Transaction |

#### trezorWallet.disconnect()

Close the connection with the Trezor device, or stop waiting for one in case
a connection has not been established yet.

### Events

#### trezorWallet.onConnect : `function`

_Function_ to execute on each connection.

#### trezorWallet.onDisconnect : `function`

_Function_ to execute on each disconnection.

### Members

#### trezorWallet.publicKey : `String`

PublicKey of the connected account.

#### trezorWallet.path : `String`

Derivation path of the connected account. (default: `m/44'/148'/0'`)

## Links

**Organization:** [Cosmic.plus](https://cosmic.plus/) | [@GitHub](https://git.cosmic.plus) | [@NPM](https://www.npmjs.com/search?q=cosmic-plus)

**Follow:** [Reddit](https://reddit.com/r/cosmic_plus) | [Twitter](https://twitter.com/cosmic_plus) | [Medium](https://medium.com/cosmic-plus) | [Codepen](https://codepen.io/cosmic-plus)

**Talk:** [Telegram](https://t.me/cosmic_plus) | [Keybase](https://keybase.io/team/cosmic_plus)
