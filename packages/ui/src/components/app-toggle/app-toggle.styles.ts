import { StyleSheet } from 'react-native-unistyles';

import { AppToggleKnobInset, AppToggleKnobSize, AppToggleTrackHeight, AppToggleTrackWidth } from './constant/app-toggle-size.constant';

export const AppToggleStyles = StyleSheet.create(() => ({
    knob: {
        borderRadius: AppToggleKnobSize / 2,
        height: AppToggleKnobSize,
        left: AppToggleKnobInset,
        position: 'absolute',
        top: AppToggleKnobInset,
        width: AppToggleKnobSize
    },
    pressable: {
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    },
    track: {
        borderCurve: 'continuous',
        borderRadius: AppToggleTrackHeight / 2,
        direction: 'ltr',
        height: AppToggleTrackHeight,
        overflow: 'hidden',
        width: AppToggleTrackWidth
    },
    trackFill: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    }
}));
