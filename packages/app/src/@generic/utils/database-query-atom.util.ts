import { LegacyStateImportService, SettingsRepository, runDatabaseMigrations } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as Atom from 'effect/reactivity/Atom';
import Storage from 'expo-sqlite/kv-store';

import { isNotEmptyString } from '@rnw-community/shared';

import { getDefaultSettings } from '../../settings/utils/get-default-settings.util';
import { getTheme } from '../../theme/utils/get-theme.util';
import { appAtomRuntime } from '../runtime/app.runtime';

import { hideAppSplashScreen } from './hide-app-splash-screen';
import { i18nActivateLanguage } from './i18n-catalogs';

import type { AppServices } from '../runtime/app.runtime';
import type { ReactivityKeyEnum } from '@suuudokuuu/progress';

const LegacyPersistedRootKey = 'persist:root';

const importLegacyState = Effect.gen(function* () {
    const persistedRoot = yield* Effect.promise(() => Storage.getItem(LegacyPersistedRootKey));

    if (!isNotEmptyString(persistedRoot)) {
        return;
    }

    const legacyStateImportService = yield* LegacyStateImportService;

    yield* legacyStateImportService.importPersistedRoot(persistedRoot, (theme, colorSchema) => getTheme(theme, colorSchema).colors);
    yield* Effect.promise(() => Storage.removeItem(LegacyPersistedRootKey));
}).pipe(Effect.tapCause(Effect.logError), Effect.ignoreCause);

const databaseBootAtom = appAtomRuntime
    .atom(
        Effect.gen(function* () {
            const settingsRepository = yield* SettingsRepository;

            yield* runDatabaseMigrations;
            yield* settingsRepository.initialize(getDefaultSettings());
            yield* importLegacyState;

            const { language } = yield* settingsRepository.get;

            yield* Effect.promise(() => i18nActivateLanguage(language).then(hideAppSplashScreen));
        }).pipe(Effect.tapCause(Effect.logError))
    )
    .pipe(Atom.keepAlive);

export const databaseQueryAtom = <A, E>(keys: readonly ReactivityKeyEnum[], effect: Effect.Effect<A, E, AppServices>) =>
    appAtomRuntime.factory.withReactivity(keys)(appAtomRuntime.atom(get => Effect.andThen(get.result(databaseBootAtom), effect)));
