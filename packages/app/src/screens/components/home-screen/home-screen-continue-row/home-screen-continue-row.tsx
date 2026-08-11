import { Trans } from '@lingui/react/macro';
import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { Play } from 'lucide-react-native';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { useResumeGame } from '../../../../game/hooks/use-resume-game.hook';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { HomeScreenSelectors } from '../home-screen.selectors';
import { HomeScreenStyles as styles } from '../home-screen.styles';

const ContinueIconSize = 18;
const ProgressTotalPercent = 100;

interface Props {
    readonly currentElapsedTimeText: string;
    readonly currentProgressPercent: number;
    readonly currentProgressText: string;
}

export const HomeScreenContinueRow = ({ currentElapsedTimeText, currentProgressPercent, currentProgressText }: Props) => {
    const { theme } = use(ThemeContext);
    const handleContinue = useResumeGame();

    const continueRowStyles = [styles.continueRow, { backgroundColor: theme.colors.surface.subtle }];
    const continueProgressFillStyles = [
        styles.continueProgressFill,
        { backgroundColor: theme.colors.numpad.track, flex: currentProgressPercent }
    ];
    const continueProgressRemainderStyles = { flex: ProgressTotalPercent - currentProgressPercent };
    const continueIconStyles = [styles.continueIcon, { backgroundColor: theme.colors.ink }];
    const continueTitleStyles = [styles.continueTitle, { color: theme.colors.text.primary }];
    const continueElapsedStyles = [styles.continueElapsed, { color: theme.colors.text.hint }];
    const continueProgressTextStyles = [styles.continueProgressText, { color: theme.colors.text.primary }];

    return (
        <Pressable accessibilityRole="button" onPress={handleContinue} style={continueRowStyles} testID={HomeScreenSelectors.ResumeButton}>
            <View style={styles.continueProgressTrack}>
                <View style={continueProgressFillStyles} />
                <View style={continueProgressRemainderStyles} />
            </View>

            <View style={styles.continueContent}>
                <View style={continueIconStyles}>
                    <Play color={theme.colors.inkText} fill={theme.colors.inkText} size={ContinueIconSize} />
                </View>

                <View style={styles.continueCopy}>
                    <BlackText maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} numberOfLines={1} style={continueTitleStyles}>
                        <Trans>Continue</Trans>
                    </BlackText>
                    <BlackText maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} numberOfLines={1} style={continueElapsedStyles}>
                        {currentElapsedTimeText}
                    </BlackText>
                </View>

                <BlackText
                    maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant}
                    numberOfLines={1}
                    style={continueProgressTextStyles}
                >
                    {currentProgressText}
                </BlackText>
            </View>
        </Pressable>
    );
};
