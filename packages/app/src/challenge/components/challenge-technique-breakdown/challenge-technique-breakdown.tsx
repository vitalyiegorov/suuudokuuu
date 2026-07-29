import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { Text, View } from 'react-native';

import { isEmptyArray } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeTechniqueTierEnum } from '../../enums/challenge-technique-tier.enum';
import { ChallengeTechniqueArsenal } from '../challenge-technique-arsenal/challenge-technique-arsenal';

import { ChallengeTechniqueBreakdownStyles as styles } from './challenge-technique-breakdown.styles';

import type { ChallengeTechniqueEventInterface } from '../../interfaces/challenge-technique-event.interface';

interface Props {
    readonly events: ChallengeTechniqueEventInterface[];
    readonly label: string;
}

export const ChallengeTechniqueBreakdown = ({ events, label }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    if (isEmptyArray(events)) {
        return null;
    }

    const sharpCount = events.filter(
        event => event.tier === ChallengeTechniqueTierEnum.Clever || event.tier === ChallengeTechniqueTierEnum.Advanced
    ).length;
    const headlineText =
        sharpCount > 0 ? plural(sharpCount, { one: '# sharp technique', other: '# sharp techniques' }) : t`Solved with the fundamentals`;

    const labelStyle = [styles.label, { color: theme.colors.label.hint }];
    const headlineStyle = [styles.headline, { color: theme.colors.label.main }];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text allowFontScaling={false} style={labelStyle}>
                    {label}
                </Text>
                <Text allowFontScaling={false} style={headlineStyle}>
                    {headlineText}
                </Text>
            </View>

            <ChallengeTechniqueArsenal events={events} />
        </View>
    );
};
