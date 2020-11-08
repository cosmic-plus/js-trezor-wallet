"use strict"
/**
 * Tx Transformer
 *
 * Derives new formats from CosmicLink Transitional Description.
 */
const { CosmicLink, specs } = require("cosmic-lib")

/* Definition */

class TxTransformer {
  constructor (rules, tx) {
    const tdesc = new CosmicLink(tx).tdesc

    specs.transactionOptionalFields.forEach((field) => {
      const value = tdesc[field]
      if (value) this[field] = transform.field(rules, field, value)
    })
    this.operations = tdesc.operations.map((o) => transform.odesc(rules, o))
  }
}

/* Routines */

const transform = {}

transform.field = function (rules, field, value) {
  const type = specs.fieldType[field]
  return rules[type] ? rules[type](value) : value
}

transform.odesc = function (rules, odesc) {
  const result = {}
  for (let field in odesc) {
    result[field] = transform.field(rules, field, odesc[field])
  }
  return result
}

/* Export */
module.exports = TxTransformer
