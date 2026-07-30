import { StyleSheet } from 'react-native';

export const ThemeEditorScreenStyles = StyleSheet.create({
    scrollContent: { gap: 16, padding: 16 },
    nameInput: { borderRadius: 8, borderWidth: 1, fontSize: 16, paddingHorizontal: 12, paddingVertical: 10 },
    variantRow: { flexDirection: 'row', gap: 12 },
    variantButton: { flex: 1 },
    warning: { fontSize: 13 },
    actionsRow: { flexDirection: 'row', gap: 12 },
    actionButton: { flex: 1 },
    footer: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingTop: 12 },
    saveButton: { flex: 1 }
});
