import { DifficultyEnum } from '@suuudokuuu/generator';
import { Text } from 'react-native';

import { defaultScoringConfig } from '../scoring-config.interface';

import { ListItem } from './list-item';

import type { TextStyle, ViewStyle } from 'react-native';

interface DifficultyListProps {
    readonly textStyle: TextStyle;
    readonly codeStyle: TextStyle;
    readonly listItemStyle: ViewStyle;
    readonly t: (str: TemplateStringsArray) => string;
}

export const DifficultyList = ({ textStyle, codeStyle, listItemStyle, t }: DifficultyListProps) => {
    const difficulties = [
        { key: DifficultyEnum.Newbie, label: t`Newbie` },
        { key: DifficultyEnum.Easy, label: t`Easy` },
        { key: DifficultyEnum.Medium, label: t`Medium` },
        { key: DifficultyEnum.Hard, label: t`Hard` },
        { key: DifficultyEnum.Nightmare, label: t`Nightmare` }
    ];

    return (
        <>
            {difficulties.map(({ key, label }) => (
                <ListItem key={key} listItemStyle={listItemStyle} textStyle={textStyle}>
                    • {label}: <Text style={codeStyle}>×{defaultScoringConfig.difficultyCoefficients[key]}</Text> ={' '}
                    <Text style={codeStyle}>{defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[key]}</Text>
                </ListItem>
            ))}
        </>
    );
};
