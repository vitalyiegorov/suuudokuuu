import { Trans } from '@lingui/react/macro';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../../../theme/context/theme.context';
import { BetaStatusStyles as styles } from '../beta-status/beta-status.styles';

export const BetaEmptyStatus = () => {
    const { theme } = use(ThemeContext);
    const hintMessageStyle = [styles.message, { color: theme.colors.text.hint }];
    const titleStyle = [styles.title, { color: theme.colors.text.primary }];

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
};
