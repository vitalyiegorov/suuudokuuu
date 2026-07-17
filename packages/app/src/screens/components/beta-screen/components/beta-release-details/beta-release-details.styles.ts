import { StyleSheet } from 'react-native';

export const BetaReleaseDetailsStyles = StyleSheet.create({
    card: {
        gap: 20,
        width: '100%'
    },
    checksum: {
        flexShrink: 1,
        fontFamily: 'monospace',
        fontSize: 12,
        lineHeight: 18,
        width: '100%'
    },
    checksumGroup: {
        gap: 6,
        minWidth: 0,
        width: '100%'
    },
    checksumLabel: {
        fontSize: 13,
        fontWeight: '800',
        lineHeight: 18,
        textTransform: 'uppercase'
    },
    commitButton: {
        alignSelf: 'flex-start'
    },
    heading: {
        fontSize: 24,
        fontWeight: '900',
        lineHeight: 30
    },
    label: {
        fontSize: 13,
        fontWeight: '800',
        lineHeight: 18,
        textTransform: 'uppercase'
    },
    metadata: {
        gap: 6
    },
    notes: {
        fontSize: 15,
        lineHeight: 22
    },
    section: {
        gap: 8,
        minWidth: 0,
        width: '100%'
    },
    value: {
        fontSize: 15,
        lineHeight: 21
    }
});
