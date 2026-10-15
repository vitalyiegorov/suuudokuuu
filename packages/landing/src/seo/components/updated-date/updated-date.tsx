import { Trans } from '@lingui/react/macro';

import { getActiveLocale } from '../../../i18n/utils/get-active-locale.util';
import { formatPageDate } from '../../utils/format-page-date.util';

interface Props {
    updatedAt: string;
}

export const UpdatedDate = ({ updatedAt }: Props) => {
    const formattedDate = formatPageDate(updatedAt, getActiveLocale());

    return (
        <p className="page-updated">
            <Trans>
                Updated <time dateTime={updatedAt}>{formattedDate}</time>
            </Trans>
        </p>
    );
};
