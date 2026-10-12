import { Trans, useLingui } from '@lingui/react/macro';
import LucideRefreshCw from 'lucide-react-native/icons/refresh-cw';
import { use } from 'react';
import { Text, View } from 'react-native';

import { AppLinkButton } from '../../../../../@generic/components/app-link-button/app-link-button';
import { ThemeContext } from '../../../../../theme/context/theme.context';
import { BetaScreenSelectors } from '../../beta-screen.selectors';
import { BetaStatusStyles as styles } from '../beta-status/beta-status.styles';

interface Props {
    readonly onRetry: () => void;
}

export const BetaErrorStatus = ({ onRetry }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const hintMessageStyle = [styles.message, { color: theme.colors.text.hint }];
    const titleStyle = [styles.title, { color: theme.colors.text.primary }];

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
