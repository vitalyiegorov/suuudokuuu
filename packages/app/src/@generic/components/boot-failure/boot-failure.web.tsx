import { useAtomValue } from '@effect/atom-react/Hooks';
import { Trans, useLingui } from '@lingui/react/macro';
import * as Cause from 'effect/Cause';
import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import { useEffect } from 'react';
import { Button, Text, View } from 'react-native';

import { emptyFn } from '@rnw-community/shared';

import { settingsAtom } from '../../../settings/query/use-settings.query';
import { getDefaultSettings } from '../../../settings/utils/get-default-settings.util';
import { DatabaseInUseError } from '../../error/database-in-use.error';
import { i18nActivateLanguage } from '../../utils/i18n-catalogs';
import { logErrorCause } from '../../utils/log-error-cause.util';

import { BootFailureStyles as styles } from './boot-failure.styles';

export const BootFailure = () => {
    const { t } = useLingui();
    const reloadPage = window.location.reload.bind(window.location);
    const settingsResult = useAtomValue(settingsAtom);
    const isDatabaseInUse = AsyncResult.isFailure(settingsResult) && Cause.squash(settingsResult.cause) instanceof DatabaseInUseError;

    useEffect(() => {
        if (!AsyncResult.isSuccess(settingsResult) && !AsyncResult.isFailure(settingsResult)) {
            return emptyFn;
        }

        const language = AsyncResult.isSuccess(settingsResult) ? settingsResult.value.language : getDefaultSettings().language;
        const fiber = Effect.runFork(i18nActivateLanguage(language).pipe(Effect.tapCause(logErrorCause)));

        return () => void Effect.runFork(Fiber.interrupt(fiber));
    }, [settingsResult]);

    return (
        <View style={styles.container}>
            <Text accessibilityRole="alert" style={styles.message}>
                {isDatabaseInUse ? (
                    <Trans>Suuudokuuu is open in another tab. Close that tab, then try again here. Your saved progress is safe.</Trans>
                ) : (
                    <Trans>Unable to load your game</Trans>
                )}
            </Text>
            <Button onPress={reloadPage} title={t`Try again`} />
        </View>
    );
};
