import { Children, isValidElement } from 'react';

import { isNumber, isString } from '@rnw-community/shared';

import type { ReactNode } from 'react';

const WhitespacePattern = /\s+/gu;

export const extractNodeText = (node: ReactNode): string =>
    Children.toArray(node)
        .map(child => {
            if (isString(child)) {
                return child;
            }

            if (isNumber(child)) {
                return String(child);
            }

            if (isValidElement<{ children?: ReactNode }>(child)) {
                return extractNodeText(child.props.children);
            }

            return '';
        })
        .join('')
        .replace(WhitespacePattern, ' ')
        .trim();
