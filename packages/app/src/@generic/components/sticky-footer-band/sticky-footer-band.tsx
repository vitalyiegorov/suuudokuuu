import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EdgeFade } from '@rnw-community/react-native-screen-chrome';

import { StickyFooterBandStyles as styles } from './sticky-footer-band.styles';

import type { EdgeFadePropsInterface } from '@rnw-community/react-native-screen-chrome';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly children: ReactNode;
    readonly contentStyle?: StyleProp<ViewStyle>;
    readonly edgeFadeProps?: Omit<EdgeFadePropsInterface, 'position'>;
}

export const StickyFooterBand = ({ children, contentStyle, edgeFadeProps }: Props) => {
    const { bottom } = useSafeAreaInsets();

    const contentStyles = [styles.content, { paddingBottom: bottom }];

    return (
        <View pointerEvents="box-none" style={styles.container}>
            <EdgeFade position="bottom" {...edgeFadeProps} />
            <View style={contentStyles}>
                <View style={contentStyle}>{children}</View>
            </View>
        </View>
    );
};
