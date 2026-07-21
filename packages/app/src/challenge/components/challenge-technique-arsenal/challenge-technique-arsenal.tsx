import { View } from 'react-native';

import { isEmptyArray } from '@rnw-community/shared';

import { getChallengeTechniqueSummary } from '../../utils/get-challenge-technique-summary.util';
import { ChallengeTechniqueArsenalCard } from '../challenge-technique-arsenal-card/challenge-technique-arsenal-card';

import { ChallengeTechniqueArsenalStyles as styles } from './challenge-technique-arsenal.styles';

import type { ChallengeTechniqueEventInterface } from '../../interfaces/challenge-technique-event.interface';

const CARDS_PER_ROW = 3;
const MAX_ARSENAL_CARDS = 6;

interface Props {
    readonly events: ChallengeTechniqueEventInterface[];
}

export const ChallengeTechniqueArsenal = ({ events }: Props) => {
    if (isEmptyArray(events)) {
        return null;
    }

    const summary = getChallengeTechniqueSummary(events).slice(0, MAX_ARSENAL_CARDS);
    const rows = [];
    for (let index = 0; index < summary.length; index += CARDS_PER_ROW) {
        rows.push(summary.slice(index, index + CARDS_PER_ROW));
    }

    return (
        <View style={styles.grid}>
            {rows.map((row, rowIndex) => {
                const spacerCount = CARDS_PER_ROW - row.length;
                const spacers = Array.from({ length: spacerCount }, (_unused, spacerIndex) => (
                    <View key={`spacer-${spacerIndex}`} style={styles.spacer} />
                ));

                return (
                    <View key={`arsenal-row-${rowIndex}`} style={styles.row}>
                        {row.map((item, columnIndex) => {
                            const isHero = rowIndex === 0 && columnIndex === 0;

                            return <ChallengeTechniqueArsenalCard highlighted={isHero} item={item} key={item.technique} />;
                        })}
                        {spacers}
                    </View>
                );
            })}
        </View>
    );
};
