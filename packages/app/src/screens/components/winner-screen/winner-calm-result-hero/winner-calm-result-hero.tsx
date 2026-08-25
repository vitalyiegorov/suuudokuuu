import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { LucideCheck } from 'lucide-react-native';
import { use } from 'react';

import { CelebrationPulse } from '../../../../@generic/components/celebration-pulse/celebration-pulse';
import { GameResultHeroIconSize } from '../../../../@generic/components/game-result-hero/constant/game-result-hero-icon-size.constant';
import { GameResultHero } from '../../../../@generic/components/game-result-hero/game-result-hero';
import { ThemeContext } from '../../../../theme/context/theme.context';

const HeroPulseSize = 96;

interface Props {
    readonly descriptorText: string;
    readonly moveCount: number;
}

export const WinnerCalmResultHero = ({ descriptorText, moveCount }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const moveCountText = plural(moveCount, { one: '# move', other: '# moves' });

    return (
        <GameResultHero
            descriptorText={descriptorText}
            eyebrowText={t`Solved in`}
            icon={
                <CelebrationPulse color={theme.colors.text.primary} size={HeroPulseSize}>
                    <LucideCheck color={theme.colors.text.primary} size={GameResultHeroIconSize} strokeWidth={2.2} />
                </CelebrationPulse>
            }
            titleText={t`Puzzle complete`}
            valueText={moveCountText}
        />
    );
};
