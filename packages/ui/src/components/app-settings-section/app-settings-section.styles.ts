import { StyleSheet } from 'react-native-unistyles';

const AppSettingsSectionInset = 16;
const AppSettingsSectionHairline = 0.5;

export const AppSettingsSectionStyles = StyleSheet.create(theme => ({
    divider: {
        height: AppSettingsSectionHairline,
        marginLeft: AppSettingsSectionInset
    },
    group: {
        borderCurve: 'continuous',
        borderRadius: 22,
        borderWidth: AppSettingsSectionHairline,
        overflow: 'hidden',
        width: '100%'
    },
    section: {
        gap: 7,
        width: '100%'
    },
    title: {
        fontFamily: theme.typography.fontFamily,
        fontSize: 12.5,
        letterSpacing: 0.75,
        lineHeight: 16,
        paddingHorizontal: AppSettingsSectionInset,
        textTransform: 'uppercase'
    }
}));
