import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { ThemeContext } from '../../../theme/context/theme.context';

import { DailyRecentSolveResultStyles as styles } from './daily-recent-solve-result.styles';

import type { DailyResultType } from '@suuudokuuu/progress';

interface Props {
    readonly result: DailyResultType;
}

export const DailyRecentSolveResult = ({ result }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const elapsedTimeText = useTimerText(result.elapsedTime);

    const { score } = result;
    const timeStyles = [styles.time, { color: theme.colors.text.primary }];
    const pointsStyles = [styles.points, { color: theme.colors.text.hint }];

    return (
        <View style={styles.root}>
            <BlackText style={timeStyles}>{elapsedTimeText}</BlackText>

            <BlackText style={pointsStyles}>{t({ message: plural(score, { one: '# point', other: '# points' }) })}</BlackText>
        </View>
    );
};
