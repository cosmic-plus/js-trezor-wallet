"use_strict"
/**
 * This is a convenient wrapper around the official
 * [TrezorConnect](https://github.com/trezor/connect) library.
 *
 *
 * It enables you to connect to Trezor devices and sign Stellar transactions in
 * a few lines of code:
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
 * This is a beta release that is made public for testing purpose. While the
 * library is stable & secure, several issues are still being worked out with
 * Trezor teams.
 *
 * A few operations & parameters are not supported yet. An explicit error
 * message will get thrown if you try to sign a transaction including them:
 *
 * - Text memos using binary data,
 * - The `bumpSequence` operation,
 * - The `changeTrust` operation,
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

/* Properties */

/**
 * PublicKey of the connected account.
 * @var {String}
 */
trezor.publicKey = null

/**
 * BIP path of the connected account.
 * @var {String}
 */
trezor.path = null

/* Methods */

let connection, disconnection

/**
 * Registers yourself in the Trezor Connect Manifest. This provides them the
 * ability to reach you in case of any required maintenance.
 *
 * This subscription is mandatory.
 *
 * @see [Trezor Connect Manifest](https://github.com/trezor/connect/blob/develop/docs/index.md#trezor-connect-manifest)
 *
 * @param email {String} Developer email.
 * @param appUrl {String} Application URL.
 */
trezor.register = function (appUrl, email) {
  TrezorConnect.manifest({ email, appUrl })
}

/**
 * Waits for a connection with a Trezor wallet. If **account** is not provided,
 * acount 1 is used. The library will stop listening for a connection if
 * `trezorWallet.disconnect()` is called.
 *
 * Once the connection is established, you can use `await
 * trezorWallet.connect()` again at any time to ensure the device is still
 * connected.
 *
 * When switching to another **account**, it is possible to `await
 * trezorWallet.connect(new_account_number)` without prior disconnection.
 *
 * _Note:_ To stay consistent with the way Trezor list accounts, **account**
 * starts at 1 and account 1 BIP path is `m/44'/148'/0'`.
 *
 * @async
 * @param [account=1] {Number} Account number to connect to.
 */
trezor.connect = async function (account, index, internalFlag) {
  // Prevent account=0 error.
  if (account === 0) throw new Error("Account number starts at 1.")

  // Compute bip path.
  if (account === undefined) {
    account = trezor.account || 0
    index = trezor.index || 0
    internalFlag = trezor.internalFlag || false
  } else {
    account--
  }

  const path = makePath(account, index, internalFlag)

  // Ensure the disconnection process is finished.
  if (disconnection) {
    await disconnection
    disconnection = null
  }

  // If the bip path is different we need to go through connect() again.
  if (trezor.path !== path) {
    reset()
    /**
     * Account number of the connected account.
     * @var {Number}
     */
    trezor.account = account || 0
    trezor.path = path
    trezor.index = index || 0
    trezor.internalFlag = internalFlag || false
  }

  // Connect & update data only when needed.
  if (!connection) connection = connect()
  return connection
}

function makePath (account, index, internalFlag) {
  let path = `m/44'/148'/${account}'`
  if (index || internalFlag) path += internalFlag ? "/1'" : "/0'"
  if (index) path += `/${index}'`
  return path
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
 * @param transaction {Transaction} A StellarSdk Transaction
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
 * Close the connection with the Trezor device, or stop listening for one in
 * case a connection has not been established yet.
 * @async
 */
trezor.disconnect = async function () {
  onDisconnect()
}

function reset () {
  connection = null
  const fields = ["path", "account", "index", "internalFlag", "publicKey"]
  fields.forEach(name => {
    delete trezor[name]
  })
}

/* Event handlers */

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
 * @var {Function}
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
 * @var {Function}
 */
trezor.onDisconnect = null
function onDisconnect () {
  // eslint-disable-next-line no-console
  console.log("Trezor disconnected")
  reset()
  if (typeof trezor.onDisconnect === "function") trezor.onDisconnect()
}
