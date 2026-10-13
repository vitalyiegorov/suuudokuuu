import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { View } from 'react-native';

import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';

import { BetaScreenSelectors } from './beta-screen.selectors';
import { BetaScreenStyles as styles } from './beta-screen.styles';
import { BetaEmptyStatus } from './components/beta-empty-status/beta-empty-status';
import { BetaErrorStatus } from './components/beta-error-status/beta-error-status';
import { BetaInstallActions } from './components/beta-install-actions/beta-install-actions';
import { BetaLoadingStatus } from './components/beta-loading-status/beta-loading-status';
import { BetaPlatformInstructions } from './components/beta-platform-instructions/beta-platform-instructions';
import { BetaReleaseDetails } from './components/beta-release-details/beta-release-details';
import { useBetaRelease } from './hooks/use-beta-release.hook';

export const BetaScreen = () => {
    const { t } = useLingui();
    const { retry, state } = useBetaRelease();

    return (
        <CollapsibleChromePage
            contentContainerStyle={resolveUnistyleForAnimated(styles.scrollContent)}
            style={resolveUnistyleForAnimated(styles.scrollView)}
            testID={BetaScreenSelectors.Root}
            title={t`Development builds`}
        >
            {state.status === 'loading' && <BetaLoadingStatus />}
            {state.status === 'empty' && <BetaEmptyStatus />}
            {state.status === 'error' && <BetaErrorStatus onRetry={retry} />}
            {state.status === 'ready' && (
                <View accessibilityLiveRegion="polite" style={styles.readyContent}>
                    <BetaReleaseDetails release={state.release} />
                    <BetaInstallActions />
                    <BetaPlatformInstructions />
                </View>
            )}
        </CollapsibleChromePage>
    );
};
