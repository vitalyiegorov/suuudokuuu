import { isDefined } from '@rnw-community/shared';

import { resolvePageHeadline } from '../../utils/resolve-page-headline.util';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { UpdatedDate } from '../updated-date/updated-date';

import type { PageMetadataInterface } from '../../interfaces/page-metadata.interface';
import type { ReactNode } from 'react';

interface Props {
    readonly metadata: PageMetadataInterface;
    readonly children?: ReactNode;
}

export const PageHeader = ({ children, metadata }: Props) => {
    const breadcrumbs = isDefined(children) ? <Breadcrumbs>{children}</Breadcrumbs> : null;

    return (
        <>
            {breadcrumbs}
            <h1>{resolvePageHeadline(metadata)}</h1>
            <UpdatedDate updatedAt={metadata.updatedAt} />
        </>
    );
};
