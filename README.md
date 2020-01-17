**trezor-wallet /**
[Readme](https://cosmic.plus/#view:js-trezor-wallet)
• [Contributing](https://cosmic.plus/#view:js-trezor-wallet/CONTRIBUTING)
• [Changelog](https://cosmic.plus/#view:js-trezor-wallet/CHANGELOG)

# Readme

![Licence](https://img.shields.io/github/license/cosmic-plus/js-trezor-wallet.svg)
[![Dependencies](https://badgen.net/david/dep/cosmic-plus/js-trezor-wallet)](https://david-dm.org/cosmic-plus/js-trezor-wallet)
![Vulnerabilities](https://snyk.io/test/npm/@cosmic-plus/trezor-wallet/badge.svg)
![Bundle](https://badgen.net/badgesize/gzip/cosmic-plus/js-trezor-wallet-web/master/trezor-wallet.js?label=bundle)
![Downloads](https://badgen.net/npm/dt/@cosmic-plus/trezor-wallet)

Easy Trezor wallet support for Stellar applications.

(Weekly updates: [Reddit](https://reddit.com/r/cosmic_plus),
[Twitter](https://twitter.com/cosmic_plus),
[Keybase](https://keybase.io/team/cosmic_plus),
[Telegram](https://t.me/cosmic_plus))

## Introduction

This library is a convenient wrapper around the official
[TrezorConnect](https://github.com/trezor/connect) library.

It provides a way to support Trezor devices with a few one-liners:

```js
// Step 1: Connect
await trezorWallet.connect()

// Step 2: Get public key
const pubkey = trezorWallet.publicKey

// Step 3: Sign
await trezorWallet.sign(transaction)

// Extra: Event handlers
trezorWallet.onConnect = connectionHandler
trezorWallet.onDisconnect = disconnectionHandler
```

This library is browser-only.

**Known limitations**

A few operations & parameters are not supported yet. An explicit error
message will get thrown if you try to sign a transaction including them:

- Binary text memo containing NULL characters,
- The `manageData` operation,
- The `manageBuyOffer` operation,
- The `pathPaymentStrictSend` operation.

If you encounter an unexpected error, please [fill an
issue](https://github.com/cosmic-plus/js-trezor-wallet/issues/new/choose).

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

### CDN

In your HTML page:

```HTML
<script src="https://cdn.cosmic.plus/trezor-wallet@1.x"></script>
```

_Note:_ For production release it is advised to serve your copy of the library.

## Usage

### Functions

#### trezorWallet.register(appUrl, email)

Registers yourself in the Trezor Connect Manifest. This provides them the
ability to reach you in case of any required maintenance.

This subscription is mandatory and the library register the Cosmic.plus
contact by default.

**See**: [Trezor Connect Manifest](https://github.com/trezor/connect/blob/develop/docs/index.md#trezor-connect-manifest)  
**Parameters:**

- `appUrl`: _String_ - Application URL.
- `email`: _String_ - Developer email.

#### await trezorWallet.connect([account])

Waits for a connection with a Trezor wallet. If **account** is not provided,
account 1 is used. The library will stop listening for a connection if
`trezorWallet.disconnect()` is called.

Once the connection is established, you can use `await trezorWallet.connect(account)` again at any time to ensure the device is
still connected.

When switching to another **account**, you can `await trezorWallet.connect(new_account)` without prior disconnection.

_Note:_ To stay consistent with the way Trezor numbers accounts, **account**
starts at 1 (derivation path: `m/44'/148'/0'`).

**Parameters:**

- `account`: _Number | String (default: 1)_ - Either an account number (starts at 1)
  or a derivation path (e.g: `m/44'/148'/0'`).

#### await trezorWallet.sign(transaction)

Prompts the user to accept **transaction** using the connected account of
their Trezor device.

If the user accepts, adds the signature to **transaction**. Else, throws an
error.

**Parameters:**

- `transaction`: _Transaction_ - A StellarSdk Transaction

#### trezorWallet.disconnect()

Close the connection with the Trezor device, or stop waiting for one in case
a connection has not been established yet.

#### trezorWallet.newAccount([horizon])

Connects the first unused account.

_Note:_ merged accounts are considered as used.

**Parameters:**

- `horizon`: _String | Server (default: https://horizon.stellar.org)_ - The
  Horizon server where to check for account existence. It can be either an URL
  or a _StellarSdk.Server_ object.

#### trezorWallet.scan([params]) ⇒  _Array_

Scans the Trezor device for accounts that exist on **params.horizon**. The
scanning stops after encountering **params.attempts** unused accounts.

Merged accounts are considered as existing accounts and will reset the
**params.attempts** counter when encountered.

Returns an _Array_ of _Objects_ containing `account` number, `publicKey`,
`path`, and `state` (either `"open"` or `"merged"`).

**Parameters:**

- `params`: _Object_ - Optional parameters.
  - `horizon`: _String | Server (default: https://horizon.stellar.org)_ - The
    Horizon server where to check for account existence. It can be either an URL
    or a _StellarSdk.Server_ object.
  - `attempts`: _Number (default: 3)_ - The number of empty accounts before
    scanning stops.
  - `includeMerged`: _Boolean (default: false)_ - List merged accounts as well.

#### trezorWallet.getPublicKeys([start], [length]) ⇒  _Array_

Request multiple public keys from the Trezor device. The request will return
**length** accounts, starting by **start** (minimum 1).

Returns an _Array_ of _Objects_ with properties `account`, `publicKey`, and
`path`.

**Parameters:**

- `start`: _Number (default: 1)_ - Starting account number
- `length`: _Number (default: 1)_ - Number of account to be listed.

### Events

#### trezorWallet.onConnect : _function_

_Function_ to execute on each connection.

#### trezorWallet.onDisconnect : _function_

_Function_ to execute on each disconnection.

### Members

#### trezorWallet.publicKey : _String_

PublicKey of the connected account.

#### trezorWallet.path : _String_

Derivation path of the connected account. (default: `m/44'/148'/0'`)

## Links

**Organization:** [Cosmic.plus](https://cosmic.plus/) | [@GitHub](https://git.cosmic.plus) | [@NPM](https://www.npmjs.com/search?q=cosmic-plus)

**Follow:** [Reddit](https://reddit.com/r/cosmic_plus) | [Twitter](https://twitter.com/cosmic_plus) | [Medium](https://medium.com/cosmic-plus) | [Codepen](https://codepen.io/cosmic-plus)

**Talk:** [Telegram](https://t.me/cosmic_plus) | [Keybase](https://keybase.io/team/cosmic_plus)
