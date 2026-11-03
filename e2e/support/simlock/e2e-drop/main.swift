// e2e-drop: file operations inside a leased iOS simulator, for test fixtures.
//
// Run as `simctl spawn <udid> <E2EDrop.app>/E2EDrop <command> ...` (simlock's exec
// API inserts the UDID). Newer CoreSimulator refuses to spawn the Mac's own
// /bin tools, and the simulator runtime ships no shell, cp or tar, so this
// helper, built for the simulator and installed as an app, does the copying.
// Payloads arrive on stdin as base64 of raw-deflate data.
//
//   untar <dir>          stdin: a ustar archive; regular files and directories only
//   write <path>         stdin: the file's bytes
//   cp <src> <dst>       copy a file, replacing dst, creating dst's directory
//   rm <dir> <prefix>    delete the entries of dir whose name starts with prefix
//   mkdir <path>         create a directory and its parents
//   test <path>          exit 0 when path exists, 1 when it does not
import Foundation

let fm = FileManager.default

func fail(_ message: String, _ code: Int32 = 2) -> Never {
    FileHandle.standardError.write("e2e-drop: \(message)\n".data(using: .utf8)!)
    exit(code)
}

func payload() -> Data {
    let text = FileHandle.standardInput.readDataToEndOfFile()
    guard let b64 = String(data: text, encoding: .ascii)?.trimmingCharacters(in: .whitespacesAndNewlines),
          let deflated = Data(base64Encoded: b64) else { fail("stdin is not base64") }
    do { return try (deflated as NSData).decompressed(using: .zlib) as Data } catch { fail("stdin is not raw deflate: \(error)") }
}

func ensureParent(_ path: String) throws {
    try fm.createDirectory(atPath: (path as NSString).deletingLastPathComponent, withIntermediateDirectories: true)
}

func replace(_ path: String, with data: Data) throws {
    try ensureParent(path)
    if fm.fileExists(atPath: path) { try fm.removeItem(atPath: path) }
    guard fm.createFile(atPath: path, contents: data) else { fail("cannot write \(path)") }
}

func field(_ block: Data, _ offset: Int, _ length: Int) -> String {
    let bytes = block[block.startIndex + offset ..< block.startIndex + offset + length].prefix { $0 != 0 }
    return String(decoding: bytes, as: UTF8.self)
}

func untar(_ archive: Data, into root: String) throws -> Int {
    var offset = 0
    var count = 0
    while offset + 512 <= archive.count {
        let header = archive.subdata(in: offset ..< offset + 512)
        if header.allSatisfy({ $0 == 0 }) { break }
        let name = field(header, 0, 100)
        let prefix = field(header, 345, 155)
        let sizeText = field(header, 124, 12).trimmingCharacters(in: CharacterSet(charactersIn: " \0"))
        guard let size = Int(sizeText, radix: 8) else { fail("bad size in tar header for \(name)") }
        let type = header[header.startIndex + 156]
        let path = (prefix.isEmpty ? name : "\(prefix)/\(name)")
        if path.hasPrefix("/") || path.split(separator: "/").contains("..") { fail("unsafe path in archive: \(path)") }
        let target = (root as NSString).appendingPathComponent(path)
        offset += 512
        switch type {
        case UInt8(ascii: "5"):
            try fm.createDirectory(atPath: target, withIntermediateDirectories: true)
        case UInt8(ascii: "0"), 0:
            try replace(target, with: archive.subdata(in: offset ..< offset + size))
            count += 1
        default:
            fail("unsupported tar entry type \(type) for \(path); pack with --format=ustar")
        }
        offset += (size + 511) / 512 * 512
    }
    return count
}

let args = Array(CommandLine.arguments.dropFirst())
do {
    switch (args.first, args.count) {
    case ("untar", 2):
        try fm.createDirectory(atPath: args[1], withIntermediateDirectories: true)
        print("unpacked \(try untar(payload(), into: args[1])) files")
    case ("write", 2):
        try replace(args[1], with: payload())
    case ("cp", 3):
        guard let data = fm.contents(atPath: args[1]) else { fail("no such file: \(args[1])", 3) }
        try replace(args[2], with: data)
    case ("rm", 3):
        for entry in (try? fm.contentsOfDirectory(atPath: args[1])) ?? [] where entry.hasPrefix(args[2]) {
            try fm.removeItem(atPath: (args[1] as NSString).appendingPathComponent(entry))
        }
    case ("mkdir", 2):
        try fm.createDirectory(atPath: args[1], withIntermediateDirectories: true)
    case ("test", 2):
        exit(fm.fileExists(atPath: args[1]) ? 0 : 1)
    default:
        fail("usage: e2e-drop untar <dir> | write <path> | cp <src> <dst> | rm <dir> <prefix> | mkdir <path> | test <path>")
    }
} catch {
    fail("\(error)")
}
