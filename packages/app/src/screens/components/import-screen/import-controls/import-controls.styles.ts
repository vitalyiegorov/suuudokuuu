import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';

export const ImportControlsStyles = StyleSheet.create((theme, rt) => ({
    controls: { width: '100%' },
    keys: { gap: rt.screen.height < ImportCompactFrameHeightConstant ? 6 : theme.spacing.sm },
    legend: { ...StyleSheet.absoluteFill, alignItems: 'center', paddingTop: theme.spacing.lg }
}));
