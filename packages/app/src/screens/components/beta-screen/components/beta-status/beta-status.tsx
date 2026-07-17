import { Trans, useLingui } from '@lingui/react/macro';
import { LucideRefreshCw } from 'lucide-react-native';
import { use } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { AppLinkButton } from '../../../../../@generic/components/app-link-button/app-link-button';
import { ThemeContext } from '../../../../../theme/context/theme.context';
import { BetaScreenSelectors } from '../../beta-screen.selectors';

import { BetaStatusStyles as styles } from './beta-status.styles';

import type { BetaReleaseStatusState } from '../../types/beta-release-state.type';

interface Props {
    readonly onRetry: () => void;
    readonly state: BetaReleaseStatusState;
}

export const BetaStatus = ({ onRetry, state }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const textStyle = { color: theme.colors.label.main };
    const hintStyle = { color: theme.colors.label.hint };
    const messageStyle = [styles.message, textStyle];
    const hintMessageStyle = [styles.message, hintStyle];
    const titleStyle = [styles.title, textStyle];

    if (state.status === 'loading') {
        return (
            <View accessibilityLiveRegion="polite" style={styles.container}>
                <ActivityIndicator
                    accessibilityLabel={t`Loading development build`}
                    accessibilityRole="progressbar"
                    color={theme.colors.blue}
                    size="large"
                />
                <Text selectable style={messageStyle}>
                    <Trans>Loading the latest development build…</Trans>
                </Text>
            </View>
        );
    }

    if (state.status === 'empty') {
        return (
            <View accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.container}>
                <Text selectable style={titleStyle}>
                    <Trans>No development build is available</Trans>
                </Text>
                <Text selectable style={hintMessageStyle}>
                    <Trans>No complete development build has been published yet. Please check again later.</Trans>
                </Text>
            </View>
        );
    }

    return (
        <View accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.container}>
            <Text selectable style={titleStyle}>
                <Trans>Development build unavailable</Trans>
            </Text>
            <Text selectable style={hintMessageStyle}>
                <Trans>We could not load the latest development build. Please try again.</Trans>
            </Text>
            <AppLinkButton
                accessibilityHint={t`Attempts to load the latest development build again`}
                accessibilityLabel={t`Retry loading development build`}
                icon={LucideRefreshCw}
                onPress={onRetry}
                style={styles.retryButton}
                testID={BetaScreenSelectors.RetryButton}
                text={t`Try again`}
            />
        </View>
    );
};
