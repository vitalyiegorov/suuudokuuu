import { Trans, useLingui } from '@lingui/react/macro';
import { AppSurfaceCard } from '@suuudokuuu/ui';
import { LucideTrophy } from 'lucide-react-native';
import { use } from 'react';
import { Text } from 'react-native';

import { GameResultHero } from '../../../../@generic/components/game-result-hero/game-result-hero';
import { ThemeContext } from '../../../../theme/context/theme.context';

import { WinnerResultHeroStyles as styles } from './winner-result-hero.styles';

interface Props {
    readonly descriptorText: string;
    readonly isPersonalBest: boolean;
    readonly scoreText: string;
}

export const WinnerResultHero = ({ descriptorText, isPersonalBest, scoreText }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const statusTextStyles = [styles.statusText, { color: theme.colors.label.main }];

    return (
        <GameResultHero
            descriptorText={descriptorText}
            eyebrowText={t`Final score`}
            icon={<LucideTrophy color={theme.colors.label.inverted} size={42} strokeWidth={2.6} />}
            titleText={t`Winner, winner!`}
            valueText={scoreText}
        >
            {isPersonalBest ? (
                <AppSurfaceCard size="compact" style={styles.statusPill} variant="muted">
                    <Text style={statusTextStyles}>
                        <Trans>New personal best</Trans>
                    </Text>
                </AppSurfaceCard>
            ) : null}
        </GameResultHero>
    );
};
