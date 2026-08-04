import { StyleSheet } from 'react-native-unistyles';

import { PageHorizontalPaddingConstant } from '../../../@generic/constants/page-horizontal-padding.constant';
import { pageColumnScrollViewStyle } from '../../utils/page-column-screen-styles.util';

export const ThemeEditorScreenStyles = StyleSheet.create(theme => ({
    content: {
        alignItems: 'center',
        paddingHorizontal: PageHorizontalPaddingConstant
    },
    scrollContent: { gap: 16, paddingVertical: 16 },
    scrollView: pageColumnScrollViewStyle(theme),
    nameInput: { borderRadius: 8, borderWidth: 1, fontSize: 16, paddingHorizontal: 12, paddingVertical: 10 },
    variantRow: { flexDirection: 'row', gap: 12 },
    variantButton: { flex: 1 },
    warning: { fontSize: 13 },
    actionsRow: { flexDirection: 'row', gap: 12 },
    actionButton: { flex: 1 },
    footer: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingTop: 12 },
    saveButton: { flex: 1 }
}));
