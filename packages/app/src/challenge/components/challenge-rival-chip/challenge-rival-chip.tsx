import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeRivalChipStyles as styles } from './challenge-rival-chip.styles';

const RivalInitial = 'R';

interface Props {
    readonly chipText: string;
}

export const ChallengeRivalChip = ({ chipText }: Props) => {
    const { theme } = use(ThemeContext);
    const chipStyle = [styles.chip, { backgroundColor: theme.colors.ink }];
    const chipAvatarStyle = [styles.chipAvatar, { backgroundColor: theme.colors.overlayDark }];
    const chipAvatarTextStyle = [styles.chipAvatarText, { color: theme.colors.inkText }];
    const chipTextStyle = [styles.chipText, { color: theme.colors.inkText }];

    return (
        <View style={chipStyle}>
            <View style={chipAvatarStyle}>
                <Text maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={chipAvatarTextStyle}>
                    {RivalInitial}
                </Text>
            </View>
            <Text maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} numberOfLines={1} style={chipTextStyle}>
                {chipText}
            </Text>
        </View>
    );
};
