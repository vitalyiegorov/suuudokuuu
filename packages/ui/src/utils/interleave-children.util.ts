import { Children, createElement, Fragment, isValidElement } from 'react';

import type { ReactElement, ReactNode } from 'react';

export const interleaveChildren = (children: ReactNode, separator: ReactElement): ReactNode[] =>
    Children.toArray(children).flatMap((child, index) => {
        if (index === 0) {
            return [child];
        }

        const separatorKey = isValidElement(child) && child.key !== null ? `${child.key}-separator` : `${index}-separator`;

        return [createElement(Fragment, { key: separatorKey }, separator), child];
    });
