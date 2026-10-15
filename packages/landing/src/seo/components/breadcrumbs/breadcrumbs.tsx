import { useLingui } from '@lingui/react/macro';

import { extractNodeText } from '../../utils/extract-node-text.util';
import { findSlots } from '../../utils/find-slots.util';
import { BreadcrumbListItem } from '../breadcrumb-list-item/breadcrumb-list-item';
import { BreadcrumbListSchema } from '../breadcrumb-list-schema/breadcrumb-list-schema';
import { BreadcrumbsItem } from '../breadcrumbs-item/breadcrumbs-item';

import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export const Breadcrumbs = ({ children }: Props) => {
    const { t } = useLingui();
    const items = findSlots(children, BreadcrumbListItem);

    return (
        <nav aria-label={t`Breadcrumb`} className="breadcrumbs">
            <BreadcrumbListSchema>{children}</BreadcrumbListSchema>
            <ol className="breadcrumbs__list">
                {items.map(item => (
                    <BreadcrumbsItem key={extractNodeText(item.props.children)} path={item.props.path}>
                        {item.props.children}
                    </BreadcrumbsItem>
                ))}
            </ol>
        </nav>
    );
};
