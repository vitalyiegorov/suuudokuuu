import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Reactivity from 'effect/reactivity/Reactivity';
import * as Schema from 'effect/Schema';
import * as SqlClient from 'effect/sql/SqlClient';
import * as SqlSchema from 'effect/sql/SqlSchema';

import { ReactivityKeyEnum } from '../../@generic/enum/reactivity-key.enum';
import { CampaignProgressSchema } from '../schema/campaign-progress.schema';
import { TechniqueMasterySchema } from '../schema/technique-mastery.schema';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export class CampaignRepository extends Context.Service<CampaignRepository>()('@suuudokuuu/progress/CampaignRepository', {
    make: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const reactivity = yield* Reactivity.Reactivity;
        const findMastery = SqlSchema.findAll({
            Request: Schema.Void,
            Result: TechniqueMasterySchema,
            execute: () => sql`SELECT * FROM technique_mastery ORDER BY technique`
        });
        const findProgress = SqlSchema.findAll({
            Request: Schema.Void,
            Result: CampaignProgressSchema,
            execute: () => sql`SELECT * FROM campaign_progress ORDER BY technique`
        });
        const replaceProgress = SqlSchema.void({
            Request: CampaignProgressSchema,
            execute: progress => sql`INSERT OR REPLACE INTO campaign_progress ${sql.insert(progress)}`
        });

        return {
            getMastery: findMastery().pipe(Effect.orDie),
            getProgress: findProgress().pipe(Effect.orDie),
            saveProgress: (progress: typeof CampaignProgressSchema.Type) =>
                reactivity.mutation([ReactivityKeyEnum.CAMPAIGN_PROGRESS], replaceProgress(progress)).pipe(Effect.orDie),
            updateMastery: (technique: SolutionTechniqueEnum, seenDelta: number, unassistedDelta: number) =>
                reactivity
                    .mutation(
                        [ReactivityKeyEnum.TECHNIQUE_MASTERY],
                        sql`
                    INSERT INTO technique_mastery (technique, seen_count, unassisted_count)
                    VALUES (${technique}, MAX(0, ${seenDelta}), MAX(0, ${unassistedDelta}))
                    ON CONFLICT (technique) DO UPDATE SET
                        seen_count = MAX(0, seen_count + ${seenDelta}),
                        unassisted_count = MAX(0, unassisted_count + ${unassistedDelta})
                `
                    )
                    .pipe(Effect.orDie)
        };
    })
}) {
    static readonly layer = Layer.effect(CampaignRepository, CampaignRepository.make);
}
