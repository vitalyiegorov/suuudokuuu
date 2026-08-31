import { createSlot } from '../../utils/create-slot.util';

import type { SlotComponentType } from '../../types/slot-component.type';
import type { ReactNode } from 'react';

interface Props {
    name: string;
    children: ReactNode;
}

export const HowToStep: SlotComponentType<Props> = createSlot();
