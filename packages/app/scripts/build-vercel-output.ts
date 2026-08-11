import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from 'esbuild';
import { z } from 'zod';

const requireFromScript = createRequire(import.meta.url);
const sharedUtilities: {
    getErrorMessage: (error: unknown) => string;
    isNotEmptyArray: (value: unknown[]) => boolean;
    isString: (value: unknown) => value is string;
} = requireFromScript('@rnw-community/shared');
const { getErrorMessage, isNotEmptyArray, isString } = sharedUtilities;

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appDirectory = dirname(scriptDirectory);
const packagesDirectory = dirname(appDirectory);
const webExportDirectory = join(appDirectory, 'dist');
const webExportEntryFile = join(webExportDirectory, 'index.html');
const landingExportDirectory = join(packagesDirectory, 'landing', 'out');
const landingExportEntryFile = join(landingExportDirectory, 'index.html');
const vercelConfigFile = join(appDirectory, 'vercel.json');
const buildOutputDirectory = join(appDirectory, '.vercel', 'output');
const staticOutputDirectory = join(buildOutputDirectory, 'static');
const functionsOutputDirectory = join(buildOutputDirectory, 'functions', 'api', 'beta');

const buildOutputApiVersion = 3;
const jsonIndentation = 4;

const appShellDirectoryName = '_app';
const htmlExtension = '.html';
const htmlDocumentContentType = 'text/html; charset=utf-8';
const indexDocumentName = `index${htmlExtension}`;
const notFoundDocumentName = `404${htmlExtension}`;

const appShellOutputDirectory = join(staticOutputDirectory, appShellDirectoryName);
const appShellOutputFile = join(appShellOutputDirectory, indexDocumentName);

const betaEndpointNames = ['release', 'ipa', 'apk', 'manifest'];

const functionConfiguration = {
    handler: 'index.mjs',
    launcherType: 'Nodejs',
    runtime: 'nodejs22.x'
};

const vercelConfigSchema = z.object({ routes: z.array(z.object({ dest: z.optional(z.string()) }).catchall(z.unknown())) });

const writeJsonFile = (filePath: string, value: unknown) => {
    writeFileSync(filePath, `${JSON.stringify(value, null, jsonIndentation)}\n`);
};

const readVercelRoutes = () => {
    const vercelConfigContents: unknown = JSON.parse(readFileSync(vercelConfigFile, 'utf8'));

    return vercelConfigSchema.parse(vercelConfigContents).routes;
};

const assertExportExists = (entryFile: string, exportName: string, buildCommand: string) => {
    if (!existsSync(entryFile)) {
        throw new Error(`Missing ${exportName}, run "${buildCommand}" first: ${entryFile}`);
    }
};

const collectRelativeFilePaths = (directory: string, relativeDirectory: string): string[] =>
    readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const entryRelativePath = relativeDirectory === '' ? entry.name : `${relativeDirectory}/${entry.name}`;

        return entry.isDirectory() ? collectRelativeFilePaths(join(directory, entry.name), entryRelativePath) : [entryRelativePath];
    });

const createLandingCleanUrlOverrides = (landingRelativePaths: string[]) => {
    const overridablePaths = landingRelativePaths.filter(
        relativePath =>
            relativePath.endsWith(htmlExtension) && basename(relativePath) !== indexDocumentName && relativePath !== notFoundDocumentName
    );

    return Object.fromEntries(
        overridablePaths.map(relativePath => [
            relativePath,
            { contentType: htmlDocumentContentType, path: relativePath.slice(0, -htmlExtension.length) }
        ])
    );
};

const warnAboutClobberedWebExportFiles = (webExportRelativePaths: string[], landingRelativePaths: string[]) => {
    const clobberedPaths = webExportRelativePaths.filter(
        relativePath => relativePath !== indexDocumentName && landingRelativePaths.includes(relativePath)
    );

    if (isNotEmptyArray(clobberedPaths)) {
        console.warn(`Landing files take precedence over the web export for: ${clobberedPaths.join(', ')}`);
    }
};

const assertStaticDestinationsExist = (routes: { dest?: string }[]) => {
    const htmlDestinations = routes.flatMap(route => (isString(route.dest) && route.dest.endsWith(htmlExtension) ? [route.dest] : []));
    const missingDestinations = htmlDestinations.filter(destination => !existsSync(join(staticOutputDirectory, destination)));

    if (isNotEmptyArray(missingDestinations)) {
        throw new Error(`Vercel routes point to missing static files: ${missingDestinations.join(', ')}`);
    }
};

const composeStaticOutput = () => {
    rmSync(buildOutputDirectory, { force: true, recursive: true });
    mkdirSync(functionsOutputDirectory, { recursive: true });
    cpSync(webExportDirectory, staticOutputDirectory, { filter: source => source !== webExportEntryFile, recursive: true });
    mkdirSync(appShellOutputDirectory, { recursive: true });
    copyFileSync(webExportEntryFile, appShellOutputFile);
    cpSync(landingExportDirectory, staticOutputDirectory, { recursive: true });
};

const createEndpointEntryContents = (endpointName: string) =>
    [
        `import endpoint from './vercel-functions/api/beta/${endpointName}.ts';`,
        `import { createNodeHandler } from './vercel-functions/shared/create-node-handler.util.ts';`,
        ``,
        `export default createNodeHandler(endpoint);`,
        ``
    ].join('\n');

const buildBetaFunction = async (endpointName: string) => {
    const functionDirectory = join(functionsOutputDirectory, `${endpointName}.func`);

    await build({
        bundle: true,
        format: 'esm',
        logLevel: 'warning',
        outfile: join(functionDirectory, 'index.mjs'),
        platform: 'node',
        sourcemap: false,
        stdin: {
            contents: createEndpointEntryContents(endpointName),
            loader: 'ts',
            resolveDir: appDirectory,
            sourcefile: `${endpointName}.entry.ts`
        },
        target: 'node22'
    });

    writeJsonFile(join(functionDirectory, '.vc-config.json'), functionConfiguration);
};

async function main(): Promise<void> {
    assertExportExists(webExportEntryFile, 'Expo web export', 'yarn export:web');
    assertExportExists(landingExportEntryFile, 'landing export', 'yarn workspace @suuudokuuu/landing build');

    const routes = readVercelRoutes();
    const webExportRelativePaths = collectRelativeFilePaths(webExportDirectory, '');
    const landingRelativePaths = collectRelativeFilePaths(landingExportDirectory, '');

    warnAboutClobberedWebExportFiles(webExportRelativePaths, landingRelativePaths);

    composeStaticOutput();

    await Promise.all(betaEndpointNames.map(buildBetaFunction));

    assertStaticDestinationsExist(routes);

    writeJsonFile(join(buildOutputDirectory, 'config.json'), {
        overrides: createLandingCleanUrlOverrides(landingRelativePaths),
        routes,
        version: buildOutputApiVersion
    });

    console.info(`Vercel build output is ready: ${buildOutputDirectory}`);
}

main().catch((error: unknown) => {
    console.error(getErrorMessage(error));
    process.exitCode = 1;
});
