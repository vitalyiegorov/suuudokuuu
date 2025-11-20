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
        { label: t`Base`, value: t`500 × 2 = 1,000`, isBold: false },
        { label: t`Row bonus`, value: t`1,000 × 3 = 3,000`, isBold: false },
        { label: t`Subtotal`, value: t`4,000`, isBold: false },
        { label: t`Time penalty`, value: t`4,000 × 60 × 0.001 = 240`, isBold: false },
        { label: t`Mistake penalty`, value: t`3,760 × 2 × 0.05 = 376`, isBold: false },
        { label: t`Final score`, value: t`3,384 points`, isBold: true }
    ];

    return (
        <>
            <Text style={textStyle}>{t`Easy difficulty, completing a row after 60 seconds with 2 mistakes:`}</Text>
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
