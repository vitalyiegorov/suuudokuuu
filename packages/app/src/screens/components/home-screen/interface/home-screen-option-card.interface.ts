import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface HomeScreenOptionCardInterface {
    readonly cardStyles: StyleProp<ViewStyle>;
    readonly description: string;
    readonly descriptionStyles: StyleProp<TextStyle>;
    readonly key: number | string;
    readonly onPress: () => void;
    readonly title: string;
    readonly titleStyles: StyleProp<TextStyle>;
}
