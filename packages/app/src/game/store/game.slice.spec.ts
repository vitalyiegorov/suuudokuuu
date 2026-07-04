/* eslint-disable lingui/no-unlocalized-strings, @typescript-eslint/no-magic-numbers */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { gameSlice } from './game.slice';
import { initialGameState } from './game.state';

import type { GameState } from './game.state';

const createState = (state: Partial<GameState> = {}): GameState => ({
    ...initialGameState,
    historyByDifficulty: {
        [DifficultyEnum.Newbie]: { ...initialGameState.historyByDifficulty[DifficultyEnum.Newbie], completedGames: [] },
        [DifficultyEnum.Easy]: { ...initialGameState.historyByDifficulty[DifficultyEnum.Easy], completedGames: [] },
        [DifficultyEnum.Medium]: { ...initialGameState.historyByDifficulty[DifficultyEnum.Medium], completedGames: [] },
        [DifficultyEnum.Hard]: { ...initialGameState.historyByDifficulty[DifficultyEnum.Hard], completedGames: [] },
        [DifficultyEnum.Nightmare]: { ...initialGameState.historyByDifficulty[DifficultyEnum.Nightmare], completedGames: [] }
    },
    candidates: {},
    solutionSteps: [],
    challengeSteps: [],
    ...state
});

describe('gameSlice', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should store compact solution step when saving a move', () => {
        expect.assertions(2);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '12345678.',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const correctCell = { ...sudoku.Field[0][8], value: 9 };
        const scoredCells = sudoku.setCellValue(correctCell);
        const state = createState({ candidates: { '1-8': [1, 2, 9] }, elapsedTime: 12 });

        const nextState = gameSlice.reducer(state, gameSlice.actions.save({ sudoku, correctCell, scoredCells }));

        expect(nextState.solutionSteps).toEqual([{ cellIndex: 8, value: 9, ts: 12 }]);
        expect(nextState.candidates['1-8']).toEqual([1, 2]);
    });

    it('should update simple run state reducers', () => {
        expect.assertions(9);

        const startedState = gameSlice.reducer(
            createState({ elapsedTime: 99, historyByDifficulty: createState().historyByDifficulty }),
            gameSlice.actions.start({ sudokuString: '123', maxMistakes: 0 })
        );
        const pausedState = gameSlice.reducer(startedState, gameSlice.actions.pause());
        const resumedState = gameSlice.reducer(pausedState, gameSlice.actions.resume());
        const loadedState = gameSlice.reducer(resumedState, gameSlice.actions.load({ score: 123 }));
        const tickedState = gameSlice.reducer(loadedState, gameSlice.actions.tick());
        const mistakeState = gameSlice.reducer(tickedState, gameSlice.actions.mistake());
        const resetState = gameSlice.reducer(mistakeState, gameSlice.actions.reset());

        expect(startedState.sudokuString).toBe('123');
        expect(startedState.maxMistakes).toBe(0);
        expect(startedState.elapsedTime).toBe(0);
        expect(pausedState.isPaused).toBe(true);
        expect(resumedState.isPaused).toBe(false);
        expect(loadedState.score).toBe(123);
        expect(tickedState.elapsedTime).toBe(1);
        expect(mistakeState.mistakes).toBe(1);
        expect(resetState.score).toBe(0);
    });

    it('should toggle helpers for candidates and input modes', () => {
        expect.assertions(8);

        const autoCandidatesState = gameSlice.reducer(
            createState({ inputMode: 'candidate' }),
            gameSlice.actions.toggleShowAutoCandidates()
        );
        const hiddenAutoCandidatesState = gameSlice.reducer(autoCandidatesState, gameSlice.actions.toggleShowAutoCandidates());
        const candidateModeState = gameSlice.reducer(
            createState({ inputMode: 'normal', showAutoCandidates: true }),
            gameSlice.actions.toggleInputMode()
        );
        const normalModeState = gameSlice.reducer(candidateModeState, gameSlice.actions.toggleInputMode());
        const candidateCell = { x: 1, y: 2, group: 0, value: 5 };
        const addedCandidateState = gameSlice.reducer(createState(), gameSlice.actions.toggleCellCandidate(candidateCell));
        const removedCandidateState = gameSlice.reducer(addedCandidateState, gameSlice.actions.toggleCellCandidate(candidateCell));

        expect(autoCandidatesState.showAutoCandidates).toBe(true);
        expect(autoCandidatesState.inputMode).toBe('normal');
        expect(hiddenAutoCandidatesState.showAutoCandidates).toBe(false);
        expect(candidateModeState.inputMode).toBe('candidate');
        expect(candidateModeState.showAutoCandidates).toBe(false);
        expect(normalModeState.inputMode).toBe('normal');
        expect(addedCandidateState.candidates['2-1']).toEqual([5]);
        expect(removedCandidateState.candidates['2-1']).toEqual([]);
    });

    it('should finish won and lost games with history metadata', () => {
        expect.assertions(19);

        jest.spyOn(Date, 'now').mockReturnValue(12345);

        const sudoku = Sudoku.fromString('.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize), defaultSudokuConfig);
        const wonState = gameSlice.reducer(
            createState({
                sudokuString: sudoku.toString(),
                elapsedTime: 30,
                score: 200,
                maxMistakes: 0,
                solutionSteps: [{ cellIndex: 0, value: 1, ts: 5 }]
            }),
            gameSlice.actions.finish({ difficulty: DifficultyEnum.Easy, isWon: true, isChallenge: true })
        );
        const wonHistory = wonState.historyByDifficulty[DifficultyEnum.Easy];

        expect(wonHistory.gamesCompleted).toBe(1);
        expect(wonHistory.gamesWon).toBe(1);
        expect(wonHistory.gamesWonWithoutMistakes).toBe(1);
        expect(wonHistory.hardcoreWon).toBe(1);
        expect(wonHistory.challengesWon).toBe(1);
        expect(wonHistory.bestScore).toBe(200);
        expect(wonHistory.bestTime).toBe(30);
        expect(wonHistory.averageTime).toBe(30);
        expect(wonHistory.completedGames[0]).toMatchObject({
            difficulty: DifficultyEnum.Easy,
            elapsedTime: 30,
            score: 200,
            mistakes: 0,
            maxMistakes: 0,
            completedAt: 12345
        });
        expect(wonHistory.completedGames[0]?.encodedState).toEqual(expect.any(String));

        const missedPerfectWinState = createState({
            elapsedTime: 20,
            mistakes: 1,
            maxMistakes: 3,
            score: 100,
            historyByDifficulty: {
                ...createState().historyByDifficulty,
                [DifficultyEnum.Easy]: { ...createState().historyByDifficulty[DifficultyEnum.Easy], bestScore: 500, bestTime: 10 }
            }
        });
        const missedPerfectWinNextState = gameSlice.reducer(
            missedPerfectWinState,
            gameSlice.actions.finish({ difficulty: DifficultyEnum.Easy, isWon: true })
        );
        const missedPerfectWinHistory = missedPerfectWinNextState.historyByDifficulty[DifficultyEnum.Easy];

        expect(missedPerfectWinHistory.gamesWonWithoutMistakes).toBe(0);
        expect(missedPerfectWinHistory.hardcoreWon).toBe(0);
        expect(missedPerfectWinHistory.challengesWon).toBe(0);
        expect(missedPerfectWinHistory.bestScore).toBe(500);
        expect(missedPerfectWinHistory.bestTime).toBe(10);

        const lostState = gameSlice.reducer(
            createState({ elapsedTime: 20 }),
            gameSlice.actions.finish({ difficulty: DifficultyEnum.Hard, isWon: false })
        );
        const lostHistory = lostState.historyByDifficulty[DifficultyEnum.Hard];

        expect(lostHistory.gamesCompleted).toBe(1);
        expect(lostHistory.gamesLost).toBe(1);
        expect(lostHistory.challengesLost).toBe(0);

        const lostChallengeState = gameSlice.reducer(
            createState(),
            gameSlice.actions.finish({ difficulty: DifficultyEnum.Nightmare, isWon: false, isChallenge: true })
        );

        expect(lostChallengeState.historyByDifficulty[DifficultyEnum.Nightmare].challengesLost).toBe(1);
    });
});
