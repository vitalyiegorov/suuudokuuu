import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { landingOutDirectory, webAppDistDirectory } from './src/constants/served-build-directories.constant';

export default function globalSetup() {
    const webAppDistEntryPoint = join(webAppDistDirectory, 'index.html');
    const landingOutEntryPoint = join(landingOutDirectory, 'index.html');

    if (!existsSync(webAppDistEntryPoint)) {
        throw new Error(
            `Missing ${webAppDistEntryPoint}. Run "yarn workspace @suuudokuuu/app export:web" (or "yarn expo export --platform=web" inside packages/app) before running the web E2E suite.`
        );
    }

    if (!existsSync(landingOutEntryPoint)) {
        throw new Error(`Missing ${landingOutEntryPoint}. Run "yarn build --filter=@suuudokuuu/landing" before running the web E2E suite.`);
    }
}
