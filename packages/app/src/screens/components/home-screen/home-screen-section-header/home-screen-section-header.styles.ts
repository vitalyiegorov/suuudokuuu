import { StyleSheet } from 'react-native';

export const HomeScreenSectionHeaderStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        width: '100%'
    },
    label: {
        fontSize: 13,
        fontWeight: '900',
        lineHeight: 17,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    line: {
        flex: 1,
        height: StyleSheet.hairlineWidth
    }
});
