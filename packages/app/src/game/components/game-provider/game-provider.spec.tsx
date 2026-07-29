import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { use } from 'react';

import { GameContext } from '../../context/game.context';
import { initialGameState } from '../../store/game.state';

import { GameProvider } from './game-provider';

import type { ReactNode } from 'react';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockDispatch = jest.fn();
const mockAlert = jest.fn();

jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush, replace: mockReplace }) }));
jest.mock('../../../@generic/components/alert/alert', () => ({ Alert: (title: string) => mockAlert(title) }));
jest.mock('../../../@generic/hooks/use-app-dispatch.hook', () => ({ useAppDispatch: () => mockDispatch }));
jest.mock('../../../@generic/hooks/use-app-selector.hook', () => ({ useAppSelector: (selector: () => unknown) => selector() }));
jest.mock('../../store/game.selectors', () => ({ gameSudokuStringSelector: () => '' }));
jest.mock('../../../settings/store/settings.selectors', () => ({ settingsLanguageSelector: () => 'en' }));

const maxMistakes = 3;

interface Props {
    readonly children: ReactNode;
}

const GameProviderWrapper = ({ children }: Props) => (
    <I18nProvider i18n={i18n}>
        <GameProvider>{children}</GameProvider>
    </I18nProvider>
);

const renderGameContext = () => renderHook(() => use(GameContext), { wrapper: GameProviderWrapper });

const buildChallengeState = () => {
    const sudoku = new Sudoku(defaultSudokuConfig);

    sudoku.create(DifficultyEnum.Newbie);

    return { ...initialGameState, sudokuString: sudoku.toString() };
};

describe('GameProvider', () => {
    let createSpy = jest.spyOn(Sudoku.prototype, 'create');

    beforeEach(() => {
        jest.clearAllMocks();
        createSpy = jest.spyOn(Sudoku.prototype, 'create');
    });

    it('should generate, dispatch, and navigate once for repeated create calls', async () => {
        const { result } = await renderGameContext();

        await act(() => {
            result.current.create({ difficulty: DifficultyEnum.Newbie, isChallengeRun: false, maxMistakes });
            result.current.create({ difficulty: DifficultyEnum.Newbie, isChallengeRun: false, maxMistakes });
            result.current.create({ difficulty: DifficultyEnum.Newbie, isChallengeRun: false, maxMistakes });
        });

        await waitFor(() => void expect(mockPush).toHaveBeenCalledTimes(1));

        expect(createSpy).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should report itself as creating before the deferred generation runs', async () => {
        const { result } = await renderGameContext();

        await act(() => void result.current.create({ difficulty: DifficultyEnum.Newbie, isChallengeRun: false, maxMistakes }));

        expect(result.current.isCreatingGame).toBe(true);
        expect(createSpy).not.toHaveBeenCalled();

        await waitFor(() => void expect(result.current.isCreatingGame).toBe(false));

        expect(createSpy).toHaveBeenCalledTimes(1);
    });

    it('should load and navigate once for repeated createFromState calls', async () => {
        const challengeState = buildChallengeState();
        const { result } = await renderGameContext();

        createSpy.mockClear();

        await act(() => {
            result.current.createFromState(challengeState);
            result.current.createFromState(challengeState);
        });

        await waitFor(() => void expect(mockReplace).toHaveBeenCalledTimes(1));

        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockPush).not.toHaveBeenCalled();
    });

    it('should surface the alert and allow a retry when generation fails', async () => {
        const { result } = await renderGameContext();

        createSpy.mockImplementationOnce(() => {
            throw new Error('generation failed');
        });

        await act(() => void result.current.create({ difficulty: DifficultyEnum.Newbie, isChallengeRun: false, maxMistakes }));

        await waitFor(() => void expect(mockAlert).toHaveBeenCalledTimes(1));

        expect(result.current.isCreatingGame).toBe(false);
        expect(mockPush).not.toHaveBeenCalled();

        await act(() => void result.current.create({ difficulty: DifficultyEnum.Newbie, isChallengeRun: false, maxMistakes }));

        await waitFor(() => void expect(mockPush).toHaveBeenCalledTimes(1));
    });
});
