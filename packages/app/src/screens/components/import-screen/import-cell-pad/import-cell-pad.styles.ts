import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';

export const ImportCellPadStyles = StyleSheet.create((theme, rt) => ({
    label: { textAlign: 'center', color: theme.colors.surface.subtleText, fontSize: theme.typography.size.md, fontWeight: '700' },
    button: {
        flexBasis: '20%',
        height: rt.screen.height < ImportCompactFrameHeightConstant ? 44 : 52,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.xs * 0.8,
        justifyContent: 'center'
    },
    surface: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        borderColor: theme.colors.surface.border,
        backgroundColor: theme.colors.surface.subtle
    },
    pressed: { opacity: 0.85 },
    pad: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' }
}));
