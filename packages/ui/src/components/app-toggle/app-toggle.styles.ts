import { StyleSheet } from 'react-native-unistyles';

import {
    AppTogglePressablePadding,
    AppToggleThumbSize,
    AppToggleTrackHeight,
    AppToggleTrackPadding,
    AppToggleTrackWidth
} from './constant/app-toggle-size.constant';

export const AppToggleStyles = StyleSheet.create(() => ({
    pressable: {
        borderRadius: AppToggleTrackHeight / 2 + AppTogglePressablePadding,
        padding: AppTogglePressablePadding,
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    },
    thumb: {
        borderRadius: AppToggleThumbSize / 2,
        height: AppToggleThumbSize,
        width: AppToggleThumbSize
    },
    track: {
        borderCurve: 'continuous',
        borderRadius: AppToggleTrackHeight / 2,
        borderWidth: StyleSheet.hairlineWidth,
        height: AppToggleTrackHeight,
        justifyContent: 'center',
        padding: AppToggleTrackPadding,
        width: AppToggleTrackWidth
    }
}));
