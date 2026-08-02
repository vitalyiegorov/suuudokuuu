import { readFileSync, writeFileSync } from 'node:fs';
import { crc32, deflateSync, inflateSync } from 'node:zlib';

const PngSignature = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const RgbColorType = 2;
const RgbaColorType = 6;

interface PngHeader {
    bitDepth: number;
    colorType: number;
    height: number;
    interlaceMethod: number;
    width: number;
}

interface DecodedPng {
    channelCount: number;
    colorType: number;
    height: number;
    rows: Uint8Array[];
    width: number;
}

function assertPngSignature(data: Buffer, filePath: string): void {
    const signatureMatches = data.length >= PngSignature.length && PngSignature.every((byte, index) => data[index] === byte);

    if (!signatureMatches) {
        throw new Error(`${filePath} does not start with a valid PNG signature`);
    }
}

function parsePngHeader(body: Buffer, filePath: string): PngHeader {
    const width = body.readUInt32BE(0);
    const height = body.readUInt32BE(4);
    const bitDepth = body.readUInt8(8);
    const colorType = body.readUInt8(9);
    const interlaceMethod = body.readUInt8(12);

    if (bitDepth !== 8) {
        throw new Error(`${filePath} has unsupported PNG bit depth ${bitDepth}; only 8-bit depth is supported`);
    }

    if (interlaceMethod !== 0) {
        throw new Error(`${filePath} uses PNG interlacing, which is not supported`);
    }

    return { bitDepth, colorType, height, interlaceMethod, width };
}

function getChannelCountForColorType(colorType: number, filePath: string): number {
    if (colorType === RgbColorType) {
        return 3;
    }

    if (colorType === RgbaColorType) {
        return 4;
    }

    throw new Error(`${filePath} has unsupported PNG color type ${colorType}; only RGB (2) and RGBA (6) are supported`);
}

function paethPredictor(left: number, above: number, aboveLeft: number): number {
    const initialEstimate = left + above - aboveLeft;
    const leftDistance = Math.abs(initialEstimate - left);
    const aboveDistance = Math.abs(initialEstimate - above);
    const aboveLeftDistance = Math.abs(initialEstimate - aboveLeft);

    if (leftDistance <= aboveDistance && leftDistance <= aboveLeftDistance) {
        return left;
    }

    if (aboveDistance <= aboveLeftDistance) {
        return above;
    }

    return aboveLeft;
}

function unfilterRow(row: Uint8Array, previousRow: Uint8Array, filterType: number, channelCount: number, filePath: string): void {
    const stride = row.length;

    if (filterType === 0) {
        return;
    }

    if (filterType === 1) {
        for (let index = channelCount; index < stride; index += 1) {
            row[index] = (row[index] + row[index - channelCount]) & 255;
        }

        return;
    }

    if (filterType === 2) {
        for (let index = 0; index < stride; index += 1) {
            row[index] = (row[index] + previousRow[index]) & 255;
        }

        return;
    }

    if (filterType === 3) {
        for (let index = 0; index < stride; index += 1) {
            const left = index >= channelCount ? row[index - channelCount] : 0;
            row[index] = (row[index] + ((left + previousRow[index]) >> 1)) & 255;
        }

        return;
    }

    if (filterType === 4) {
        for (let index = 0; index < stride; index += 1) {
            const left = index >= channelCount ? row[index - channelCount] : 0;
            const above = previousRow[index];
            const aboveLeft = index >= channelCount ? previousRow[index - channelCount] : 0;
            row[index] = (row[index] + paethPredictor(left, above, aboveLeft)) & 255;
        }

        return;
    }

    throw new Error(`${filePath} uses unsupported PNG filter type ${filterType}`);
}

function decodePng(filePath: string): DecodedPng {
    const data = readFileSync(filePath);
    assertPngSignature(data, filePath);

    let position = 8;
    let header: PngHeader | undefined;
    const idatChunks: Buffer[] = [];

    while (position < data.length) {
        const length = data.readUInt32BE(position);
        const chunkType = data.toString('ascii', position + 4, position + 8);
        const body = data.subarray(position + 8, position + 8 + length);

        if (chunkType === 'IHDR') {
            header = parsePngHeader(body, filePath);
        } else if (chunkType === 'IDAT') {
            idatChunks.push(Buffer.from(body));
        }

        position += 12 + length;
    }

    if (header === undefined) {
        throw new Error(`${filePath} is missing an IHDR chunk`);
    }

    const channelCount = getChannelCountForColorType(header.colorType, filePath);
    const raw = inflateSync(Buffer.concat(idatChunks));
    const stride = header.width * channelCount;
    const rows: Uint8Array[] = [];
    let previousRow = new Uint8Array(stride);
    let offset = 0;

    for (let rowIndex = 0; rowIndex < header.height; rowIndex += 1) {
        const filterType = raw[offset];
        offset += 1;
        const row = Uint8Array.from(raw.subarray(offset, offset + stride));
        offset += stride;
        unfilterRow(row, previousRow, filterType, channelCount, filePath);
        rows.push(row);
        previousRow = row;
    }

    return { channelCount, colorType: header.colorType, height: header.height, rows, width: header.width };
}

function rotateClockwise(image: DecodedPng): DecodedPng {
    const { channelCount, colorType, height, rows, width } = image;
    const rotatedRows: Uint8Array[] = [];

    for (let x = 0; x < width; x += 1) {
        const rotatedRow = new Uint8Array(height * channelCount);
        let outputIndex = 0;

        for (let y = height - 1; y >= 0; y -= 1) {
            const sourceRow = rows[y];
            const sourceOffset = x * channelCount;
            rotatedRow.set(sourceRow.subarray(sourceOffset, sourceOffset + channelCount), outputIndex * channelCount);
            outputIndex += 1;
        }

        rotatedRows.push(rotatedRow);
    }

    return { channelCount, colorType, height: width, rows: rotatedRows, width: height };
}

function encodeChunk(chunkType: string, body: Buffer): Buffer {
    const lengthField = Buffer.alloc(4);
    lengthField.writeUInt32BE(body.length, 0);
    const typeAndBody = Buffer.concat([Buffer.from(chunkType, 'ascii'), body]);
    const crcField = Buffer.alloc(4);
    crcField.writeUInt32BE(crc32(typeAndBody), 0);

    return Buffer.concat([lengthField, typeAndBody, crcField]);
}

function encodePng(image: DecodedPng): Buffer {
    const { channelCount, colorType, height, rows, width } = image;
    const stride = width * channelCount;
    const rawBody = Buffer.alloc(height * (stride + 1));

    for (let rowIndex = 0; rowIndex < height; rowIndex += 1) {
        const rowStart = rowIndex * (stride + 1);
        rawBody[rowStart] = 0;
        Buffer.from(rows[rowIndex]).copy(rawBody, rowStart + 1);
    }

    const ihdrBody = Buffer.alloc(13);
    ihdrBody.writeUInt32BE(width, 0);
    ihdrBody.writeUInt32BE(height, 4);
    ihdrBody.writeUInt8(8, 8);
    ihdrBody.writeUInt8(colorType, 9);
    ihdrBody.writeUInt8(0, 10);
    ihdrBody.writeUInt8(0, 11);
    ihdrBody.writeUInt8(0, 12);
    const idatBody = deflateSync(rawBody, { level: 6 });

    return Buffer.concat([
        Buffer.from(PngSignature),
        encodeChunk('IHDR', ihdrBody),
        encodeChunk('IDAT', idatBody),
        encodeChunk('IEND', Buffer.alloc(0))
    ]);
}

export function bakeLandscapeScreenshot(filePath: string): void {
    const image = decodePng(filePath);

    if (image.width >= image.height) {
        return;
    }

    const rotatedImage = rotateClockwise(image);
    writeFileSync(filePath, encodePng(rotatedImage));
}
