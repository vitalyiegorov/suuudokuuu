import { StyleSheet } from 'react-native-unistyles';

export const RatingExplainerSheetScreenStyles = StyleSheet.create(theme => ({
    sheetBackground: {
        backgroundColor: theme.colors.background
    },
    sheetContent: {
        paddingTop: theme.spacing.lg
    }
}));
