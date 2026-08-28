import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

const requireFromScript = createRequire(import.meta.url);
const sharedUtilities: {
    getErrorMessage: (error: unknown) => string;
} = requireFromScript('@rnw-community/shared');
const { getErrorMessage } = sharedUtilities;

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appDirectory = dirname(scriptDirectory);
const easConfigurationFile = join(appDirectory, 'eas.json');

const jsonIndentation = 4;
const localAppVersionSource = 'local';
const developmentBuildNumberPattern = /^[1-9]\d{0,3}\.[1-9]\d?$/u;

const easConfigurationSchema = z
    .object({ cli: z.object({ version: z.string(), appVersionSource: z.string() }).catchall(z.unknown()) })
    .catchall(z.unknown());

const expoConfigurationSchema = z
    .object({ ios: z.optional(z.object({ buildNumber: z.optional(z.string()) }).catchall(z.unknown())) })
    .catchall(z.unknown());

const readDevelopmentBuildNumber = (): string => {
    const buildNumber = process.env['DEVELOPMENT_BUILD_NUMBER'];

    if (buildNumber === undefined || !developmentBuildNumberPattern.test(buildNumber)) {
        throw new Error('DEVELOPMENT_BUILD_NUMBER must contain a 1-9999 run number and a 1-99 run attempt.');
    }

    return buildNumber;
};

const readEasConfiguration = () => {
    const easConfigurationContents: unknown = JSON.parse(readFileSync(easConfigurationFile, 'utf8'));

    return easConfigurationSchema.parse(easConfigurationContents);
};

const useLocalAppVersionSource = (): void => {
    const easConfiguration = readEasConfiguration();

    easConfiguration.cli.appVersionSource = localAppVersionSource;
    writeFileSync(easConfigurationFile, `${JSON.stringify(easConfiguration, null, jsonIndentation)}\n`);
};

const readResolvedExpoConfiguration = () => {
    const output = execFileSync('yarn', ['expo', 'config', '--type', 'public', '--json'], { cwd: appDirectory, encoding: 'utf8' });
    const documentStartIndex = output.indexOf('{');
    const documentEndIndex = output.lastIndexOf('}');

    if (documentStartIndex === -1 || documentEndIndex < documentStartIndex) {
        throw new Error(`"expo config --type public --json" printed no JSON document:\n${output}`);
    }

    const expoConfigurationContents: unknown = JSON.parse(output.slice(documentStartIndex, documentEndIndex + 1));

    return expoConfigurationSchema.parse(expoConfigurationContents);
};

function main(): void {
    const buildNumber = readDevelopmentBuildNumber();

    useLocalAppVersionSource();

    const resolvedBuildNumber = readResolvedExpoConfiguration().ios?.buildNumber;

    if (resolvedBuildNumber !== buildNumber) {
        throw new Error(`Expo resolves ios.buildNumber to "${resolvedBuildNumber ?? '(unset)'}", expected "${buildNumber}".`);
    }

    if (readEasConfiguration().cli.appVersionSource !== localAppVersionSource) {
        throw new Error('The ephemeral iOS development build must use the local app version source.');
    }

    console.info(`iOS development build preflight passed: eas.json is local and ios.buildNumber is ${buildNumber}.`);
}

try {
    main();
} catch (error: unknown) {
    console.error(getErrorMessage(error));
    process.exitCode = 1;
}
