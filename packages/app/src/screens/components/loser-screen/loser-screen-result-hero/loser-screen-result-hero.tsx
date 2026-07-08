import { Trans } from '@lingui/react/macro';
import { LucideCircleX, LucideTrophy } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { LoserScreenSelectors } from '../loser-screen.selectors';

import { LoserScreenResultHeroStyles as styles } from './loser-screen-result-hero.styles';

interface Props {
    readonly detailsText: string;
    readonly progressPercent: number;
}

export const LoserScreenResultHero = ({ detailsText, progressPercent }: Props) => {
    const { theme } = use(ThemeContext);
    const iconTileStyles = [styles.iconTile, { backgroundColor: theme.colors.black }];
    const trophyColor = theme.colors.red;
    const titleStyles = [styles.title, { color: theme.colors.label.main }];
    const detailsPillStyles = [styles.detailsPill, { backgroundColor: theme.colors.black }];
    const detailsTextStyles = [styles.detailsText, { color: theme.colors.label.inverted }];
    const eyebrowStyles = [styles.eyebrow, { color: theme.colors.label.hint }];
    const percentStyles = [styles.percent, { color: theme.colors.label.main }];
    const reasonPillStyles = [
        styles.reasonPill,
        { backgroundColor: theme.colors.cell.highlighted, borderColor: theme.colors.value.border }
    ];
    const reasonTextStyles = [styles.reasonText, { color: theme.colors.red }];
    const progressPercentText = `${progressPercent}%`;

    return (
        <View style={styles.container}>
            <View style={iconTileStyles}>
                <LucideTrophy color={trophyColor} size={42} strokeWidth={2.6} />
            </View>

            <BlackText style={titleStyles}>
                <Trans>Better luck next time!</Trans>
            </BlackText>

            <View style={detailsPillStyles}>
                <Text allowFontScaling={false} numberOfLines={1} style={detailsTextStyles}>
                    {detailsText}
                </Text>
            </View>

            <BlackText style={eyebrowStyles}>
                <Trans>You got to</Trans>
            </BlackText>

            <BlackText style={percentStyles} testID={LoserScreenSelectors.ProgressValue}>
                {progressPercentText}
            </BlackText>

            <View style={reasonPillStyles}>
                <LucideCircleX color={theme.colors.red} size={18} strokeWidth={2.6} />

                <BlackText style={reasonTextStyles}>
                    <Trans>Too many mistakes</Trans>
                </BlackText>
            </View>
        </View>
    );
};
