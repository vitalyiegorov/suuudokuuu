import { use } from 'react';
import { Text } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { useChallengeResultMarginText } from '../../hooks/use-challenge-result-margin-text.hook';
import { ChallengeResultScreenSelectors } from '../challenge-result-screen/challenge-result-screen.selectors';

import { ChallengeResultMarginStyles as styles } from './challenge-result-margin.styles';

import type { ChallengeDurationPartsInterface } from '../../interfaces/challenge-duration.interface';
import type { ChallengeResult } from '../../interfaces/challenge-result.interface';

interface Props {
    readonly durationParts: ChallengeDurationPartsInterface;
    readonly result: ChallengeResult;
}

export const ChallengeResultMargin = ({ durationParts, result }: Props) => {
    const { theme } = use(ThemeContext);
    const marginText = useChallengeResultMarginText(durationParts, result);
    const textStyles = [styles.text, { color: theme.colors.label.inverted }];

    return (
        <Text style={textStyles} testID={ChallengeResultScreenSelectors.MarginValue}>
            {marginText}
        </Text>
    );
};
