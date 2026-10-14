import { Trans } from '@lingui/react';
import { getI18n } from '@lingui/react/server';
import { Children, isValidElement } from 'react';

import { isDefined, isNumber, isString } from '@rnw-community/shared';

import type { TransProps } from '@lingui/react';
import type { ReactNode } from 'react';

const WhitespacePattern = /\s+/gu;

const TransPlaceholderTagPattern = /<\/?\d+>/gu;

const extractTransText = ({ id, values }: Pick<TransProps, 'id' | 'values'>): string => {
    const i18n = getI18n();

    if (!isDefined(i18n)) {
        throw new Error(`Rendering the "${id}" message needs an active locale: call activateLocale() in the route first`);
    }

    return i18n._(id, values).replace(TransPlaceholderTagPattern, '');
};

export const extractNodeText = (node: ReactNode): string =>
    Children.toArray(node)
        .map(child => {
            if (isString(child)) {
                return child;
            }

            if (isNumber(child)) {
                return String(child);
            }

            if (isValidElement<TransProps>(child) && child.type === Trans) {
                return extractTransText(child.props);
            }

            if (isValidElement<{ children?: ReactNode }>(child)) {
                return extractNodeText(child.props.children);
            }

            return '';
        })
        .join('')
        .replace(WhitespacePattern, ' ')
        .trim();
