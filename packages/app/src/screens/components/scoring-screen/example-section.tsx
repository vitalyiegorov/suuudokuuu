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

export const ExampleSection = ({ textStyle, codeStyle, listItemStyle, t }: ExampleSectionProps) => (
    <>
        <Text style={textStyle}>{t`Easy difficulty, completing a row after 60 seconds with 2 mistakes:`}</Text>
        <ListItem listItemStyle={listItemStyle} textStyle={textStyle}>
            1. {t`Base`}: <Text style={codeStyle}>{t`500 × 2 = 1,000`}</Text>
        </ListItem>
        <ListItem listItemStyle={listItemStyle} textStyle={textStyle}>
            2. {t`Row bonus`}: <Text style={codeStyle}>{t`1,000 × 3 = 3,000`}</Text>
        </ListItem>
        <ListItem listItemStyle={listItemStyle} textStyle={textStyle}>
            3. {t`Subtotal`}: <Text style={codeStyle}>{t`4,000`}</Text>
        </ListItem>
        <ListItem listItemStyle={listItemStyle} textStyle={textStyle}>
            4. {t`Time penalty`}: <Text style={codeStyle}>{t`4,000 × 60 × 0.001 = 240`}</Text>
        </ListItem>
        <ListItem listItemStyle={listItemStyle} textStyle={textStyle}>
            5. {t`Mistake penalty`}: <Text style={codeStyle}>{t`3,760 × 2 × 0.05 = 376`}</Text>
        </ListItem>
        <ListItem listItemStyle={listItemStyle} textStyle={textStyle}>
            <Text style={boldStyle}>{t`Final score`}:</Text> <Text style={codeStyle}>{t`3,384 points`}</Text>
        </ListItem>
    </>
);
