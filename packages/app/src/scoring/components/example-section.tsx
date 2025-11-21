import { Text } from 'react-native';

import { ListItem } from './list-item';

import type { TextStyle, ViewStyle } from 'react-native';

interface ExampleSectionProps {
    readonly textStyle: TextStyle;
    readonly codeStyle: TextStyle;
    readonly listItemStyle: ViewStyle;
    readonly t: (str: TemplateStringsArray) => string;
}

const boldStyle = { fontWeight: 'bold' as const };

export const ExampleSection = ({ textStyle, codeStyle, listItemStyle, t }: ExampleSectionProps) => {
    const steps = [
        { label: t`Base`, value: t`0.5 × 2 × 1.5 = 1.5`, isBold: false },
        { label: t`Row bonus`, value: t`1.5 × 3 = 4.5`, isBold: false },
        { label: t`Subtotal`, value: t`6.0`, isBold: false },
        { label: t`Time penalty`, value: t`6.0 × 60 × 0.0001 = 0.036`, isBold: false },
        { label: t`Mistake penalty`, value: t`5.96 × 2 × 0.05 = 0.596`, isBold: false },
        { label: t`Final score`, value: t`5.36 points`, isBold: true }
    ];

    return (
        <>
            <Text style={textStyle}>{t`Easy difficulty (3 mistakes allowed), completing a row after 60 seconds with 2 mistakes:`}</Text>
            {steps.map(({ label, value, isBold }, index) => (
                <ListItem key={index} listItemStyle={listItemStyle} textStyle={textStyle}>
                    {isBold ? (
                        <>
                            <Text style={boldStyle}>{index + 1}. {label}:</Text> <Text style={codeStyle}>{value}</Text>
                        </>
                    ) : (
                        <>
                            {index + 1}. {label}: <Text style={codeStyle}>{value}</Text>
                        </>
                    )}
                </ListItem>
            ))}
        </>
    );
};
