import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as SqlClient from 'effect/sql/SqlClient';

import { campaignLessons } from '../constant/campaign-lessons.constant';
import { CampaignRepository } from '../repository/campaign.repository';
import { getUnlockedCampaignTechniques } from '../utils/get-unlocked-campaign-techniques.util';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export class CampaignService extends Context.Service<CampaignService>()('@suuudokuuu/progress/CampaignService', {
    make: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const campaignRepository = yield* CampaignRepository;

        return {
            observeLesson: Effect.fn('CampaignService.observeLesson')(
                function* (technique: SolutionTechniqueEnum) {
                    const progress = yield* campaignRepository.getProgress;
                    const previous = progress.find(row => row.technique === technique);

                    if (previous?.teachingSeen || !getUnlockedCampaignTechniques(progress).includes(technique)) {
                        return false;
                    }

                    yield* campaignRepository.saveProgress({
                        technique,
                        teachingSeen: true,
                        completedPracticeIds: previous?.completedPracticeIds ?? [],
                        unassistedPracticeIds: previous?.unassistedPracticeIds ?? []
                    });
                    yield* campaignRepository.updateMastery(technique, 1, 0);

                    return true;
                },
                effect => sql.withTransaction(effect),
                Effect.orDie
            ),
            getUnlockedTechniques: campaignRepository.getProgress.pipe(Effect.map(getUnlockedCampaignTechniques)),
            completePractice: Effect.fn('CampaignService.completePractice')(
                function* (technique: SolutionTechniqueEnum, practiceId: string, assisted: boolean) {
                    const lesson = campaignLessons.find(entry => entry.technique === technique);
                    const progress = yield* campaignRepository.getProgress;

                    if (
                        !lesson?.practices.some(practice => practice.id === practiceId) ||
                        !getUnlockedCampaignTechniques(progress).includes(technique)
                    ) {
                        return false;
                    }

                    const previous = progress.find(row => row.technique === technique);
                    const completedPracticeIds = previous?.completedPracticeIds ?? [];
                    const unassistedPracticeIds = previous?.unassistedPracticeIds ?? [];
                    const isNewCompletion = !completedPracticeIds.includes(practiceId);
                    const isNewUnassistedCompletion = !assisted && !unassistedPracticeIds.includes(practiceId);

                    if (!isNewCompletion && !isNewUnassistedCompletion) {
                        return true;
                    }

                    yield* campaignRepository.saveProgress({
                        technique,
                        teachingSeen: previous?.teachingSeen ?? false,
                        completedPracticeIds: isNewCompletion ? [...completedPracticeIds, practiceId] : completedPracticeIds,
                        unassistedPracticeIds: isNewUnassistedCompletion ? [...unassistedPracticeIds, practiceId] : unassistedPracticeIds
                    });
                    yield* campaignRepository.updateMastery(technique, Number(isNewCompletion), Number(isNewUnassistedCompletion));

                    return true;
                },
                effect => sql.withTransaction(effect),
                Effect.orDie
            )
        };
    })
}) {
    static readonly layer = Layer.effect(CampaignService, CampaignService.make).pipe(Layer.provide(CampaignRepository.layer));
}
