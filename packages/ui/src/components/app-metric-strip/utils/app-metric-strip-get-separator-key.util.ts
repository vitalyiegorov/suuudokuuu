import { isValidElement } from 'react';

import type { ReactNode } from 'react';

export const appMetricStripGetSeparatorKey = (item: ReactNode, index: number): string => {
    if (isValidElement(item) && item.key !== null) {
        return `${item.key}-separator`;
    }

    return `${index}-separator`;
};
