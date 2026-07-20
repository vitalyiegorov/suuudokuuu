import { ReactNode } from 'react';
import { View } from 'react-native';

import { collapsibleHeaderTitleSlotStyles } from './collapsible-header-title-slot.styles';

interface Props {
    readonly children: ReactNode;
}

export const CollapsibleHeaderTitleSlot = ({ children }: Props): ReactNode => (
    <View style={collapsibleHeaderTitleSlotStyles.slot} pointerEvents="box-none">
        {children}
    </View>
);
