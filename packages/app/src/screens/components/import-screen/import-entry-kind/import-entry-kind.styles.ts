import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';

export const ImportEntryKindStyles = StyleSheet.create((theme, rt) => ({
    container: { flexDirection: 'row', height: rt.screen.height < ImportCompactFrameHeightConstant ? 44 : 52, width: '100%' },
    track: {
        ...StyleSheet.absoluteFill,
        top: theme.spacing.xs,
        bottom: theme.spacing.xs,
        backgroundColor: theme.colors.surface.subtle,
        borderRadius: theme.radius.pill
    }
}));
