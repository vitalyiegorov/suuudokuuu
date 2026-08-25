import { isDefined } from '@rnw-community/shared';

import { TechniqueLink } from '../../../techniques/components/technique-link/technique-link';

import type { TierTechniqueReportInterface } from '../../interfaces/tier-technique-report.interface';

interface Props {
    report: TierTechniqueReportInterface;
}

export const TierBandRequirement = ({ report }: Props) => (
    <>
        {isDefined(report.simplerLadderMaxTechnique) ? (
            <>
                past <TechniqueLink technique={report.simplerLadderMaxTechnique} />,{' '}
            </>
        ) : null}
        {isDefined(report.bandLadderMaxTechnique) ? (
            <>
                up to <TechniqueLink technique={report.bandLadderMaxTechnique} />
            </>
        ) : (
            'open ended'
        )}
    </>
);
