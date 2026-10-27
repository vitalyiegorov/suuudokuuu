import { existsSync, readFileSync, writeFileSync } from 'node:fs';

export const FIXTURE_DIRECTORY = new URL('../../test/fixtures/', import.meta.url);

const MANIFEST_FILE = new URL('manifest.txt', FIXTURE_DIRECTORY);
const MAXIMUM_FIXTURE_BYTES = 150_000;

export const readFixtureManifest = (): Map<string, string> =>
    new Map(
        (existsSync(MANIFEST_FILE) ? readFileSync(MANIFEST_FILE, 'utf8').split('\n') : []).filter(Boolean).map(line => {
            const [file, expected] = line.split(' ');

            return [file, expected];
        })
    );

export const writeFixture = (file: string, image: Buffer, expected: string): void => {
    if (image.length > MAXIMUM_FIXTURE_BYTES) {
        throw new Error(`${file} is ${image.length} bytes, over the ${MAXIMUM_FIXTURE_BYTES} byte fixture budget`);
    }

    const manifest = readFixtureManifest().set(file, expected);

    writeFileSync(new URL(file, FIXTURE_DIRECTORY), image);
    writeFileSync(
        MANIFEST_FILE,
        `${[...manifest.entries()]
            .sort(([first], [second]) => (first < second ? -1 : 1))
            .map(([name, value]) => `${name} ${value}`)
            .join('\n')}\n`
    );
};
