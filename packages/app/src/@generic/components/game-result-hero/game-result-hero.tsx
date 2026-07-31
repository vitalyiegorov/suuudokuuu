import { type ReactNode, use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { BlackText } from '../black-text/black-text';

import { GameResultHeroStyles as styles } from './game-result-hero.styles';

interface Props {
    readonly children?: ReactNode;
    readonly descriptorText: string;
    readonly eyebrowText: string;
    readonly icon: ReactNode;
    readonly testID?: string;
    readonly titleText: string;
    readonly valueText: string;
}

export const GameResultHero = ({ children, descriptorText, eyebrowText, icon, testID, titleText, valueText }: Props) => {
    const { theme } = use(ThemeContext);
    const titleStyles = [styles.title, { color: theme.colors.text.primary }];
    const descriptorPillStyles = [styles.descriptorPill, { borderColor: theme.colors.surface.border }];
    const descriptorTextStyles = [styles.descriptorText, { color: theme.colors.text.primary }];
    const eyebrowStyles = [styles.eyebrow, { color: theme.colors.text.hint }];
    const valueStyles = [styles.value, { color: theme.colors.text.primary }];

    return (
        <View style={styles.container}>
            {icon}

            <BlackText style={titleStyles}>{titleText}</BlackText>

            <View style={descriptorPillStyles}>
                <Text allowFontScaling={false} numberOfLines={1} style={descriptorTextStyles}>
                    {descriptorText}
                </Text>
            </View>

            <BlackText style={eyebrowStyles}>{eyebrowText}</BlackText>

            <BlackText style={valueStyles} testID={testID}>
                {valueText}
            </BlackText>

            {children}
        </View>
    );
};
