import { DIFFICULTY_NAMES } from '../../../difficulty/constants/difficulty-name.constant';
import { TECHNIQUE_LADDER } from '../../constants/technique-ladder.constant';
import { getTechniqueUsage, getTierTechniqueReports } from '../../utils/get-tier-technique-reports.util';
import { TechniqueFrequencyRow } from '../technique-frequency-row/technique-frequency-row';

import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export const TechniqueFrequencyTable = ({ children }: Props) => {
    const reports = getTierTechniqueReports();
    const techniques = TECHNIQUE_LADDER.filter(technique => reports.some(report => getTechniqueUsage(report, technique) > 0));

    return (
        <div className="data-table__scroll">
            <table className="data-table">
                <caption className="data-table__caption">{children}</caption>
                <thead>
                    <tr>
                        <th scope="col">Technique</th>
                        {reports.map(report => (
                            <th key={report.difficulty} scope="col">
                                {DIFFICULTY_NAMES[report.difficulty]}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {techniques.map(technique => (
                        <TechniqueFrequencyRow key={technique} reports={reports} technique={technique} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
