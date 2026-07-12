import { Trans } from '@lingui/react/macro';
import { AppButton } from '@suuudokuuu/ui';
import { Play } from 'lucide-react-native';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { useResumeGame } from '../../../../game/hooks/use-resume-game.hook';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { HomeScreenSelectors } from '../home-screen.selectors';
import { HomeScreenStyles as styles } from '../home-screen.styles';

interface Props {
    readonly currentElapsedTimeText: string;
    readonly currentGameDifficultyLabel: string;
    readonly currentProgressPercent: number;
    readonly currentProgressText: string;
    readonly isGameStarted: boolean;
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
    isLoading,
    onStart,
    startButtonSubtitle,
    startButtonText
}: Props) => {
    const { theme } = use(ThemeContext);
    const handleContinue = useResumeGame();
    const startButtonTitleStyles = [styles.startButtonTitle, { color: theme.colors.label.inverted }];
    const startButtonSubtitleStyles = [styles.startButtonSubtitle, { color: theme.colors.label.inverted }];
    const continueRowStyles = [styles.continueRow, { backgroundColor: theme.colors.cell.highlighted }];
    const continueProgressFillStyles = [
        styles.continueProgressFill,
        { backgroundColor: theme.colors.value.progress, flex: currentProgressPercent }
    ];
    const continueProgressRemainderStyles = { flex: 100 - currentProgressPercent };
    const continueIconStyles = [styles.continueIcon, { backgroundColor: theme.colors.black }];
    const continueTitleStyles = [styles.continueTitle, { color: theme.colors.label.main }];
    const continueElapsedStyles = [styles.continueElapsed, { color: theme.colors.label.hint }];
    const continueProgressTextStyles = [styles.continueProgressText, { color: theme.colors.label.main }];

    return (
        <View style={styles.playActions}>
            <AppButton
                isLoading={isLoading}
                onPress={onStart}
                size="large"
                style={styles.primaryButton}
                testID={HomeScreenSelectors.StartButton}
                variant="primary"
            >
                <View style={styles.startButtonContent}>
                    <BlackText style={startButtonTitleStyles}>{startButtonText}</BlackText>
                    <BlackText style={startButtonSubtitleStyles}>{startButtonSubtitle}</BlackText>
                </View>
            </AppButton>

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
                            <Play color={theme.colors.label.inverted} fill={theme.colors.label.inverted} size={18} />
                        </View>

                        <View style={styles.continueCopy}>
                            <BlackText numberOfLines={1} style={continueTitleStyles}>
                                <Trans>Continue</Trans>
                            </BlackText>
                            <BlackText style={continueElapsedStyles}>{currentElapsedTimeText}</BlackText>
                        </View>

                        <BlackText style={continueProgressTextStyles}>{currentProgressText}</BlackText>
                    </View>
                </Pressable>
            ) : null}
        </View>
    );
};
