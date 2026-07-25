import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useScreenChrome } from '../hook/use-screen-chrome.hook';

import { collapsibleHeaderStyles } from './collapsible-header.styles';

interface Props {
    readonly children: ReactNode;
    readonly style?: StyleProp<ViewStyle>;
}

export const CollapsibleHeader = ({ children, style }: Props): ReactNode => {
    const { config } = useScreenChrome();
    const insets = useSafeAreaInsets();

    const headerTop = insets.top + config.headerTopInset;
    const containerStyle = { paddingTop: headerTop, height: headerTop + config.headerHeight };
    const combinedContainerStyle = [collapsibleHeaderStyles.container, containerStyle, style];

    return (
        <View style={combinedContainerStyle} pointerEvents="box-none">
            <View style={collapsibleHeaderStyles.row} pointerEvents="box-none">
                {children}
            </View>
        </View>
    );
};
