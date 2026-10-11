import { useAtomValue } from '@effect/atom-react/Hooks';
import { CampaignRepository, getUnlockedCampaignTechniques, ReactivityKeyEnum } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';

import { databaseQueryAtom } from '../../@generic/utils/database-query-atom.util';

const campaignAtom = databaseQueryAtom(
    [ReactivityKeyEnum.CAMPAIGN_PROGRESS, ReactivityKeyEnum.TECHNIQUE_MASTERY],
    Effect.gen(function* () {
        const repository = yield* CampaignRepository;
        const progress = yield* repository.getProgress;

        return {
            mastery: yield* repository.getMastery,
            progress,
            unlocked: getUnlockedCampaignTechniques(progress)
        };
    }).pipe(Effect.tapCause(Effect.logError))
);

export const useCampaign = () => useAtomValue(campaignAtom);
