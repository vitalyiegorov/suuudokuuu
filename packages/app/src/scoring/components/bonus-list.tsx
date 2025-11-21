import { Text } from 'react-native';

import { defaultScoringConfig } from '../scoring-config.interface';

import { ListItem } from './list-item';

import type { TextStyle, ViewStyle } from 'react-native';

interface BonusListProps {
    readonly textStyle: TextStyle;
    readonly codeStyle: TextStyle;
    readonly listItemStyle: ViewStyle;
    readonly t: (str: TemplateStringsArray) => string;
}

export const BonusList = ({ textStyle, codeStyle, listItemStyle, t }: BonusListProps) => {
    const bonuses = [
        { label: t`Row`, value: defaultScoringConfig.lastInRowCoefficientConstant },
        { label: t`Column`, value: defaultScoringConfig.lastInColCoefficientConstant },
        { label: t`3×3 Block`, value: defaultScoringConfig.lastInGroupCoefficientConstant },
        { label: t`All of a number (1-9)`, value: defaultScoringConfig.lastValueCoefficient }
    ];

    return (
        <>
            {bonuses.map(({ label, value }, index) => (
                <ListItem key={index} listItemStyle={listItemStyle} textStyle={textStyle}>
                    • {label}: <Text style={codeStyle}>×{value}</Text> {t`of current score`}
                </ListItem>
            ))}
        </>
    );
};
