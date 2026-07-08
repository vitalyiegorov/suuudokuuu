import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip } from '@suuudokuuu/ui';
import { use } from 'react';

import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ReplayHeaderStyles as styles } from './replay-header.styles';

import type { CompletedGameInterface } from '../../interfaces/completed-game.interface';

interface Props {
    readonly game: CompletedGameInterface;
}

const RelaxedMistakeLimit = 99;

export const ReplayHeader = ({ game }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const elapsedTimeText = useTimerText(game.elapsedTime);
    const mistakesValue = game.maxMistakes >= RelaxedMistakeLimit ? `${game.mistakes}/∞` : `${game.mistakes}/${game.maxMistakes}`;
    const items = [
        { label: t`Level`, value: getDifficultyText(game.difficulty), width: 84 },
        { label: t`Score`, value: String(game.score), valueColor: theme.colors.value.progressActive, width: 68 },
        { label: t`Mistakes`, value: mistakesValue, width: 76 },
        { label: t`Time`, value: elapsedTimeText, width: 86 }
    ];

    return (
        <AppMetricStrip
            itemStyle={styles.item}
            items={items}
            labelStyle={styles.label}
            separatorStyle={styles.separator}
            style={styles.container}
            valueStyle={styles.value}
        />
    );
};
