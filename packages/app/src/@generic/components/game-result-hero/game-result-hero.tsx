import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { type ReactNode, use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { BlackText } from '../black-text/black-text';

import { GameResultHeroStyles as styles } from './game-result-hero.styles';

interface Props {
    readonly children?: ReactNode;
    readonly descriptorText: string;
    readonly icon: ReactNode;
    readonly titleText: string;
}

export const GameResultHero = ({ children, descriptorText, icon, titleText }: Props) => {
    const { theme } = use(ThemeContext);
    const titleStyles = [styles.title, { color: theme.colors.text.primary }];
    const descriptorPillStyles = [styles.descriptorPill, { borderColor: theme.colors.surface.border }];
    const descriptorTextStyles = [styles.descriptorText, { color: theme.colors.text.primary }];

    return (
        <View style={styles.container}>
            {icon}

            <BlackText maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={titleStyles}>
                {titleText}
            </BlackText>

            <View style={styles.descriptorRow}>
                <View style={descriptorPillStyles}>
                    <Text maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} numberOfLines={1} style={descriptorTextStyles}>
                        {descriptorText}
                    </Text>
                </View>
            </View>

            {children}
        </View>
    );
};
