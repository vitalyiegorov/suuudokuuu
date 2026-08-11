import { Children, isValidElement } from 'react';

import type { ReactElement, ReactNode } from 'react';

export const findSlots = <SlotProps>(children: ReactNode, slot: (props: SlotProps) => unknown): ReactElement<SlotProps>[] =>
    Children.toArray(children).filter((child): child is ReactElement<SlotProps> => isValidElement(child) && child.type === slot);
