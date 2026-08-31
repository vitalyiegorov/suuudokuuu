import { Trans } from '@lingui/react/macro';
import { DisplayMaxFontSizeMultiplierConstant, MaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeAcceptScreenSelectors } from '../challenge-accept-screen/challenge-accept-screen.selectors';

import { ChallengeAcceptTimeBlockStyles as styles } from './challenge-accept-time-block.styles';

interface Props {
    readonly opponentTotalTimeText: string;
}

export const ChallengeAcceptTimeBlock = ({ opponentTotalTimeText }: Props) => {
    const { theme } = use(ThemeContext);

    const timeLabelStyle = [styles.timeLabel, { color: theme.colors.text.hint }];
    const timeValueStyle = [styles.timeValue, { color: theme.colors.text.primary }];
    const beatTextStyle = [styles.beatText, { color: theme.colors.text.primary }];

    return (
        <View style={styles.timeBlock}>
            <Text maxFontSizeMultiplier={MaxFontSizeMultiplierConstant} style={timeLabelStyle}>
                <Trans>Their time to beat</Trans>
            </Text>
            <Text
                maxFontSizeMultiplier={DisplayMaxFontSizeMultiplierConstant}
                style={timeValueStyle}
                testID={ChallengeAcceptScreenSelectors.OpponentTime}
            >
                {opponentTotalTimeText}
            </Text>
            <Text maxFontSizeMultiplier={MaxFontSizeMultiplierConstant} style={beatTextStyle}>
                <Trans>Can you beat them?</Trans>
            </Text>
        </View>
    );
};
