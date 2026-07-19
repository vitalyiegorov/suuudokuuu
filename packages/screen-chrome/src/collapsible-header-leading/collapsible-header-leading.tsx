import { ReactNode } from 'react';

import { CollapsibleHeaderSlot } from '../collapsible-header-slot/collapsible-header-slot';

interface Props {
    readonly children?: ReactNode;
}

export const CollapsibleHeaderLeading = ({ children }: Props): ReactNode => <CollapsibleHeaderSlot>{children}</CollapsibleHeaderSlot>;
