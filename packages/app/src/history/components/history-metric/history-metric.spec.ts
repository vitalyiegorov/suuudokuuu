import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

const sourceRoot = join(__dirname, '..', '..', '..');
const stripComponentName = 'AppMetricStrip';
const metricComponentNames = ['HistoryMetric', 'AppMetricStripItem'];

const collectSourceFiles = (directory: string): string[] =>
    readdirSync(directory).flatMap(entry => {
        const entryPath = join(directory, entry);

        if (statSync(entryPath).isDirectory()) {
            return collectSourceFiles(entryPath);
        }

        return entryPath.endsWith('.tsx') ? [entryPath] : [];
    });

const rendersMetricItem = (source: string) => metricComponentNames.some(componentName => source.includes(`<${componentName}`));

describe('metric strip items', () => {
    it('are only rendered inside an AppMetricStrip, which owns the context they read their colour from', () => {
        const offenders = collectSourceFiles(sourceRoot)
            .filter(filePath => rendersMetricItem(readFileSync(filePath, 'utf8')))
            .filter(filePath => !readFileSync(filePath, 'utf8').includes(`<${stripComponentName}`))
            .map(filePath => filePath.slice(sourceRoot.length + 1));

        expect(offenders).toEqual([]);
    });
});
