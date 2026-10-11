import { useAtomValue } from '@effect/atom-react/Hooks';
import { CampaignRepository, CampaignService, ReactivityKeyEnum } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as AsyncResult from 'effect/reactivity/AsyncResult';

import { databaseQueryAtom } from '../../@generic/utils/database-query-atom.util';

const campaignAtom = databaseQueryAtom(
    [ReactivityKeyEnum.CAMPAIGN_PROGRESS, ReactivityKeyEnum.TECHNIQUE_MASTERY],
    Effect.gen(function* () {
        const repository = yield* CampaignRepository;
        const service = yield* CampaignService;

        return {
            mastery: yield* repository.getMastery,
            progress: yield* repository.getProgress,
            unlocked: yield* service.getUnlockedTechniques
        };
    })
);

export const useCampaign = () => AsyncResult.getOrElse(useAtomValue(campaignAtom), () => ({ mastery: [], progress: [], unlocked: [] }));
