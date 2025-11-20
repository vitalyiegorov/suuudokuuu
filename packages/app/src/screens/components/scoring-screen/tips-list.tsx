import { ListItem } from './list-item';

import type { TextStyle, ViewStyle } from 'react-native';

interface TipsListProps {
    readonly textStyle: TextStyle;
    readonly listItemStyle: ViewStyle;
    readonly t: (str: TemplateStringsArray) => string;
}

export const TipsList = ({ textStyle, listItemStyle, t }: TipsListProps) => {
    const tips = [
        t`Play on higher difficulties for bigger multipliers`,
        t`Complete rows, columns, and blocks for huge bonuses`,
        t`Be fast to minimize time penalties`,
        t`Avoid mistakes - they cost you points!`
    ];

    return (
        <>
            {tips.map((tip, index) => (
                <ListItem key={index} listItemStyle={listItemStyle} textStyle={textStyle}>
                    • {tip}
                </ListItem>
            ))}
        </>
    );
};
