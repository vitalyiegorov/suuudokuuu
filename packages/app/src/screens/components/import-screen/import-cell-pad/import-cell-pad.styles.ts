import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';

export const ImportCellPadStyles = StyleSheet.create((theme, rt) => ({
    label: { textAlign: 'center', color: theme.colors.surface.subtleText, fontSize: theme.typography.size.md, fontWeight: '700' },
    button: {
        flexBasis: '17%',
        flexGrow: 1,
        minHeight: rt.screen.height < ImportCompactFrameHeightConstant ? 36 : 44,
        paddingHorizontal: 0
    },
    pad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        width: '100%'
    }
}));
