import { Trans, useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { ThemeContext } from '../../../../../theme/context/theme.context';
import { BetaStatusStyles as styles } from '../beta-status/beta-status.styles';

export const BetaLoadingStatus = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const messageStyle = [styles.message, { color: theme.colors.text.primary }];

    return (
        <View accessibilityLiveRegion="polite" style={styles.container}>
            <ActivityIndicator
                accessibilityLabel={t`Loading development build`}
                accessibilityRole="progressbar"
                color={theme.colors.accent}
                size="large"
            />
            <Text selectable style={messageStyle}>
                <Trans>Loading the latest development build…</Trans>
            </Text>
        </View>
    );
};
