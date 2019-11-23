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
- **Minor**: As long as `major` is 0, those releases may contain breaking
  changes.
- **Major**: A bump to `1.x` means that the API is stable and that minor updates
  won't contain breaking changes anymore.

**Remember:** This is a beta release, the API is not stable yet. Only minor
updates are guaranteed to respect backward-compatibility. For minor and major
releases, please check this changelog before upgrading.

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
