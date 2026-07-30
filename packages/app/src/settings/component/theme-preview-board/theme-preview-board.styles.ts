import { StyleSheet } from 'react-native';

export const ThemePreviewBoardStyles = StyleSheet.create({
    container: { borderRadius: 12, gap: 8, padding: 12 },
    row: { flexDirection: 'row', gap: 4 },
    cell: { alignItems: 'center', aspectRatio: 1, borderRadius: 4, borderWidth: 1, flex: 1, justifyContent: 'center' },
    cellText: { fontSize: 18, fontWeight: '500' },
    candidateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 1, padding: 2 },
    candidateText: { fontSize: 8 },
    numpadChip: { alignItems: 'center', borderRadius: 6, borderWidth: 1, flex: 1, justifyContent: 'center', paddingVertical: 6 }
});
