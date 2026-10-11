import { assert, describe, it } from '@effect/vitest';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import * as Effect from 'effect/Effect';
import * as Exit from 'effect/Exit';
import * as SqlClient from 'effect/sql/SqlClient';

import { ReactivityKeyEnum } from '../../src/@generic/enum/reactivity-key.enum';
import { campaignLessons } from '../../src/campaign/constant/campaign-lessons.constant';
import { CampaignRepository } from '../../src/campaign/repository/campaign.repository';
import { CampaignService } from '../../src/campaign/service/campaign.service';
import { ProgressTestLayer } from '../progress-test.layer';
import { trackInvalidations } from '../track-invalidations.util';

const [firstLesson, secondLesson] = campaignLessons;

describe('CampaignService', () => {
    it.effect('observes each teaching lesson only once', () =>
        Effect.gen(function* () {
            const campaignService = yield* CampaignService;
            const campaignRepository = yield* CampaignRepository;

            yield* campaignService.observeLesson(firstLesson.technique);
            yield* campaignService.observeLesson(firstLesson.technique);

            assert.deepStrictEqual(yield* campaignRepository.getMastery, [
                { technique: firstLesson.technique, seenCount: 1, unassistedCount: 0 }
            ]);
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('persists distinct practices once and unlocks the next lesson after two independent completions', () =>
        Effect.gen(function* () {
            const campaignService = yield* CampaignService;
            const campaignRepository = yield* CampaignRepository;
            const invalidations = yield* trackInvalidations;

            assert.deepStrictEqual(yield* campaignService.getUnlockedTechniques, [firstLesson.technique]);
            assert.isFalse(yield* campaignService.completePractice(secondLesson.technique, secondLesson.practices[0].id, false));
            assert.isFalse(yield* campaignService.completePractice(firstLesson.technique, 'unknown-practice', false));
            assert.deepStrictEqual(yield* campaignService.getUnlockedTechniques, [firstLesson.technique]);
            assert.isTrue(yield* campaignService.completePractice(firstLesson.technique, firstLesson.practices[0].id, false));
            assert.isTrue(yield* campaignService.completePractice(firstLesson.technique, firstLesson.practices[0].id, false));
            assert.deepStrictEqual(yield* campaignService.getUnlockedTechniques, [firstLesson.technique]);
            assert.isTrue(yield* campaignService.completePractice(firstLesson.technique, firstLesson.practices[1].id, false));
            assert.deepStrictEqual(yield* campaignService.getUnlockedTechniques, [firstLesson.technique, secondLesson.technique]);
            assert.deepStrictEqual(yield* campaignRepository.getMastery, [
                { technique: firstLesson.technique, seenCount: 2, unassistedCount: 2 }
            ]);
            assert.deepStrictEqual(yield* campaignRepository.getProgress, [
                {
                    technique: firstLesson.technique,
                    teachingSeen: false,
                    completedPracticeIds: firstLesson.practices.map(practice => practice.id),
                    unassistedPracticeIds: firstLesson.practices.map(practice => practice.id)
                }
            ]);
            assert.include(invalidations, ReactivityKeyEnum.CAMPAIGN_PROGRESS);
            assert.include(invalidations, ReactivityKeyEnum.TECHNIQUE_MASTERY);
        }).pipe(Effect.scoped, Effect.provide(ProgressTestLayer))
    );

    it.effect('upgrades assisted practices once after an unassisted retry and unlocks the next lesson', () =>
        Effect.gen(function* () {
            const campaignService = yield* CampaignService;
            const campaignRepository = yield* CampaignRepository;

            yield* campaignService.observeLesson(firstLesson.technique);
            yield* campaignService.completePractice(firstLesson.technique, firstLesson.practices[0].id, true);
            yield* campaignService.completePractice(firstLesson.technique, firstLesson.practices[1].id, true);
            assert.isTrue(yield* campaignService.completePractice(firstLesson.technique, firstLesson.practices[0].id, true));
            assert.deepStrictEqual(yield* campaignRepository.getMastery, [
                { technique: firstLesson.technique, seenCount: 3, unassistedCount: 0 }
            ]);

            assert.deepStrictEqual(yield* campaignService.getUnlockedTechniques, [firstLesson.technique]);
            assert.deepStrictEqual(
                (yield* campaignRepository.getProgress)[0].completedPracticeIds,
                firstLesson.practices.map(practice => practice.id)
            );
            assert.deepStrictEqual((yield* campaignRepository.getProgress)[0].unassistedPracticeIds, []);
            assert.isTrue(yield* campaignService.completePractice(firstLesson.technique, firstLesson.practices[0].id, false));
            assert.isTrue(yield* campaignService.completePractice(firstLesson.technique, firstLesson.practices[0].id, false));
            yield* campaignService.completePractice(firstLesson.technique, firstLesson.practices[1].id, false);

            assert.deepStrictEqual(yield* campaignService.getUnlockedTechniques, [firstLesson.technique, secondLesson.technique]);
            assert.deepStrictEqual(yield* campaignRepository.getMastery, [
                { technique: firstLesson.technique, seenCount: 3, unassistedCount: 2 }
            ]);
            assert.deepStrictEqual(
                (yield* campaignRepository.getProgress)[0].unassistedPracticeIds,
                firstLesson.practices.map(practice => practice.id)
            );
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('ignores unknown stored practice IDs when computing unlocks', () =>
        Effect.gen(function* () {
            const campaignService = yield* CampaignService;
            const campaignRepository = yield* CampaignRepository;

            yield* campaignRepository.saveProgress({
                technique: firstLesson.technique,
                teachingSeen: false,
                completedPracticeIds: ['unverified-first', 'unverified-second'],
                unassistedPracticeIds: ['unverified-first', 'unverified-second']
            });

            assert.deepStrictEqual(yield* campaignService.getUnlockedTechniques, [firstLesson.technique]);
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('rolls back practice completion if the mastery write fails', () =>
        Effect.gen(function* () {
            const sql = yield* SqlClient.SqlClient;
            const campaignService = yield* CampaignService;
            const campaignRepository = yield* CampaignRepository;

            yield* sql`
                CREATE TRIGGER reject_mastery BEFORE INSERT ON technique_mastery
                BEGIN SELECT RAISE(ABORT, 'mastery write rejected'); END
            `;

            assert.isTrue(
                Exit.isFailure(
                    yield* Effect.exit(campaignService.completePractice(firstLesson.technique, firstLesson.practices[0].id, false))
                )
            );
            assert.deepStrictEqual(yield* campaignRepository.getProgress, []);
            assert.deepStrictEqual(yield* campaignRepository.getMastery, []);
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('persists observed techniques and clamps undo deltas at zero', () =>
        Effect.gen(function* () {
            const campaignRepository = yield* CampaignRepository;

            yield* campaignRepository.updateMastery(SolutionTechniqueEnum.NakedSingle, 1, 1);
            yield* campaignRepository.updateMastery(SolutionTechniqueEnum.NakedSingle, 0, -1);
            yield* campaignRepository.updateMastery(SolutionTechniqueEnum.NakedSingle, 0, -1);

            assert.deepStrictEqual(yield* campaignRepository.getMastery, [
                { technique: SolutionTechniqueEnum.NakedSingle, seenCount: 1, unassistedCount: 0 }
            ]);
        }).pipe(Effect.provide(ProgressTestLayer))
    );
});
