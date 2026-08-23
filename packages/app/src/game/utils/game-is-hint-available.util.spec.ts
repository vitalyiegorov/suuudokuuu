import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { gameIsHintAvailable } from './game-is-hint-available.util';

const teachingDifficulties = [DifficultyEnum.Newbie, DifficultyEnum.Easy, DifficultyEnum.Medium, DifficultyEnum.Hard];
const challengeTierDifficulties = [DifficultyEnum.Nightmare, DifficultyEnum.Hell, DifficultyEnum.Infinity];

describe('gameIsHintAvailable', () => {
    it.each(teachingDifficulties)('offers hints on %s', difficulty => {
        expect.assertions(1);

        expect(gameIsHintAvailable({ difficulty, isChallengeRun: false, allowHintsOnHardDifficulties: false })).toBe(true);
    });

    it.each(challengeTierDifficulties)('hides hints on %s by default', difficulty => {
        expect.assertions(1);

        expect(gameIsHintAvailable({ difficulty, isChallengeRun: false, allowHintsOnHardDifficulties: false })).toBe(false);
    });

    it.each(challengeTierDifficulties)('offers hints on %s once the player opts in', difficulty => {
        expect.assertions(1);

        expect(gameIsHintAvailable({ difficulty, isChallengeRun: false, allowHintsOnHardDifficulties: true })).toBe(true);
    });

    it.each([...teachingDifficulties, ...challengeTierDifficulties])('never offers hints during a %s challenge run', difficulty => {
        expect.assertions(1);

        expect(gameIsHintAvailable({ difficulty, isChallengeRun: true, allowHintsOnHardDifficulties: true })).toBe(false);
    });
});
