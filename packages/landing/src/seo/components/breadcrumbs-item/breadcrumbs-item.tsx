import Link from 'next/link';

import { isNotEmptyString } from '@rnw-community/shared';

import type { ReactNode } from 'react';

interface Props {
    path?: string;
    children: ReactNode;
}

export const BreadcrumbsItem = ({ children, path }: Props) => {
    const hasPath = isNotEmptyString(path);
    const content = hasPath ? <Link href={path}>{children}</Link> : children;
    const isCurrentPage = !hasPath;
    const currentPageProps = { ...(isCurrentPage && ({ 'aria-current': 'page' } as const)) };

    return (
        <li className="breadcrumbs__item" {...currentPageProps}>
            {content}
        </li>
    );
};
