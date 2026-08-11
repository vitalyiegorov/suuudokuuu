import { getTechniqueUsage } from '../../utils/get-tier-technique-reports.util';

import type { TierTechniqueReportInterface } from '../../interfaces/tier-technique-report.interface';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    report: TierTechniqueReportInterface;
    technique: SolutionTechniqueEnum;
}

export const TechniqueFrequencyCell = ({ report, technique }: Props) => {
    const puzzleCount = getTechniqueUsage(report, technique);
    const content = puzzleCount === 0 ? '—' : puzzleCount;

    return <td>{content}</td>;
};
