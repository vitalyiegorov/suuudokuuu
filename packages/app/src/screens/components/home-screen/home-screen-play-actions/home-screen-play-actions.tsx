import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { HomeScreenContinueRow } from '../home-screen-continue-row/home-screen-continue-row';
import { HomeScreenStartButton } from '../home-screen-start-button/home-screen-start-button';
import { HomeScreenSelectors } from '../home-screen.selectors';
import { HomeScreenStyles as styles } from '../home-screen.styles';

interface Props {
    readonly currentElapsedTimeText: string;
    readonly currentProgressPercent: number;
    readonly currentProgressText: string;
    readonly isGameStarted: boolean;
    readonly isHellSelected: boolean;
    readonly isInfinitySelected: boolean;
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
    isInfinitySelected,
    isLoading,
    onStart,
    startButtonSubtitle,
    startButtonText
}: Props) => {
    const { theme } = use(ThemeContext);
    const isSpecialTierSelected = isHellSelected || isInfinitySelected;
    const specialButtonColor = isHellSelected ? theme.colors.danger : theme.colors.board.selected;
    const startButtonColor = isSpecialTierSelected ? specialButtonColor : null;
    const specialButtonTextColor = isHellSelected ? theme.colors.dangerText : theme.colors.board.selectedText;
    const startButtonTextColor = isSpecialTierSelected ? specialButtonTextColor : theme.colors.inkText;
    const startButtonTitleStyles = [styles.startButtonTitle, { color: startButtonTextColor }];
    const startButtonSubtitleStyles = [styles.startButtonSubtitle, { color: startButtonTextColor }];

    return (
        <View style={styles.playActions}>
            <HomeScreenStartButton
                color={startButtonColor}
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
                <HomeScreenContinueRow
                    currentElapsedTimeText={currentElapsedTimeText}
                    currentProgressPercent={currentProgressPercent}
                    currentProgressText={currentProgressText}
                />
            ) : null}
        </View>
    );
};
