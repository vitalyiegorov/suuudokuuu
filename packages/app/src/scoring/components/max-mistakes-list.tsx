import { Text } from 'react-native';

import { ListItem } from './list-item';

import type { TextStyle, ViewStyle } from 'react-native';

interface MaxMistakesListProps {
    readonly textStyle: TextStyle;
    readonly codeStyle: TextStyle;
    readonly listItemStyle: ViewStyle;
    readonly t: (str: TemplateStringsArray) => string;
}

export const MaxMistakesList = ({ textStyle, codeStyle, listItemStyle, t }: MaxMistakesListProps) => {
    const mistakesOptions = [
        { label: t`Hardcore (0 mistakes)`, value: 5 },
        { label: t`1 mistake`, value: 3 },
        { label: t`2 mistakes`, value: 2 },
        { label: t`3 mistakes`, value: 1.5 },
        { label: t`5 mistakes`, value: 1.2 },
        { label: t`Immortal (99 mistakes)`, value: 1, note: t`(no bonus)` }
    ];

    return (
        <>
            {mistakesOptions.map(({ label, value, note }, index) => (
                <ListItem key={index} listItemStyle={listItemStyle} textStyle={textStyle}>
                    • {label}: <Text style={codeStyle}>×{value}</Text> {note ? ` ${note}` : ''}
                </ListItem>
            ))}
        </>
    );
};
