import Link from 'next/link';

import { DIFFICULTY_NAMES } from '../../../difficulty/constants/difficulty-name.constant';
import { DIFFICULTY_PAGE_PATHS } from '../../../difficulty/constants/difficulty-page-path.constant';
import { TechniqueLink } from '../../../techniques/components/technique-link/technique-link';
import { SeRatingRange } from '../se-rating-range/se-rating-range';
import { TierBandRequirement } from '../tier-band-requirement/tier-band-requirement';

import type { TierTechniqueReportInterface } from '../../interfaces/tier-technique-report.interface';

interface Props {
    report: TierTechniqueReportInterface;
}

export const TierLadderRow = ({ report }: Props) => (
    <tr>
        <th scope="row">
            <Link href={DIFFICULTY_PAGE_PATHS[report.difficulty]}>{DIFFICULTY_NAMES[report.difficulty]}</Link>
        </th>
        <td>{report.clueCount}</td>
        <td>
            <TierBandRequirement report={report} />
        </td>
        <td>
            <SeRatingRange report={report} />
        </td>
        <td>
            {report.singlesOnlyPuzzleCount} of {report.sampleSize}
        </td>
        <td>
            <TechniqueLink technique={report.typicalHardestTechnique} />
        </td>
        <td>
            <TechniqueLink technique={report.hardestTechniqueReached} />
        </td>
        <td>
            {report.beyondLadderPuzzleCount} of {report.sampleSize}
        </td>
    </tr>
);
