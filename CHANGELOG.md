**trezor-wallet /**
[Readme](https://cosmic.plus/#view:js-trezor-wallet)
• [Contributing](https://cosmic.plus/#view:js-trezor-wallet/CONTRIBUTING)
• [Changelog](https://cosmic.plus/#view:js-trezor-wallet/CHANGELOG)

# Changelog

All notable changes to this project will be documented in this file.

This project adheres to **[Semantic
Versioning](https://semver.org/spec/v2.0.0.html)**. Version syntax is
`{major}.{minor}.{patch}`, where a field bump means:

- **Patch**: The release contains bug fixes.
- **Minor**: The release contains backward-compatible changes.
- **Major**: The release contains compatibility-breaking changes.

**Remember:** Both micro and minor releases are guaranteed to respect
backward-compatibility and can be updated to without risk of breakage. For major
releases, please check this changelog before upgrading.

## 1.3.0 - 2020-05-24

### Changed

- Documentation: `manageData` operation is now fully supported.

### Fixed

- Logic: Fix handling of `pathPayment` operations.

## 1.2.0 - 2020-04-18

### Changed

- Logic: Update [trezor-connect]. (firmware compatibility update + bugfixes)

## 1.1.0 - 2020-03-07

### Changed

- Meta: Upgrade to [stellar-sdk] 4.x.

## 1.0.3 - 2020-02-24

### Fixed

- Logic: Fix a wrong sequence issue. (Thanks [@Tyvdh](https://github.com/tyvdh))

## 1.0.2 - 2020-01-18

### Fixed

- Documentation: Update according to 1.x release. (sorry about that!)
- Logic: Update trezor-connect to 8.0.13.
  ([bugfixes](https://github.com/trezor/connect/blob/develop/CHANGELOG.md#8013))

## 1.0.1 - 2019-12-28

### Fixed

- Logic: Fix `.scan()` handling of merged account. (They were stated as opened)

## 1.0.0 - 2019-12-07

### Breaking

- API: Breaking change: account=1 is always the default for `.connect()`.
  Previously, the default was the latest used account number, or 1. This was
  leaving room for errors in account handling and has been changed to a clearer
  behavior. As of now, the right way to ensure the connection is still alive is
  to use `trezorWallet.connect(account)`, except when if _account_ is 1.
- Logic: Breaking change: set `trezor.path` once connected. Before,
  `trezor.path` was set before connection actually happened, which was an
  inconsistent behavior.

## 0.5.0 - 2019-11-23

### Changed

- Logic: Update [trezor-connect] to 8.0.10. (bugfixes)

## 0.4.0 - 2019-11-09

### Added

- API: Add `.getPublicKeys()`. This method retrieves multiple public keys at
  once. ([See
  documentation](https://cosmic.plus/#view:js-trezor-wallet/%23trezorwalletgetpublickeys))

- API: Add `.scan()`. This method scans for existing accounts on the Trezor
  Device. ([See
  documentation](https://cosmic.plus/#view:js-trezor-wallet/%23trezorwalletscan))

- API: Add `.newAccount()`. This method connects the first unused account of a
  Trezor device. ([See
  documentation](https://cosmic.plus/#view:js-trezor-wallet/%23trezorwalletnewaccount))

### Changed

- API: Make `.register()` optional. The library now register using <Cosmic.plus>
  credentials by default.

- Documentation: Multiple improvements & fixes. _Important:_
  `trezorWallet.register()` parameters were documented in the wrong order. The
  correct order is `(appUrl, email)`.

## 0.3.0 - 2019-10-19

### Added

- API: Add support for `changeTrust`.
- API: Add partial support for binary text memo. Text memo buffers containing
  NULL characters are still unsupported. See [trezor-firmware
  issue#610](https://github.com/trezor/trezor-firmware/issues/610)

### Changed

- API: Upgrade [trezor-connect] to 8.0.7. It fixes `bumpSequence` operation
  support.

### Fixed

- Logic: Fix handling of minTime|maxTime = 0.

## 0.2.0 - 2019-10-05

### Breaking

- API: `.disconnect()` is now synchronous.

### Added

- API: Add support for `trezor.connect(bipPath)`. `.connect()` now accepts
  either an account number as per Trezor definition, either a BIP path. For
  example, account 1 is `m/44'/148'/0'`.
- Logic: Add `setOptions/signer` support. (Thanks [@matejcik])

### Changed

- Documentation: Update [CHANGELOG.md]. Outline the fact that this is a beta
  release & that breaking changes may happen on minor updates (0.x.0).
- Documentation: Update [README.md].
- Logic: Skip validating pubkey on device. (Thanks [@matejcik])

### Fixed

- Logic: Fix account number handling. A mistake caused the wrong account to be
  used in some cases.

## 0.1.0 - 2019-09-28

Initial release.

[@matejcik]: https://github.com/matejcik
[readme.md]: https://cosmic.plus/#view:js-trezor-wallet
[changelog.md]: https://cosmic.plus/#view:js-trezor-wallet/CHANGELOG
[trezor-connect]: https://github.com/trezor/connect/blob/develop/CHANGELOG.md
