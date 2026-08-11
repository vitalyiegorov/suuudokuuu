import { Trans } from '@lingui/react/macro';
import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { Play } from 'lucide-react-native';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { useResumeGame } from '../../../../game/hooks/use-resume-game.hook';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { HomeScreenStartButton } from '../home-screen-start-button/home-screen-start-button';
import { HomeScreenSelectors } from '../home-screen.selectors';
import { HomeScreenStyles as styles } from '../home-screen.styles';

interface Props {
    readonly currentElapsedTimeText: string;
    readonly currentProgressPercent: number;
    readonly currentProgressText: string;
    readonly isGameStarted: boolean;
    readonly isHellSelected: boolean;
    readonly isLoading: boolean;
    readonly onStart: () => void;
    readonly startButtonSubtitle: string;
    readonly startButtonText: string;
}

export const HomeScreenPlayActions = ({
    currentElapsedTimeText,
    currentProgressPercent,
    currentProgressText,
    isGameStarted,
    isHellSelected,
    isLoading,
    onStart,
    startButtonSubtitle,
    startButtonText
}: Props) => {
    const { theme } = use(ThemeContext);
    const handleContinue = useResumeGame();
    const startButtonTextColor = isHellSelected ? theme.colors.dangerText : theme.colors.inkText;
    const startButtonTitleStyles = [styles.startButtonTitle, { color: startButtonTextColor }];
    const startButtonSubtitleStyles = [styles.startButtonSubtitle, { color: startButtonTextColor }];
    const continueRowStyles = [styles.continueRow, { backgroundColor: theme.colors.surface.subtle }];
    const continueProgressFillStyles = [
        styles.continueProgressFill,
        { backgroundColor: theme.colors.numpad.track, flex: currentProgressPercent }
    ];
    const continueProgressRemainderStyles = { flex: 100 - currentProgressPercent };
    const continueIconStyles = [styles.continueIcon, { backgroundColor: theme.colors.ink }];
    const continueTitleStyles = [styles.continueTitle, { color: theme.colors.text.primary }];
    const continueElapsedStyles = [styles.continueElapsed, { color: theme.colors.text.hint }];
    const continueProgressTextStyles = [styles.continueProgressText, { color: theme.colors.text.primary }];

    return (
        <View style={styles.playActions}>
            <HomeScreenStartButton
                isHellSelected={isHellSelected}
                isLoading={isLoading}
                onPress={onStart}
                style={styles.primaryButton}
                testID={HomeScreenSelectors.StartButton}
            >
                <View style={styles.startButtonContent}>
                    <BlackText style={startButtonTitleStyles}>{startButtonText}</BlackText>
                    <BlackText style={startButtonSubtitleStyles}>{startButtonSubtitle}</BlackText>
                </View>
            </HomeScreenStartButton>

            {isGameStarted ? (
                <Pressable
                    accessibilityRole="button"
                    onPress={handleContinue}
                    style={continueRowStyles}
                    testID={HomeScreenSelectors.ResumeButton}
                >
                    <View style={styles.continueProgressTrack}>
                        <View style={continueProgressFillStyles} />
                        <View style={continueProgressRemainderStyles} />
                    </View>

                    <View style={styles.continueContent}>
                        <View style={continueIconStyles}>
                            <Play color={theme.colors.inkText} fill={theme.colors.inkText} size={18} />
                        </View>

                        <View style={styles.continueCopy}>
                            <BlackText
                                maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant}
                                numberOfLines={1}
                                style={continueTitleStyles}
                            >
                                <Trans>Continue</Trans>
                            </BlackText>
                            <BlackText
                                maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant}
                                numberOfLines={1}
                                style={continueElapsedStyles}
                            >
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
            ) : null}
        </View>
    );
};
