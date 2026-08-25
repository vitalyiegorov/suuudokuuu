import { DifficultyEnum } from '@suuudokuuu/generator';

import type { GameHintAvailabilityInterface } from '../interface/game-hint-availability.interface';

const gatedDifficulties: DifficultyEnum[] = [DifficultyEnum.Nightmare, DifficultyEnum.Hell, DifficultyEnum.Infinity];

export const gameIsHintAvailable = ({
    difficulty,
    isChallengeRun,
    allowHintsOnHardDifficulties
}: GameHintAvailabilityInterface): boolean => {
    if (isChallengeRun) {
        return false;
    }

    return allowHintsOnHardDifficulties || !gatedDifficulties.includes(difficulty);
};
