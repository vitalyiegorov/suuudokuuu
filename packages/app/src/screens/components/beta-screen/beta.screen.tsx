import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { View } from 'react-native';

import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';

import { BetaScreenSelectors } from './beta-screen.selectors';
import { BetaScreenStyles as styles } from './beta-screen.styles';
import { BetaInstallActions } from './components/beta-install-actions/beta-install-actions';
import { BetaPlatformInstructions } from './components/beta-platform-instructions/beta-platform-instructions';
import { BetaReleaseDetails } from './components/beta-release-details/beta-release-details';
import { BetaStatus } from './components/beta-status/beta-status';
import { useBetaRelease } from './hooks/use-beta-release.hook';

export const BetaScreen = () => {
    const { t } = useLingui();
    const { retry, state } = useBetaRelease();

    return (
        <CollapsibleChromePage
            contentContainerStyle={resolveUnistyleForAnimated(styles.scrollContent)}
            contentStyle={styles.content}
            style={resolveUnistyleForAnimated(styles.scrollView)}
            testID={BetaScreenSelectors.Root}
            title={t`Development builds`}
        >
            {state.status === 'loading' && <BetaStatus onRetry={retry} state={state} />}
            {state.status === 'empty' && <BetaStatus onRetry={retry} state={state} />}
            {state.status === 'error' && <BetaStatus onRetry={retry} state={state} />}
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
