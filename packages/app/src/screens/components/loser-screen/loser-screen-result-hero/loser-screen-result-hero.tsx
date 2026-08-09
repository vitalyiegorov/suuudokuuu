import { Trans, useLingui } from '@lingui/react/macro';
import { LucideCircleX } from 'lucide-react-native';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { GameResultHeroIconSize } from '../../../../@generic/components/game-result-hero/constant/game-result-hero-icon-size.constant';
import { GameResultHero } from '../../../../@generic/components/game-result-hero/game-result-hero';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { LoserScreenSelectors } from '../loser-screen.selectors';

import { LoserScreenResultHeroStyles as styles } from './loser-screen-result-hero.styles';

interface Props {
    readonly detailsText: string;
    readonly isRatingCeiling: boolean;
    readonly progressPercent: number;
    readonly rating: number;
}

export const LoserScreenResultHero = ({ detailsText, isRatingCeiling, progressPercent, rating }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const reasonPillStyles = [
        styles.reasonPill,
        { backgroundColor: theme.colors.surface.subtle, borderColor: theme.colors.surface.border }
    ];
    const reasonTextStyles = [styles.reasonText, { color: theme.colors.danger }];
    const progressPercentText = `${progressPercent}%`;

    return (
        <GameResultHero
            descriptorText={detailsText}
            eyebrowText={t`You got to`}
            icon={<LucideCircleX color={theme.colors.danger} size={GameResultHeroIconSize} strokeWidth={2.2} />}
            isRatingCeiling={isRatingCeiling}
            rating={rating}
            testID={LoserScreenSelectors.ProgressValue}
            titleText={t`Better luck next time!`}
            valueText={progressPercentText}
        >
            <View style={reasonPillStyles}>
                <LucideCircleX color={theme.colors.danger} size={18} strokeWidth={2.6} />

                <BlackText style={reasonTextStyles}>
                    <Trans>Too many mistakes</Trans>
                </BlackText>
            </View>
        </GameResultHero>
    );
};
