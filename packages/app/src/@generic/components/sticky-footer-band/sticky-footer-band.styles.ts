import { ContentWidthConstant } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native';

export const StickyFooterBandStyles = StyleSheet.create({
    container: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        zIndex: 3
    },
    content: {
        alignSelf: 'center',
        maxWidth: ContentWidthConstant.standard,
        width: '100%',
        zIndex: 3
    }
});
