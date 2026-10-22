import { StyleSheet } from 'react-native-unistyles';

export const RatingExplainerSheetScreenStyles = StyleSheet.create(theme => ({
    sheetContent: {
        paddingTop: theme.spacing.lg
    },
    sheetHeader: {
        alignItems: 'flex-end',
        paddingHorizontal: theme.spacing.lg
    }
}));
