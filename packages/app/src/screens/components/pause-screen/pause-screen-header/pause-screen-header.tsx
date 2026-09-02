import { Trans } from '@lingui/react/macro';
import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import LucidePause from 'lucide-react-native/icons/pause';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../../theme/context/theme.context';

import { PauseScreenHeaderStyles as styles } from './pause-screen-header.styles';

const MEDALLION_ICON_SIZE = 34;

interface Props {
    readonly detailsText: string;
    readonly testID?: string;
}

export const PauseScreenHeader = ({ detailsText, testID }: Props) => {
    const { theme } = use(ThemeContext);

    const medallionStyles = [styles.medallion, { backgroundColor: theme.colors.ink }];
    const titleStyles = [styles.title, { color: theme.colors.text.primary }];
    const chipStyles = [styles.chip, { backgroundColor: theme.colors.ink }];
    const chipTextStyles = [styles.chipText, { color: theme.colors.inkText }];

    return (
        <View style={styles.header}>
            <View style={medallionStyles}>
                <LucidePause color={theme.colors.inkText} size={MEDALLION_ICON_SIZE} strokeWidth={2.6} />
            </View>

            <BlackText maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={titleStyles}>
                <Trans>Paused</Trans>
            </BlackText>

            <View style={chipStyles}>
                <BlackText
                    maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant}
                    numberOfLines={1}
                    style={chipTextStyles}
                    testID={testID}
                >
                    {detailsText}
                </BlackText>
            </View>
        </View>
    );
};
