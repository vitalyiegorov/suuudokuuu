import { TechniqueLink } from '../../../techniques/components/technique-link/technique-link';
import { TechniqueFrequencyCell } from '../technique-frequency-cell/technique-frequency-cell';

import type { TierTechniqueReportInterface } from '../../interfaces/tier-technique-report.interface';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    technique: SolutionTechniqueEnum;
    reports: TierTechniqueReportInterface[];
}

export const TechniqueFrequencyRow = ({ reports, technique }: Props) => (
    <tr>
        <th scope="row">
            <TechniqueLink technique={technique} />
        </th>
        {reports.map(report => (
            <TechniqueFrequencyCell key={report.difficulty} report={report} technique={technique} />
        ))}
    </tr>
);
