import { Text, View } from 'react-native';

import type { ReactNode } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';

interface Props {
    readonly textStyle: TextStyle;
    readonly listItemStyle: ViewStyle;
    readonly children: ReactNode;
}

export const ListItem = ({ textStyle, listItemStyle, children }: Props) => (
    <View style={listItemStyle}>
        <Text style={textStyle}>{children}</Text>
    </View>
);
