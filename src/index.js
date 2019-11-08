"use strict"
/**
 * This library is a convenient wrapper around the official
 * [TrezorConnect](https://github.com/trezor/connect) library.
 *
 * It provides a way to support Trezor devices with a few one-liners:
 *
 * ```js
 * // Step 1: Register to Trezor Connect Manifest
 * trezorWallet.register("example.org", "dev@example.org")
 *
 * // Step 2: Connect
 * await trezorWallet.connect()
 *
 * // Step 3: Get public key
 * const pubkey = trezorWallet.publicKey
 *
 * // Step 4: Sign
 * await trezorWallet.sign(transaction)
 * ```
 *
 * This library is browser-only.
 *
 * **Beta Release**
 *
 * This is a beta release that is made public for testing purposes. While the
 * library is stable & secure, several issues are still being worked out with
 * Trezor teams.
 *
 * A few operations & parameters are not supported yet. An explicit error
 * message will get thrown if you try to sign a transaction including them:
 *
 * - Binary text memo containing NULL characters,
 * - The `inflation` operation,
 * - The `manageData` operation,
 * - The `manageBuyOffer` operation,
 *
 * If you encounter an unexpected error, please play the game and [fill an
 * issue](https://github.com/cosmic-plus/js-trezor-wallet/issues/new/choose).
 *
 * The public release will possibly contain one or more breaking changes.
 * Please check the [changelog](CHANGELOG.md) before upgrading.
 *
 * @exports trezorWallet
 */
const trezor = exports

const TrezorConnect = require("trezor-connect").default

const Buffer = require("@cosmic-plus/base/es5/buffer")

const TrezorTx = require("./trezor-tx")

/* Configuration */
const BIP_PATH = "m/44'/148'"

/* Properties */

/**
 * PublicKey of the connected account.
 *
 * @member {String}
 */
trezor.publicKey = null

/**
 * Derivation path of the connected account. (default: `m/44'/148'/0'`)
 *
 * @member {String}
 */
trezor.path = null

/* Methods */

let connection

/**
 * Registers yourself in the Trezor Connect Manifest. This provides them the
 * ability to reach you in case of any required maintenance.
 *
 * This subscription is mandatory.
 *
 * @see [Trezor Connect Manifest](https://github.com/trezor/connect/blob/develop/docs/index.md#trezor-connect-manifest)
 *
 * @param {String} appUrl - Application URL.
 * @param {String} email - Developer email.
 */
trezor.register = function (appUrl, email) {
  TrezorConnect.manifest({ email, appUrl })
}

/**
 * Waits for a connection with a Trezor wallet. If **account** is not provided,
 * account 1 is used. The library will stop listening for a connection if
 * `trezorWallet.disconnect()` is called.
 *
 * Once the connection is established, you can use `await
 * trezorWallet.connect()` again at any time to ensure the device is still
 * connected.
 *
 * When switching to another **account**, you can `await
 * trezorWallet.connect(new_account)` without prior disconnection.
 *
 * _Note:_ To stay consistent with the way Trezor number accounts, **account**
 * starts at 1 (derivation path: `m/44'/148'/0'`).
 *
 * @async
 * @param {Number|String} [account=1] - Either an account number (starts at 1)
 * or a derivation path (e.g: `m/44'/148'/0'`).
 */
trezor.connect = async function (account = trezor.path) {
  let path = account || `${BIP_PATH}/0'`
  if (typeof account === "number") {
    if (account < 1) throw new Error("Account number starts at 1.")
    path = `${BIP_PATH}/${account - 1}'`
  }

  // Update properties.
  if (trezor.path !== path) {
    reset()
    trezor.path = path
  }

  // Connect & update data only when needed.
  if (!connection) connection = connect()
  return connection
}

async function connect () {
  // eslint-disable-next-line no-console
  console.log("Attempting Trezor connection...")
  connection = TrezorConnect.stellarGetAddress({
    path: trezor.path,
    showOnTrezor: false
  })
  const result = await connection

  if (result.success) {
    trezor.publicKey = result.payload.address
    onConnect()
  } else {
    throw new Error(result.payload.error)
  }
}

/**
 * Prompts the user to accept **transaction** using the connected account of
 * their Trezor device.
 *
 * If the user accepts, adds the signature to **transaction**. Else, throws an
 * error.
 *
 * @async
 * @param {Transaction} transaction - A StellarSdk Transaction
 */
trezor.sign = async function (transaction) {
  const StellarSdk = require("@cosmic-plus/base/es5/stellar-sdk")

  if (!trezor.publicKey) throw new Error("No Trezor connected.")

  const result = await TrezorConnect.stellarSignTransaction({
    path: trezor.path,
    networkPassphrase: transaction.networkPassphrase,
    transaction: new TrezorTx(transaction)
  })
  if (!result.success) throw new Error(result.payload.error)

  const keypair = StellarSdk.Keypair.fromPublicKey(trezor.publicKey)
  const hint = keypair.signatureHint()
  const signature = Buffer.from(result.payload.signature, "hex")
  const decorated = new StellarSdk.xdr.DecoratedSignature({ hint, signature })
  transaction.signatures.push(decorated)
  // DEBUG
  console.log("signed", transaction)
}

/**
 * Close the connection with the Trezor device, or stop waiting for one in case
 * a connection has not been established yet.
 */
trezor.disconnect = function () {
  try {
    // Try to close iframe. TODO: find a more reliable method
    TrezorConnect.cancel()
  } catch (error) {
    null
  }
  onDisconnect()
}

function reset () {
  connection = null
  const fields = ["path", "publicKey"]
  fields.forEach(name => trezor[name] = null)
}

/**
 * Request multiple public keys from the Trezor device. The request will return
 * **length** accounts, starting by **start** (minimum 1).
 *
 * Returns an _Array_ of _Objects_ with properties `account`, `publicKey`, and
 * `path`.
 *
 * @param {Number} [start=1] - Starting account number
 * @param {Number} [lenght=1] - Number of account to be listed.
 * @return {Array}
 */
trezor.getPublicKeys = async function (start = 1, length = 1) {
  const bundle = []

  for (let account = start; account < start + length; account++) {
    bundle.push({
      path: trezor.connect.path(account),
      showOnTrezor: false
    })
  }

  const response = await TrezorConnect.stellarGetAddress({ bundle })
  return response.payload.map((entry, index) => ({
    account: start + index,
    publicKey: entry.address,
    path: entry.serializedPath
  }))
}

/* Events */

TrezorConnect.on("DEVICE_EVENT", event => {
  // eslint-disable-next-line no-console
  console.log("DEVICE_EVENT", console.log(event))
  if (event.type === "device-disconnect") onDisconnect()
  else if (event.type === "device-connect") onConnect()
})

/**
 * _Function_ to execute on each connection.
 *
 * @category event
 * @member {Function}
 */
trezor.onConnect = null
function onConnect () {
  // eslint-disable-next-line no-console
  console.log("Trezor connected")
  if (typeof trezor.onConnect === "function") trezor.onConnect()
}

/**
 * _Function_ to execute on each disconnection.
 *
 * @category event
 * @member {Function}
 */
trezor.onDisconnect = null
function onDisconnect () {
  // eslint-disable-next-line no-console
  console.log("Trezor disconnected")
  reset()
  if (typeof trezor.onDisconnect === "function") trezor.onDisconnect()
}
