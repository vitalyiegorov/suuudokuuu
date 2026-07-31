import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import {
    HellAdvanceBudgetMilliseconds,
    HellQueueCapacity,
    HellQueueGeneratorMaximumGivens,
    HellQueueGeneratorMinimumGivens,
    HellQueueGeneratorTabuCapacity,
    HellQueueGeneratorVersion,
    HellQueueLowWaterMark
} from '../../constants/hell-queue.constant';
import { HellQueueEntrySchemaVersion } from '../../schema/hell-queue-entry.schema';
import { hellQueueEnqueueAction } from '../../store/hell-queue.actions';

import { HellQueueRefillController } from './hell-queue-refill-controller';

import type { HellQueueEntryInterface } from '../../interfaces/hell-queue-entry.interface';

type AppStateListener = (nextAppState: string) => void;
type EffectCallback = () => (() => void) | undefined;

let capturedEffect: EffectCallback | undefined;
let capturedAppStateListener: AppStateListener | undefined;
let mockEntries: HellQueueEntryInterface[] = [];

const mockUseEffect = jest.fn((effect: EffectCallback) => {
    capturedEffect = effect;
});
const mockUseRef = jest.fn((initialValue: unknown) => ({ current: initialValue }));

const mockSubscriptionRemove = jest.fn();
const mockAddEventListener = jest.fn((_eventName: 'change', listener: AppStateListener) => {
    capturedAppStateListener = listener;

    return { remove: mockSubscriptionRemove };
});

const mockGetState = jest.fn(() => ({ hellQueue: { entries: mockEntries } }));

const mockDispatch = jest.fn((action: ReturnType<typeof hellQueueEnqueueAction>) => {
    mockEntries = [...mockEntries, action.payload];
});

const mockAdvance = jest.fn((_budgetMilliseconds: number) => ({}));
const mockSeedWith = jest.fn();
const mockHellGeneratorConstructor = jest.fn().mockImplementation(() => ({
    advance: mockAdvance,
    seedWith: mockSeedWith
}));

jest.mock('react', () => ({
    useEffect: (effect: EffectCallback) => void mockUseEffect(effect),
    useRef: (initialValue: unknown) => mockUseRef(initialValue)
}));

jest.mock('react-native', () => ({
    AppState: {
        addEventListener: (eventName: 'change', listener: AppStateListener) => mockAddEventListener(eventName, listener)
    }
}));

jest.mock('../../../@generic/app-root.store', () => ({
    appRootStore: {
        getState: () => mockGetState()
    }
}));

jest.mock('../../../@generic/hooks/use-app-dispatch.hook', () => ({
    useAppDispatch: () => mockDispatch
}));

jest.mock('@suuudokuuu/generator', () => {
    const actual = jest.requireActual<typeof import('@suuudokuuu/generator')>('@suuudokuuu/generator');

    return {
        ...actual,
        HellGenerator: function HellGenerator(...constructorArgs: unknown[]) {
            return new mockHellGeneratorConstructor(...constructorArgs);
        }
    };
});

const PuzzleStringLength = 81;
const DefaultGivensCount = 20;

const buildEntry = (overrides: Partial<HellQueueEntryInterface> = {}): HellQueueEntryInterface => ({
    createdAt: 1,
    generatorVersion: HellQueueGeneratorVersion,
    givensCount: DefaultGivensCount,
    id: '1'.repeat(PuzzleStringLength),
    puzzle: '1'.repeat(PuzzleStringLength),
    schemaVersion: HellQueueEntrySchemaVersion,
    solution: '2'.repeat(PuzzleStringLength),
    ...overrides
});

const flush = async (ticks = 3): Promise<void> => {
    for (let tick = 0; tick < ticks; tick += 1) {
        await new Promise<void>(resolve => {
            setTimeout(resolve, 0);
        });
    }
};

const mountController = (): void => {
    HellQueueRefillController();
    capturedEffect?.();
};

describe('HellQueueRefillController', () => {
    beforeEach(() => {
        capturedEffect = undefined;
        capturedAppStateListener = undefined;
        mockEntries = [];
        jest.clearAllMocks();
        mockAdvance.mockImplementation(() => ({}));
    });

    it('starts a refill run on mount when below the low-water mark, seeding with existing entries and enqueuing discovered candidates', async () => {
        expect.assertions(6);

        mockEntries = [buildEntry({ id: 'seed-puzzle', puzzle: 'seed-puzzle' })];
        const discoveredCandidate = { givensCount: 18, puzzle: 'p'.repeat(PuzzleStringLength), solution: 's'.repeat(PuzzleStringLength) };
        mockAdvance.mockImplementationOnce(() => ({ candidate: discoveredCandidate }));

        mountController();

        expect(mockHellGeneratorConstructor).toHaveBeenCalledTimes(1);
        const [firstCall] = mockHellGeneratorConstructor.mock.calls;
        const [, generatorOptions] = firstCall;
        expect(generatorOptions).toMatchObject({
            maxGivens: HellQueueGeneratorMaximumGivens,
            minGivens: HellQueueGeneratorMinimumGivens,
            tabuCapacity: HellQueueGeneratorTabuCapacity
        });
        expect(mockSeedWith).toHaveBeenCalledWith(['seed-puzzle']);
        expect(mockAdvance).toHaveBeenCalledWith(HellAdvanceBudgetMilliseconds);
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({
                    generatorVersion: HellQueueGeneratorVersion,
                    givensCount: discoveredCandidate.givensCount,
                    id: discoveredCandidate.puzzle,
                    puzzle: discoveredCandidate.puzzle,
                    schemaVersion: HellQueueEntrySchemaVersion,
                    solution: discoveredCandidate.solution
                }),
                type: hellQueueEnqueueAction.type
            })
        );

        const cleanup = capturedEffect?.();
        cleanup?.();
        await flush();

        expect(mockSubscriptionRemove).toHaveBeenCalledTimes(1);
    });

    it('stops enqueueing once the app leaves the active state mid-run', async () => {
        expect.assertions(2);

        const laterCandidate = { givensCount: 18, puzzle: 'q'.repeat(PuzzleStringLength), solution: 'r'.repeat(PuzzleStringLength) };
        mockAdvance.mockImplementationOnce(() => ({})).mockImplementation(() => ({ candidate: laterCandidate }));

        mountController();

        capturedAppStateListener?.('background');
        await flush();

        expect(mockAdvance).toHaveBeenCalledTimes(1);
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('does not start a second concurrent run while one is already in progress', async () => {
        expect.assertions(1);

        mountController();
        capturedAppStateListener?.('active');

        expect(mockHellGeneratorConstructor).toHaveBeenCalledTimes(1);

        capturedAppStateListener?.('background');
        await flush();
    });

    it('starts a refill run when the queue is below the low-water mark', () => {
        expect.assertions(1);

        mockEntries = Array.from({ length: HellQueueLowWaterMark - 1 }, (_, index) =>
            buildEntry({ id: `existing-${index}`, puzzle: `existing-${index}` })
        );

        mountController();

        expect(mockHellGeneratorConstructor).toHaveBeenCalledTimes(1);
    });

    it('does not start a refill run once the queue reaches the low-water mark', () => {
        expect.assertions(1);

        mockEntries = Array.from({ length: HellQueueLowWaterMark + 2 }, (_, index) =>
            buildEntry({ id: `existing-${index}`, puzzle: `existing-${index}` })
        );

        mountController();

        expect(mockHellGeneratorConstructor).not.toHaveBeenCalled();
    });

    it('keeps refilling past the low-water mark until the queue reaches capacity', async () => {
        expect.assertions(2);

        mockEntries = Array.from({ length: HellQueueLowWaterMark - 1 }, (_, index) =>
            buildEntry({ id: `existing-${index}`, puzzle: `existing-${index}` })
        );
        let dispatchedCount = 0;
        mockAdvance.mockImplementation(() => {
            dispatchedCount += 1;

            return { candidate: { givensCount: 19, puzzle: `filling-${dispatchedCount}`, solution: `solved-${dispatchedCount}` } };
        });

        mountController();
        await flush(HellQueueCapacity * 3);

        expect(mockEntries).toHaveLength(HellQueueCapacity);
        expect(mockDispatch).toHaveBeenCalledTimes(HellQueueCapacity - (HellQueueLowWaterMark - 1));
    });

    it('does not start a run when the queue is already at capacity', () => {
        expect.assertions(1);

        mockEntries = Array.from({ length: HellQueueCapacity }, (_, index) => buildEntry({ id: `full-${index}`, puzzle: `full-${index}` }));

        mountController();

        expect(mockHellGeneratorConstructor).not.toHaveBeenCalled();
    });

    it('resets the running guard after the generator fails, allowing a later attempt to start', async () => {
        expect.assertions(2);

        mockAdvance.mockImplementationOnce(() => {
            throw new Error('generator failure');
        });

        mountController();
        await flush();

        expect(mockHellGeneratorConstructor).toHaveBeenCalledTimes(1);

        capturedAppStateListener?.('active');

        expect(mockHellGeneratorConstructor).toHaveBeenCalledTimes(2);

        capturedAppStateListener?.('background');
        await flush();
    });
});
