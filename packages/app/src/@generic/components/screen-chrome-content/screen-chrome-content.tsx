import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { screenChromeContentStyles } from './screen-chrome-content.styles';

interface Props {
    readonly children: ReactNode;
    readonly style?: StyleProp<ViewStyle>;
}

export const ScreenChromeContent = ({ children, style }: Props): ReactNode => {
    const combinedStyle = [screenChromeContentStyles.content, style];

    return <View style={combinedStyle}>{children}</View>;
};
