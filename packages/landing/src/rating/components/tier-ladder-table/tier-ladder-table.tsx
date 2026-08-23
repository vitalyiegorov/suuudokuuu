import { getTierTechniqueReports } from '../../utils/get-tier-technique-reports.util';
import { TierLadderRow } from '../tier-ladder-row/tier-ladder-row';

import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export const TierLadderTable = ({ children }: Props) => (
    <div className="data-table__scroll">
        <table className="data-table">
            <caption className="data-table__caption">{children}</caption>
            <thead>
                <tr>
                    <th scope="col">Tier</th>
                    <th scope="col">Clues</th>
                    <th scope="col">Guaranteed band</th>
                    <th scope="col">SE range</th>
                    <th scope="col">Singles only</th>
                    <th scope="col">Typical hardest step</th>
                    <th scope="col">Hardest step reached</th>
                    <th scope="col">Past our detectors</th>
                </tr>
            </thead>
            <tbody>
                {getTierTechniqueReports().map(report => (
                    <TierLadderRow key={report.difficulty} report={report} />
                ))}
            </tbody>
        </table>
    </div>
);
