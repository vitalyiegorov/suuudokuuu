import { findSlots } from './find-slots.util';

import type { ReactElement, ReactNode } from 'react';

export const findSlot = <SlotProps>(children: ReactNode, slot: (props: SlotProps) => unknown): ReactElement<SlotProps> | undefined =>
    findSlots<SlotProps>(children, slot)[0];
