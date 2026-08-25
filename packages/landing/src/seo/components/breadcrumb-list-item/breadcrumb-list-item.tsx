import { createSlot } from '../../utils/create-slot.util';

import type { SlotComponentType } from '../../types/slot-component.type';
import type { ReactNode } from 'react';

interface Props {
    path?: string;
    children: ReactNode;
}

export const BreadcrumbListItem: SlotComponentType<Props> = createSlot();
