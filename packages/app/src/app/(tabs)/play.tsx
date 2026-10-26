import { useLingui } from '@lingui/react/macro';
import { DifficultySchema, SettingsRepository } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as Schema from 'effect/Schema';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { emptyFn } from '@rnw-community/shared';

import { PageHead } from '../../@generic/components/page-head/page-head';
import { PageHeader } from '../../@generic/components/page-header/page-header';
import { PageHorizontalSafeAreaEdges } from '../../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../../@generic/components/page/page';
import { appRuntime } from '../../@generic/runtime/app.runtime';
import { logErrorCause } from '../../@generic/utils/log-error-cause.util';
import { HomeScreen } from '../../screens/components/home-screen/home.screen';

export default function PlayPage() {
    const { t } = useLingui();
    const { difficulty } = useLocalSearchParams<{ difficulty?: string | string[] }>();

    useEffect(() => {
        if (!Schema.is(DifficultySchema)(difficulty)) {
            return emptyFn;
        }

        const fiber = appRuntime.runFork(
            Effect.flatMap(SettingsRepository, settingsRepository => settingsRepository.update({ lastGameDifficulty: difficulty })).pipe(
                Effect.tapCause(logErrorCause)
            )
        );

        return () => void fiber.interruptUnsafe();
    }, [difficulty]);

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHead isNoIndex title={t`Play Sudoku — Suuudokuuu`} />
            <PageHeader title={t`Play`} />

            <HomeScreen />
        </Page>
    );
}
