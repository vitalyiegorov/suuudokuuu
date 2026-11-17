import { Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';

export const ImportReviewGuidanceStyles = StyleSheet.create((theme, rt) => ({
    guidance: {
        ...(rt.screen.height < ImportCompactFrameHeightConstant && Platform.OS === 'web' && { lineHeight: theme.typography.size.sm }),
        color: theme.colors.text.hint,
        fontSize: theme.typography.size.sm,
        textAlign: 'center'
    }
}));
