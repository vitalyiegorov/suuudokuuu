import { StyleSheet } from 'react-native-unistyles';

import { WideContentWidthMultiplierConstant } from '../../constant/wide-content-width.constant';

export const ReplayScreenStyles = StyleSheet.create(theme => ({
    container: (sizeClass: 'compact' | 'wide') => ({
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'column',
        gap: 18,
        maxWidth: sizeClass === 'wide' ? theme.contentWidth.standard * WideContentWidthMultiplierConstant : theme.contentWidth.standard,
        paddingBottom: 18,
        paddingHorizontal: 20,
        paddingTop: 18,
        width: '100%'
    }),
    content: (sizeClass: 'compact' | 'wide') => ({
        flex: 1,
        flexDirection: sizeClass === 'wide' ? 'row' : 'column',
        gap: 18
    }),
    fieldWrapper: (sizeClass: 'compact' | 'wide') => ({
        alignItems: 'center',
        flex: sizeClass === 'wide' ? 2 : 1,
        justifyContent: 'center',
        minHeight: 260
    }),
    controlsColumn: {
        flex: 1,
        gap: 18,
        justifyContent: 'center'
    }
}));
