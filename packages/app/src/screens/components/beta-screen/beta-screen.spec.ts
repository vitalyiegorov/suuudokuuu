import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

const PlatformCardCount = 2;
const InstallLinkCount = 2;

const readSourceFiles = (directory: string): string =>
    readdirSync(directory, { withFileTypes: true })
        .flatMap(directoryEntry => {
            const entryPath = join(directory, directoryEntry.name);

            if (directoryEntry.isDirectory()) {
                return readSourceFiles(entryPath);
            }

            if (directoryEntry.name.endsWith('.spec.ts')) {
                return '';
            }

            if (!directoryEntry.name.endsWith('.tsx') && !directoryEntry.name.endsWith('.ts')) {
                return '';
            }

            return readFileSync(entryPath, 'utf8');
        })
        .join('\n');

describe('BetaScreen composition', () => {
    const betaSource = readSourceFiles(__dirname);
    const routeSource = readFileSync(join(__dirname, '../../../app/beta.tsx'), 'utf8');
    const installActionsSource = readFileSync(join(__dirname, 'components/beta-install-actions/beta-install-actions.tsx'), 'utf8');
    const platformInstructionsSource = readFileSync(
        join(__dirname, 'components/beta-platform-instructions/beta-platform-instructions.tsx'),
        'utf8'
    );
    const releaseDetailsSource = readFileSync(join(__dirname, 'components/beta-release-details/beta-release-details.tsx'), 'utf8');

    it('keeps the route thin and localized', () => {
        expect(routeSource).toContain('PageHorizontalSafeAreaEdges');
        expect(routeSource).toContain('PageHeader title={t`Development builds`}');
        expect(routeSource).toContain('<BetaScreen />');
        expect(routeSource).not.toContain('fetchBetaRelease');
        expect(routeSource).not.toContain('useBetaRelease');
        expect(routeSource).not.toContain('state.status');
        expect(routeSource).not.toContain('BetaReleaseDetails');
    });

    it('composes loading, empty, error, and ready states from focused components', () => {
        expect(betaSource).toContain("state.status === 'loading'");
        expect(betaSource).toContain("state.status === 'empty'");
        expect(betaSource).toContain("state.status === 'error'");
        expect(betaSource).toContain("state.status === 'ready'");
        expect(betaSource).toContain('BetaReleaseDetails');
        expect(betaSource).toContain('BetaInstallActions');
        expect(betaSource).toContain('BetaPlatformInstructions');
    });

    it('provides accessible status and action semantics', () => {
        expect(betaSource).toContain('accessibilityLiveRegion="polite"');
        expect(betaSource).toContain('accessibilityRole="progressbar"');
        expect(betaSource).toContain('accessibilityHint=');
        expect(betaSource).toContain('AppLinkButton');
        expect(betaSource).toContain('accessibilityLiveRegion="polite" style={styles.readyContent}');
        expect(installActionsSource.match(/accessibilityRole="link"/gu) ?? []).toHaveLength(InstallLinkCount);
        expect(releaseDetailsSource).toContain('accessibilityRole="link"');
    });

    it('aborts stale requests and maps unexpected rejections to the generic error state', () => {
        expect(betaSource).toContain('const abortController = new AbortController()');
        expect(betaSource).toContain('abortController.abort()');
        expect(betaSource).toContain('const handleError = () =>');
        expect(betaSource).toContain("setState({ status: 'error' })");
    });

    it('uses fixed install destinations and Linking for the APK action', () => {
        expect(betaSource).toContain(
            'itms-services://?action=download-manifest&url=https%3A%2F%2Fwww.suuudokuuu.com%2Fota%2Fmanifest.plist'
        );
        expect(betaSource).toContain('https://www.suuudokuuu.com/api/beta/apk');
        expect(betaSource).toContain('Linking.openURL');
        expect(betaSource).not.toContain('href={BetaAndroidInstallUrl}');
    });

    it('renders notes as text and keeps checksums selectable', () => {
        expect(betaSource).toContain('selectable');
        expect(betaSource).toContain('AppSurfaceCard');
        expect(betaSource).not.toContain('dangerouslySetInnerHTML');
        expect(betaSource).not.toContain('Markdown');
    });

    it('shows separate platform cards and exact development client launch guidance', () => {
        expect(platformInstructionsSource.match(/<AppSurfaceCard/gu)).toHaveLength(PlatformCardCount);
        expect(platformInstructionsSource).toContain('EXPO_DEV_CLIENT_DEFAULT_LAUNCH_URL');
        expect(platformInstructionsSource).toContain('<Trans>development</Trans>');
        expect(platformInstructionsSource).toContain('Metro');
        expect(platformInstructionsSource).toContain('does not publish an update');
    });
});
