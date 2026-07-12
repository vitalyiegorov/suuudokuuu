import { Trans } from '@lingui/react/macro';
import { LucidePause } from 'lucide-react-native';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../../theme/context/theme.context';

import { PauseScreenHeaderStyles as styles } from './pause-screen-header.styles';

interface Props {
    readonly detailsText: string;
}

export const PauseScreenHeader = ({ detailsText }: Props) => {
    const { theme } = use(ThemeContext);
    const titleStyles = [styles.title, { color: theme.colors.label.main }];
    const detailsStyles = [styles.details, { color: theme.colors.label.hint }];
    const titleIconColor = theme.colors.label.main;

    return (
        <View style={styles.header}>
            <View style={styles.titleRow}>
                <LucidePause color={titleIconColor} size={22} strokeWidth={3.5} />

                <BlackText adjustsFontSizeToFit minimumFontScale={0.72} numberOfLines={1} style={titleStyles}>
                    <Trans>Paused</Trans>
                </BlackText>
            </View>

            <BlackText adjustsFontSizeToFit minimumFontScale={0.7} numberOfLines={1} style={detailsStyles}>
                {detailsText}
            </BlackText>
        </View>
    );
};
