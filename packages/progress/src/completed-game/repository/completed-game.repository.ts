import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Reactivity from 'effect/reactivity/Reactivity';
import * as Schema from 'effect/Schema';
import * as SqlClient from 'effect/sql/SqlClient';
import * as SqlSchema from 'effect/sql/SqlSchema';

import { ReactivityKeyEnum } from '../../@generic/enum/reactivity-key.enum';
import { DifficultySchema } from '../../@generic/schema/difficulty.schema';
import { CompletedGameSchema } from '../schema/completed-game.schema';

import type { DifficultyEnum } from '@suuudokuuu/generator';

const maxCompletedGamesPerDifficulty = 20;

export class CompletedGameRepository extends Context.Service<CompletedGameRepository>()('@suuudokuuu/progress/CompletedGameRepository', {
    make: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const reactivity = yield* Reactivity.Reactivity;
        const findAllGames = SqlSchema.findAll({
            Request: Schema.Void,
            Result: CompletedGameSchema,
            execute: () => sql`SELECT * FROM completed_games ORDER BY completed_at DESC, id DESC`
        });
        const findGamesByDifficulty = SqlSchema.findAll({
            Request: DifficultySchema,
            Result: CompletedGameSchema,
            execute: difficulty => sql`SELECT * FROM completed_games WHERE difficulty = ${difficulty} ORDER BY completed_at DESC, id DESC`
        });
        const insertGame = SqlSchema.void({
            Request: CompletedGameSchema,
            execute: game => sql`INSERT INTO completed_games ${sql.insert(game)}`
        });
        const trimGames = (difficulty: DifficultyEnum) => sql`
            DELETE FROM completed_games WHERE difficulty = ${difficulty} AND id NOT IN (
                SELECT id FROM completed_games WHERE difficulty = ${difficulty}
                ORDER BY completed_at DESC, id DESC LIMIT ${maxCompletedGamesPerDifficulty}
            )
        `;

        return {
            findAll: findAllGames().pipe(Effect.orDie),
            findByDifficulty: (difficulty: DifficultyEnum) => findGamesByDifficulty(difficulty).pipe(Effect.orDie),
            insert: (game: typeof CompletedGameSchema.Type) =>
                reactivity
                    .mutation(
                        [ReactivityKeyEnum.CompletedGames],
                        sql.withTransaction(insertGame(game).pipe(Effect.andThen(trimGames(game.difficulty))))
                    )
                    .pipe(Effect.orDie),
            removeAll: reactivity.mutation([ReactivityKeyEnum.CompletedGames], sql`DELETE FROM completed_games`).pipe(Effect.orDie)
        };
    })
}) {
    static readonly layer = Layer.effect(CompletedGameRepository, CompletedGameRepository.make);
}
