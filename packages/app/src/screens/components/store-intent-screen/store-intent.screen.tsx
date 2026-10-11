import { DifficultyEnum } from '@suuudokuuu/generator';
import { SettingsRepository } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as AtomRegistry from 'effect/reactivity/AtomRegistry';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { appAtomRegistry } from '../../../@generic/constants/app-atom-registry.constant';
import { appRuntime } from '../../../@generic/runtime/app.runtime';
import { RelaxedMaxMistakesConstant } from '../../../settings/constant/max-mistakes.constant';
import { settingsAtom } from '../../../settings/query/use-settings.query';
import { StoreIntentEnum } from '../../enum/store-intent.enum';

interface Props {
    readonly intent: StoreIntentEnum;
}

export const StoreIntentScreen = ({ intent }: Props) => {
    const { dismissTo } = useRouter();
    const navigation = useNavigation();

    useEffect(() => {
        const intentVisit = navigation.getState()?.routes.at(-1)?.key;
        const isQuiet = intent === StoreIntentEnum.QUIET;
        const difficulty = intent === StoreIntentEnum.EXPERT ? DifficultyEnum.Nightmare : DifficultyEnum.Hard;
        const presetFiber = appRuntime.runFork(
            Effect.flatMap(SettingsRepository, settingsRepository =>
                settingsRepository.update({
                    lastGameDifficulty: isQuiet ? DifficultyEnum.Easy : difficulty,
                    lastGameMaxMistakes: isQuiet ? RelaxedMaxMistakesConstant : 3,
                    lastGameChallengeMode: false
                })
            ).pipe(
                Effect.andThen(AtomRegistry.getResult(appAtomRegistry, settingsAtom, { suspendOnWaiting: true })),
                Effect.andThen(Effect.sync(() => void dismissTo({ pathname: '/', params: { intent, intentVisit } }))),
                Effect.catchCause(cause => Effect.logError(cause).pipe(Effect.andThen(Effect.sync(() => void dismissTo('/')))))
            )
        );

        return () => void presetFiber.interruptUnsafe();
    }, [intent, dismissTo, navigation]);

    return null;
};
