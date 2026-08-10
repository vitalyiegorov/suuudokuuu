import { Trans, useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { AppSurfaceCard } from '@suuudokuuu/ui';
import { LucideSparkles, LucideTrophy } from 'lucide-react-native';
import { use } from 'react';
import { Text } from 'react-native';

import { CelebrationPulse } from '../../../../@generic/components/celebration-pulse/celebration-pulse';
import { GameResultHeroIconSize } from '../../../../@generic/components/game-result-hero/constant/game-result-hero-icon-size.constant';
import { GameResultHero } from '../../../../@generic/components/game-result-hero/game-result-hero';
import { ThemeContext } from '../../../../theme/context/theme.context';

import { winnerResultHeroGetCelebrationVariant } from './utils/winner-result-hero-get-celebration-variant.util';
import { WinnerResultHeroStyles as styles } from './winner-result-hero.styles';

const HeroPulseSize = 96;
const PersonalBestIconSize = 20;

interface Props {
    readonly descriptorText: string;
    readonly difficulty: DifficultyEnum;
    readonly isPersonalBest: boolean;
    readonly isRatingCeiling: boolean;
    readonly rating: number;
    readonly scoreText: string;
}

export const WinnerResultHero = ({ descriptorText, difficulty, isPersonalBest, isRatingCeiling, rating, scoreText }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const personalBestCardStyles = [styles.personalBestCard, { backgroundColor: 'transparent', borderColor: theme.colors.surface.border }];
    const personalBestTextStyles = [styles.personalBestText, { color: theme.colors.text.primary }];
    const celebrationVariant = winnerResultHeroGetCelebrationVariant(difficulty);

    return (
        <GameResultHero
            descriptorText={descriptorText}
            eyebrowText={t`Final score`}
            icon={
                <CelebrationPulse color={theme.colors.text.primary} size={HeroPulseSize} variant={celebrationVariant}>
                    <LucideTrophy color={theme.colors.text.primary} size={GameResultHeroIconSize} strokeWidth={2.2} />
                </CelebrationPulse>
            }
            isRatingCeiling={isRatingCeiling}
            rating={rating}
            titleText={t`Winner, winner!`}
            valueText={scoreText}
        >
            {isPersonalBest ? (
                <AppSurfaceCard size="compact" style={personalBestCardStyles}>
                    <LucideSparkles color={theme.colors.text.primary} size={PersonalBestIconSize} strokeWidth={2.2} />
                    <Text style={personalBestTextStyles}>
                        <Trans>New personal best</Trans>
                    </Text>
                </AppSurfaceCard>
            ) : null}
        </GameResultHero>
    );
};
