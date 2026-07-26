import { StyleSheet } from 'react-native-unistyles';

import { PageHorizontalPaddingConstant } from '../../@generic/constants/page-horizontal-padding.constant';

export const ScoringScreenStyles = StyleSheet.create(theme => ({
    content: {
        alignItems: 'center',
        paddingHorizontal: PageHorizontalPaddingConstant
    },
    scrollView: {
        maxWidth: theme.contentWidth.standard,
        width: '100%'
    },
    scrollViewContent: {
        flexDirection: 'column',
        gap: theme.spacing.sm
    },
    section: {
        marginBottom: 16,
        width: '100%'
    },
    listItem: {
        marginLeft: 12,
        marginVertical: 4
    }
}));
