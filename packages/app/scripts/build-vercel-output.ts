import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from 'esbuild';
import { z } from 'zod';

const requireFromScript = createRequire(import.meta.url);
const sharedUtilities: { getErrorMessage: (error: unknown) => string } = requireFromScript('@rnw-community/shared');
const { getErrorMessage } = sharedUtilities;

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appDirectory = dirname(scriptDirectory);
const webExportDirectory = join(appDirectory, 'dist');
const webExportEntryFile = join(webExportDirectory, 'index.html');
const vercelConfigFile = join(appDirectory, 'vercel.json');
const buildOutputDirectory = join(appDirectory, '.vercel', 'output');
const staticOutputDirectory = join(buildOutputDirectory, 'static');
const functionsOutputDirectory = join(buildOutputDirectory, 'functions', 'api', 'beta');

const buildOutputApiVersion = 3;
const jsonIndentation = 4;

const betaEndpointNames = ['release', 'ipa', 'apk', 'manifest'];

const functionConfiguration = {
    handler: 'index.mjs',
    launcherType: 'Nodejs',
    runtime: 'nodejs22.x'
};

const vercelConfigSchema = z.object({ routes: z.array(z.record(z.string(), z.unknown())) });

const writeJsonFile = (filePath: string, value: unknown) => {
    writeFileSync(filePath, `${JSON.stringify(value, null, jsonIndentation)}\n`);
};

const readVercelRoutes = () => {
    const vercelConfigContents: unknown = JSON.parse(readFileSync(vercelConfigFile, 'utf8'));

    return vercelConfigSchema.parse(vercelConfigContents).routes;
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
    if (!existsSync(webExportEntryFile)) {
        throw new Error(`Missing Expo web export, run "yarn export:web" first: ${webExportEntryFile}`);
    }

    const routes = readVercelRoutes();

    rmSync(buildOutputDirectory, { force: true, recursive: true });
    mkdirSync(functionsOutputDirectory, { recursive: true });
    cpSync(webExportDirectory, staticOutputDirectory, { recursive: true });

    await Promise.all(betaEndpointNames.map(buildBetaFunction));

    writeJsonFile(join(buildOutputDirectory, 'config.json'), { routes, version: buildOutputApiVersion });

    console.info(`Vercel build output is ready: ${buildOutputDirectory}`);
}

main().catch((error: unknown) => {
    console.error(getErrorMessage(error));
    process.exitCode = 1;
});
