import './i18n-plural-rules.polyfill';
import { i18n } from '@lingui/core';
import * as Cause from 'effect/Cause';
import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import * as Option from 'effect/Option';
import * as Ref from 'effect/Ref';
import * as Semaphore from 'effect/Semaphore';

import { messages as enMessages } from '../../i18n/locales/en/messages';

import type { SettingsType } from '@suuudokuuu/progress';

const catalogLoaders: Record<SettingsType['language'], () => Promise<{ messages: typeof enMessages }>> = {
    ar: () => import('../../i18n/locales/ar/messages'),
    bn: () => import('../../i18n/locales/bn/messages'),
    de: () => import('../../i18n/locales/de/messages'),
    en: () => Promise.resolve({ messages: enMessages }),
    es: () => import('../../i18n/locales/es/messages'),
    fr: () => import('../../i18n/locales/fr/messages'),
    hi: () => import('../../i18n/locales/hi/messages'),
    id: () => import('../../i18n/locales/id/messages'),
    pt: () => import('../../i18n/locales/pt/messages'),
    sv: () => import('../../i18n/locales/sv/messages'),
    uk: () => import('../../i18n/locales/uk/messages'),
    ur: () => import('../../i18n/locales/ur/messages'),
    zh: () => import('../../i18n/locales/zh/messages')
};

i18n.load({ en: enMessages });
i18n.activate('en');

const activationSemaphore = Semaphore.makeUnsafe(1);
const activationFiber = Ref.makeUnsafe(Option.none<Fiber.Fiber<void, Cause.UnknownError>>());

export const i18nActivateLanguage = Effect.fn('i18nActivateLanguage')(function* (language: SettingsType['language']) {
    const fiber = yield* activationSemaphore.withPermit(
        Effect.gen(function* () {
            const previousFiber = yield* Ref.get(activationFiber);

            if (Option.isSome(previousFiber)) {
                yield* Fiber.interrupt(previousFiber.value);
            }

            const nextFiber = yield* Effect.forkChild(
                Effect.gen(function* () {
                    if (language !== i18n.locale) {
                        const { messages } = yield* Effect.tryPromise(catalogLoaders[language]);

                        yield* Effect.sync(() => void i18n.loadAndActivate({ locale: language, messages }));
                    }
                })
            );

            yield* Ref.set(activationFiber, Option.some(nextFiber));

            return nextFiber;
        })
    );

    yield* Fiber.join(fiber);
});
