import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { screenChromeFrameStyles } from './screen-chrome-frame.styles';

interface Props {
    readonly children: ReactNode;
    readonly style?: StyleProp<ViewStyle>;
}

export const ScreenChromeFrame = ({ children, style }: Props): ReactNode => {
    const combinedStyle = [screenChromeFrameStyles.frame, style];

    return <View style={combinedStyle}>{children}</View>;
};
