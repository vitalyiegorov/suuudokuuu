import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';

export const ImportControlsStyles = StyleSheet.create((theme, rt) => ({
    controls: { width: '100%', flexGrow: 1, justifyContent: 'flex-end' },
    keys: { width: '100%' },
    legend: {
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        paddingTop: rt.screen.height < ImportCompactFrameHeightConstant ? theme.spacing.sm : theme.spacing.sm * 2
    }
}));
