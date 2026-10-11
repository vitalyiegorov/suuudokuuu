import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as SqlClient from 'effect/sql/SqlClient';

import { campaignLessons } from '../constant/campaign-lessons.constant';
import { CampaignRepository } from '../repository/campaign.repository';

import type { CampaignProgressSchema } from '../schema/campaign-progress.schema';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

const getUnlockedTechniques = (progress: readonly (typeof CampaignProgressSchema.Type)[]) => {
    const unlockedTechniques: SolutionTechniqueEnum[] = [];

    for (const lesson of campaignLessons) {
        unlockedTechniques.push(lesson.technique);

        const completedPractices = progress.find(row => row.technique === lesson.technique)?.unassistedPracticeIds ?? [];
        const verifiedCompletions = lesson.practices.filter(practice => completedPractices.includes(practice.id));

        if (verifiedCompletions.length < 2) {
            break;
        }
    }

    return unlockedTechniques;
};

export class CampaignService extends Context.Service<CampaignService>()('@suuudokuuu/progress/CampaignService', {
    make: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const campaignRepository = yield* CampaignRepository;

        return {
            recordSeen: (technique: SolutionTechniqueEnum) => campaignRepository.updateMastery(technique, 1, 0),
            getUnlockedTechniques: campaignRepository.getProgress.pipe(Effect.map(getUnlockedTechniques)),
            completePractice: Effect.fn('CampaignService.completePractice')(
                function* (technique: SolutionTechniqueEnum, practiceId: string, assisted: boolean) {
                    const lesson = campaignLessons.find(entry => entry.technique === technique);
                    const progress = yield* campaignRepository.getProgress;

                    if (
                        !lesson?.practices.some(practice => practice.id === practiceId) ||
                        !getUnlockedTechniques(progress).includes(technique)
                    ) {
                        return false;
                    }

                    const previous = progress.find(row => row.technique === technique);
                    const completedPracticeIds = previous?.completedPracticeIds ?? [];
                    const unassistedPracticeIds = previous?.unassistedPracticeIds ?? [];
                    const isNewCompletion = !completedPracticeIds.includes(practiceId);
                    const isNewUnassistedCompletion = !assisted && !unassistedPracticeIds.includes(practiceId);

                    if (!isNewCompletion && !isNewUnassistedCompletion) {
                        return false;
                    }

                    yield* campaignRepository.saveProgress({
                        technique,
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
