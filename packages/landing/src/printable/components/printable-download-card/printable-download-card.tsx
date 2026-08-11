import { isPositiveNumber } from '@rnw-community/shared';

import { getPrintableFileSizeLabel } from '../../utils/get-printable-file-size-label.util';

interface Props {
    title: string;
    fileName: string;
    pageCount: number;
    puzzleCount?: number;
    hasSolutions?: boolean;
}

export const PrintableDownloadCard = ({ fileName, hasSolutions = true, pageCount, puzzleCount, title }: Props) => {
    const fileSizeLabel = getPrintableFileSizeLabel(fileName);
    const puzzleCountFact = isPositiveNumber(puzzleCount) ? <li>{puzzleCount} puzzles</li> : null;
    const solutionsFact = hasSolutions ? <li>Solutions included on the last pages</li> : null;

    return (
        <div className="printable-download">
            <a className="printable-download__cta hero__cta" download href={`/printable/${fileName}`}>
                Download {title} (PDF)
            </a>
            <ul className="printable-download__facts">
                {puzzleCountFact}
                <li>{pageCount} pages</li>
                <li>{fileSizeLabel} PDF, US Letter</li>
                {solutionsFact}
            </ul>
        </div>
    );
};
