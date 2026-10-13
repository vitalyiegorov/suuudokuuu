import { StyleSheet } from 'react-native-unistyles';

export const campaignStyles = StyleSheet.create(theme => ({
    content: { padding: 20, gap: 20, width: '100%', maxWidth: 700, alignSelf: 'center' },
    card: { padding: 18, gap: 12, borderRadius: 18, backgroundColor: theme.colors.surface.raised },
    heading: { fontSize: 26, fontWeight: '700' },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    board: { width: '100%', alignItems: 'center' }
}));
