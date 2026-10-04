import { DisplayMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { use } from 'react';

import { ThemeContext } from '../../../../theme/context/theme.context';
import { BlackText } from '../../black-text/black-text';
import { GameResultHeroStyles as styles } from '../game-result-hero.styles';

interface Props {
    readonly eyebrowText: string;
    readonly testID?: string;
    readonly valueText: string;
}

export const GameResultHeroValue = ({ eyebrowText, testID, valueText }: Props) => {
    const { theme } = use(ThemeContext);
    const eyebrowStyles = [styles.eyebrow, { color: theme.colors.text.hint }];
    const valueStyles = [styles.value, { color: theme.colors.text.primary }];

    return (
        <>
            <BlackText style={eyebrowStyles}>{eyebrowText}</BlackText>

            <BlackText maxFontSizeMultiplier={DisplayMaxFontSizeMultiplierConstant} style={valueStyles} testID={testID}>
                {valueText}
            </BlackText>
        </>
    );
};
