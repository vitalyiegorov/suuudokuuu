import { DifficultyEnum } from '@suuudokuuu/generator';
import { type ReactNode, use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { HomeScreenStartButton } from '../home-screen-start-button/home-screen-start-button';
import { HomeScreenSelectors } from '../home-screen.selectors';
import { HomeScreenStyles as styles } from '../home-screen.styles';

interface Props {
    readonly children?: ReactNode;
    readonly difficulty: DifficultyEnum;
    readonly isLoading: boolean;
    readonly onStart: () => void;
    readonly startButtonSubtitle: string;
    readonly startButtonText: string;
}

export const HomeScreenPlayActions = ({ children, difficulty, isLoading, onStart, startButtonSubtitle, startButtonText }: Props) => {
    const { theme } = use(ThemeContext);
    const isHellSelected = difficulty === DifficultyEnum.Hell;
    const isInfinitySelected = difficulty === DifficultyEnum.Infinity;
    const isSpecialTierSelected = isHellSelected || isInfinitySelected;
    const specialButtonVariant = isHellSelected ? 'dangerFilled' : 'boardSelected';
    const startButtonVariant = isSpecialTierSelected ? specialButtonVariant : null;
    const specialButtonTextColor = isHellSelected ? theme.colors.dangerText : theme.colors.board.selectedText;
    const startButtonTextColor = isSpecialTierSelected ? specialButtonTextColor : theme.colors.inkText;
    const startButtonTitleStyles = [styles.startButtonTitle, { color: startButtonTextColor }];
    const startButtonSubtitleStyles = [styles.startButtonSubtitle, { color: startButtonTextColor }];

    return (
        <View style={styles.playActions}>
            {children}

            <HomeScreenStartButton
                emberVariant={startButtonVariant}
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
        </View>
    );
};
