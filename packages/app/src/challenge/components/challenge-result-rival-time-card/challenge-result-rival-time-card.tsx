import { useLingui } from '@lingui/react/macro';
import { DisplayMaxFontSizeMultiplierConstant, MaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeResultRivalTimeCardStyles as styles } from './challenge-result-rival-time-card.styles';

interface Props {
    readonly rivalTimeText: string;
}

export const ChallengeResultRivalTimeCard = ({ rivalTimeText }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const labelStyle = [styles.label, { color: theme.colors.text.hint }];
    const valueStyle = [styles.value, { color: theme.colors.text.primary }];

    return (
        <View style={styles.card}>
            <Text maxFontSizeMultiplier={MaxFontSizeMultiplierConstant} style={labelStyle}>
                {t`Rival's time to beat`}
            </Text>
            <Text maxFontSizeMultiplier={DisplayMaxFontSizeMultiplierConstant} style={valueStyle}>
                {rivalTimeText}
            </Text>
        </View>
    );
};
