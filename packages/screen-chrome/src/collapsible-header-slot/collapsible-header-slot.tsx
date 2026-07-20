import { ReactNode } from 'react';
import { View } from 'react-native';

import { collapsibleHeaderSlotStyles } from './collapsible-header-slot.styles';

interface Props {
    readonly children?: ReactNode;
}

export const CollapsibleHeaderSlot = ({ children }: Props): ReactNode => <View style={collapsibleHeaderSlotStyles.slot}>{children}</View>;
