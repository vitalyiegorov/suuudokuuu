import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';

export const ImportEntryKindStyles = StyleSheet.create((theme, rt) => ({
    track: {
        backgroundColor: theme.colors.surface.subtle,
        borderRadius: theme.radius.pill,
        flexDirection: 'row',
        height: rt.screen.height < ImportCompactFrameHeightConstant ? 36 : 44,
        padding: theme.spacing.xs,
        width: '100%'
    }
}));
