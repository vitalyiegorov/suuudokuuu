import { Trans } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../../theme/context/theme.context';

import { HomeScreenSectionHeaderStyles as styles } from './home-screen-section-header.styles';

export const HomeScreenSectionHeader = () => {
    const { theme } = use(ThemeContext);
    const labelStyles = [styles.label, { color: theme.colors.label.main }];
    const lineStyles = [styles.line, { backgroundColor: theme.colors.candidate.border }];

    return (
        <View style={styles.container}>
            <BlackText style={labelStyles}>
                <Trans>New game</Trans>
            </BlackText>
            <View style={lineStyles} />
        </View>
    );
};
