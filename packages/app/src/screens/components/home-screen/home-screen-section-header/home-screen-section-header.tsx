import { Trans } from '@lingui/react/macro';
import { type ReactNode, use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../../theme/context/theme.context';

import { HomeScreenSectionHeaderStyles as styles } from './home-screen-section-header.styles';

interface Props {
    readonly children?: ReactNode;
}

export const HomeScreenSectionHeader = ({ children }: Props) => {
    const { theme } = use(ThemeContext);
    const labelStyles = [styles.label, { color: theme.colors.text.primary }];
    const lineStyles = [styles.line, { backgroundColor: theme.colors.surface.border }];

    return (
        <View style={styles.container}>
            <BlackText style={labelStyles}>
                <Trans>New game</Trans>
            </BlackText>
            <View style={lineStyles} />

            {children}
        </View>
    );
};
