import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeTechniquePreview } from '../challenge-technique-preview/challenge-technique-preview';

import { ChallengeRunTapeStyles as styles } from './challenge-run-tape.styles';

import type { ChallengeAwayRangeInterface } from '../../interfaces/challenge-away-range.interface';
import type { ChallengeTechniqueEventInterface } from '../../interfaces/challenge-technique-event.interface';

interface Props {
    readonly awayRanges: ChallengeAwayRangeInterface[];
    readonly events: ChallengeTechniqueEventInterface[];
    readonly label: string;
    readonly totalTime: number;
}

export const ChallengeRunTape = ({ awayRanges, events, label, totalTime }: Props) => {
    const { theme } = use(ThemeContext);

    const labelStyle = [styles.label, { color: theme.colors.text.hint }];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={labelStyle}>
                    {label}
                </Text>
            </View>

            <ChallengeTechniquePreview awayRanges={awayRanges} events={events} totalTime={totalTime} />
        </View>
    );
};
