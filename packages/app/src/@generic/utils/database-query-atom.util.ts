import { LegacyStateImportService, SettingsRepository, runDatabaseMigrations } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as Atom from 'effect/reactivity/Atom';

import { isNotEmptyString } from '@rnw-community/shared';

import { getDefaultSettings } from '../../settings/utils/get-default-settings.util';
import { getTheme } from '../../theme/utils/get-theme.util';
import { appAtomRuntime } from '../runtime/app.runtime';
import { readLegacyPersistedRoot, removeLegacyPersistedRoot } from '../runtime/legacy-kv-store';

import { i18nActivateLanguage } from './i18n-catalogs';
import { logErrorCause } from './log-error-cause.util';

import type { AppServices } from '../runtime/app.runtime';
import type { ReactivityKeyEnum } from '@suuudokuuu/progress';

const importLegacyState = Effect.gen(function* () {
    const persistedRoot = yield* readLegacyPersistedRoot;

    if (!isNotEmptyString(persistedRoot)) {
        return;
    }

    const legacyStateImportService = yield* LegacyStateImportService;

    yield* legacyStateImportService.importPersistedRoot(persistedRoot, (theme, colorSchema) => getTheme(theme, colorSchema).colors);
    yield* removeLegacyPersistedRoot;
}).pipe(Effect.tapCause(logErrorCause), Effect.ignoreCause);

export const databaseBootAtom = appAtomRuntime
    .atom(
        Effect.gen(function* () {
            const settingsRepository = yield* SettingsRepository;

            yield* runDatabaseMigrations;
            yield* settingsRepository.initialize(getDefaultSettings());
            yield* importLegacyState;

            const { language } = yield* settingsRepository.get;

            yield* i18nActivateLanguage(language).pipe(Effect.tapCause(logErrorCause), Effect.ignoreCause);
        }).pipe(Effect.tapCause(logErrorCause))
    )
    .pipe(Atom.keepAlive);

export const databaseQueryAtom = <A, E>(keys: readonly ReactivityKeyEnum[], effect: Effect.Effect<A, E, AppServices>) =>
    appAtomRuntime.factory.withReactivity(keys)(appAtomRuntime.atom(get => Effect.andThen(get.result(databaseBootAtom), effect)));
