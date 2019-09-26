"use strict"
/**
 * Trezor Tx - A class that creates a Trezor-formatted transaction from any
 * format of transaction.
 */
const Buffer = require("@cosmic-plus/base/es5/buffer")

const TxTransformer = require("./tx-transformer")

/* Definition */

class TrezorTransaction extends TxTransformer {
  constructor (transaction) {
    super(rules, transaction)
    delete this.network

    // Fees
    if (!this.fee) this.fee = 100 * this.operations.length
    else this.fee = Number(this.fee) / 10000000

    // Timebounds
    if (this.minTime || this.maxTime) {
      this.timebounds = {
        minTime: this.minTime || null,
        maxTime: this.maxTime || null
      }
      delete this.minTime
      delete this.maxTime
    }

    // Operations
    this.operations.forEach(op => {
      if (op.type === "allowTrust") {
        op.assetType = op.assetCode.length <= 4 ? 1 : 2
        op.authorize = op.authorize ? 1 : 0
      } else if (op.type === "changeTrust") {
        notSupported("operation changeTrust")
        if (!op.limit) op.limit = rules.amount("922337203685.4775807")
      } else if (op.type === "createPassiveSellOffer") {
        op.type = "createPassiveOffer"
      } else if (op.type === "manageSellOffer") {
        op.type = "manageOffer"
      } else if (op.type === "manageBuyOffer") {
        notSupported("operation manageBuyOffer")
      } else if (op.type === "setOptions") {
        if (op.signer) {
          notSupported("set signer")
          op.signer_type = op.signer.type
          op.signer_key = op.signer.key
          op.signer_weight = op.signer.weight
          delete op.signer
        }
      }
    })

    // DEBUG
    console.log("Trezor TX", JSON.stringify(this, null, 2))
  }
}

/* Rules */

const rules = {}

rules.amount = function (amount) {
  return Number(amount * 10000000).toFixed(0)
}

rules.asset = function (asset) {
  if (asset.code === "XLM" && !asset.issuer) return null
  asset.type = asset.code.length <= 4 ? 1 : 2
  return asset
}

rules.assetsArray = function (array) {
  return array.map(rules.asset)
}

rules.buffer = function (buffer) {
  if (!buffer.value) return ""

  if (buffer.type === "base64") {
    return Buffer.from(buffer.value, "base64").toString("hex")
  } else {
    return Buffer.from(buffer.value).toString("hex")
  }
}

rules.date = function (date) {
  return Number(new Date(date)) / 1000
}

rules.memo = function (memo) {
  if (memo.type === "text") {
    memo.type = 1
    memo.text = memo.value
  } else if (memo.type === "base64") {
    notSupported("binary memo text")
  } else if (memo.type === "id") {
    memo.type = 2
    memo.id = memo.value
  } else if (memo.type === "hash") {
    memo.type = 3
    memo.hash = memo.value
  } else if (memo.type === "return") {
    memo.type = 4
    memo.hash = memo.value
  }
  delete memo.value
  return memo
}

rules.price = function (price) {
  if (typeof price !== "object") return { n: Number(price), d: 1 }
  else return price
}

rules.sequence = function (sequence) {
  return Number(sequence)
}

rules.signer = function (signer) {
  signer.key = signer.value
  if (signer.type === "key") signer.type = 0
  else if (signer.type === "hash") signer.type = 1
  else if (signer.type === "tx") signer.type = 2
  return signer
}

/* Helpers */
function notSupported (feature) {
  throw new Error(`This feature is not supported yet: ${feature}.`)
}

/* Export */
module.exports = TrezorTransaction
