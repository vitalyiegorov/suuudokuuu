import { Trans } from '@lingui/react/macro';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeResultScreenSelectors } from '../challenge-result-screen/challenge-result-screen.selectors';

import { ChallengeResultScoreStyles as styles } from './challenge-result-score.styles';

interface Props {
    readonly scoreText: string;
}

export const ChallengeResultScore = ({ scoreText }: Props) => {
    const { theme } = use(ThemeContext);
    const containerStyles = [styles.container, { borderLeftColor: theme.colors.white05 }];
    const labelStyles = [styles.label, { color: theme.colors.label.inverted }];
    const valueStyles = [styles.value, { color: theme.colors.label.inverted }];

    return (
        <View style={containerStyles}>
            <Text style={labelStyles}>
                <Trans>Score</Trans>
            </Text>
            <Text style={valueStyles} testID={ChallengeResultScreenSelectors.ScoreValue}>
                {scoreText}
            </Text>
        </View>
    );
};
