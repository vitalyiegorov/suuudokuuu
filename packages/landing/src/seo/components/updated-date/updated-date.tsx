import { formatPageDate } from '../../utils/format-page-date.util';

interface Props {
    updatedAt: string;
}

export const UpdatedDate = ({ updatedAt }: Props) => (
    <p className="page-updated">
        Updated <time dateTime={updatedAt}>{formatPageDate(updatedAt)}</time>
    </p>
);
