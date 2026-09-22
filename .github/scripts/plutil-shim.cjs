#!/usr/bin/env node
/*
 * Stand-in for macOS `plutil` on the Linux repack pool, covering exactly the two calls
 * @expo/repack-app makes on an iOS base: `plutil -convert xml1 <file>` and
 * `plutil -convert binary1 <file>`, both in place. Anything else fails loudly.
 *
 * xml1 decodes a binary plist into XML so the repack can parse it. binary1 leaves the
 * file as XML: CoreFoundation loads an XML Info.plist exactly as it loads a binary one,
 * and skipping the re-encode keeps every value type exactly as the base declared it.
 *
 * Workaround for rnw-community/mobile-ci v3.0.0 running the iOS repack on Linux without
 * a plutil; remove it once mobile-ci provides one.
 */
const fs = require('node:fs');
const bplistParser = require('bplist-parser');
const expoPlist = require('@expo/plist').default;

const BinaryPlistMagic = 'bplist00';

const [flag, format, filePath, ...rest] = process.argv.slice(2);

if (flag !== '-convert' || (format !== 'xml1' && format !== 'binary1') || !filePath || rest.length > 0) {
    process.stderr.write(`plutil shim: unsupported invocation: plutil ${process.argv.slice(2).join(' ')}\n`);
    process.exit(2);
}

const contents = fs.readFileSync(filePath);
const isBinary = contents.subarray(0, BinaryPlistMagic.length).toString('latin1') === BinaryPlistMagic;

if (format === 'xml1' && isBinary) {
    const [root] = bplistParser.parseBuffer(contents);
    fs.writeFileSync(filePath, expoPlist.build(root));
}
