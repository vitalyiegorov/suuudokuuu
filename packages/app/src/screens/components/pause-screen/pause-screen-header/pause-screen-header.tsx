import { Trans } from '@lingui/react/macro';
import { LucidePause } from 'lucide-react-native';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../../theme/context/theme.context';

import { PauseScreenHeaderStyles as styles } from './pause-screen-header.styles';

const MEDALLION_ICON_SIZE = 34;

interface Props {
    readonly detailsText: string;
}

export const PauseScreenHeader = ({ detailsText }: Props) => {
    const { theme } = use(ThemeContext);

    const medallionStyles = [styles.medallion, { backgroundColor: theme.colors.black }];
    const titleStyles = [styles.title, { color: theme.colors.label.main }];
    const chipStyles = [styles.chip, { backgroundColor: theme.colors.black }];
    const chipTextStyles = [styles.chipText, { color: theme.colors.label.inverted }];

    return (
        <View style={styles.header}>
            <View style={medallionStyles}>
                <LucidePause color={theme.colors.label.inverted} size={MEDALLION_ICON_SIZE} strokeWidth={2.6} />
            </View>

            <BlackText allowFontScaling={false} style={titleStyles}>
                <Trans>Paused</Trans>
            </BlackText>

            <View style={chipStyles}>
                <BlackText allowFontScaling={false} numberOfLines={1} style={chipTextStyles}>
                    {detailsText}
                </BlackText>
            </View>
        </View>
    );
};
