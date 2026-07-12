import { StyleSheet } from 'react-native';

import {
    AppTogglePressablePadding,
    AppToggleThumbSize,
    AppToggleTrackHeight,
    AppToggleTrackPadding,
    AppToggleTrackWidth,
    AppToggleTranslateX
} from './constant/app-toggle-size.constant';

export const AppToggleStyles = StyleSheet.create({
    pressable: {
        borderRadius: AppToggleTrackHeight / 2 + AppTogglePressablePadding,
        padding: AppTogglePressablePadding
    },
    thumb: {
        borderRadius: AppToggleThumbSize / 2,
        height: AppToggleThumbSize,
        width: AppToggleThumbSize
    },
    thumbDisabled: {
        transform: [{ translateX: 0 }]
    },
    thumbEnabled: {
        transform: [{ translateX: AppToggleTranslateX }]
    },
    track: {
        borderCurve: 'continuous',
        borderRadius: AppToggleTrackHeight / 2,
        height: AppToggleTrackHeight,
        justifyContent: 'center',
        padding: AppToggleTrackPadding,
        width: AppToggleTrackWidth
    }
});
