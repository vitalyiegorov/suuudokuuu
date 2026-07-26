import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

const source = readFileSync(join(__dirname, 'app-root.store.ts'), 'utf8');
const migrationsStartIndex = source.indexOf('const migrations');
const migrationsEndIndex = source.indexOf('const rootReducer');
const migrationsSource = source.slice(migrationsStartIndex, migrationsEndIndex);
const migrationVersions = Array.from(migrationsSource.matchAll(/^ {4}(\d+): /gmu)).map(match => Number(match[1]));
const persistedVersion = Number(/version: (\d+)/u.exec(source)?.[1]);

describe('appRootStore persistence', () => {
    it('persists at the newest migration version', () => {
        expect(persistedVersion).toBe(Math.max(...migrationVersions));
    });

    it('keeps the migration manifest free of version gaps', () => {
        const sortedVersions = [...migrationVersions].sort((first, second) => first - second);
        const expectedVersions = sortedVersions.map((_, index) => sortedVersions[0] + index);

        expect(sortedVersions).toEqual(expectedVersions);
    });
});
