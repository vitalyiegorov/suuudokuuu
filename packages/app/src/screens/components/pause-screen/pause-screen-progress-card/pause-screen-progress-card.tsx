import { Sudoku } from '@suuudokuuu/generator';
import { AppProgressBar, AppSurfaceCard } from '@suuudokuuu/ui';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { PauseScreenBoardPreview } from '../pause-screen-board-preview/pause-screen-board-preview';
import { PauseScreenSelectors } from '../pause-screen.selectors';

import { PauseScreenProgressCardStyles as styles } from './pause-screen-progress-card.styles';

interface Props {
    readonly sudoku: Sudoku;
    readonly label: string;
    readonly meta: string;
    readonly progressPercent: number;
}

export const PauseScreenProgressCard = ({ sudoku, label, meta, progressPercent }: Props) => {
    const { theme } = use(ThemeContext);
    const labelStyles = [styles.label, { color: theme.colors.label.hint }];
    const valueStyles = [styles.value, { color: theme.colors.label.main }];
    const metaStyles = [styles.meta, { color: theme.colors.label.hint }];
    const percentText = `${progressPercent}%`;

    return (
        <AppSurfaceCard size="compact" style={styles.container} variant="muted">
            <View style={styles.board}>
                <PauseScreenBoardPreview sudoku={sudoku} />
            </View>

            <View style={styles.content}>
                <BlackText adjustsFontSizeToFit minimumFontScale={0.72} numberOfLines={1} style={labelStyles}>
                    {label}
                </BlackText>

                <BlackText adjustsFontSizeToFit minimumFontScale={0.72} numberOfLines={1} style={valueStyles} testID={PauseScreenSelectors.ProgressValue}>
                    {percentText}
                </BlackText>

                <AppProgressBar percent={progressPercent} size="compact" style={styles.progress} />

                <BlackText adjustsFontSizeToFit minimumFontScale={0.72} numberOfLines={1} style={metaStyles}>
                    {meta}
                </BlackText>
            </View>
        </AppSurfaceCard>
    );
};
