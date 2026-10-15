import { useLingui } from '@lingui/react/macro';
import { BackupService } from '@suuudokuuu/progress';
import { AppSettingsSection } from '@suuudokuuu/ui';
import * as Clock from 'effect/Clock';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';

import { Alert } from '../../../@generic/components/alert/alert';
import { appRuntime } from '../../../@generic/runtime/app.runtime';
import { getBrand } from '../../../@generic/utils/get-brand.util';
import { logErrorCause } from '../../../@generic/utils/log-error-cause.util';
import { SettingsScreenSelectors } from '../../../screens/components/settings-screen/settings-screen.selectors';
import { settingsPickBackupFile } from '../../utils/settings-pick-backup-file.util';
import { settingsShareBackupFile } from '../../utils/settings-share-backup-file.util';
import { SettingsActionRow } from '../settings-action-row/settings-action-row';

export const SettingsBackupSection = () => {
    const { t } = useLingui();
    const { appName } = getBrand();

    const handleConfirmedImport = (backup: string) => {
        appRuntime.runFork(
            Effect.flatMap(BackupService, backupService => backupService.importBackup(backup)).pipe(
                Effect.match({
                    onFailure: () => {
                        Alert(
                            t`Backup not imported`,
                            t`This file is not a ${appName} backup, or it was made by a newer version of the app.`
                        );
                    },
                    onSuccess: () => {
                        Alert(t`Backup imported`, t`Games, statistics, and themes from the file are now on this device.`);
                    }
                }),
                Effect.tapCause(logErrorCause)
            )
        );
    };
    const handleExport = () => {
        appRuntime.runFork(
            Effect.flatMap(BackupService, backupService => backupService.exportBackup()).pipe(
                Effect.zip(Clock.currentTimeMillis),
                Effect.flatMap(([backup, now]) =>
                    settingsShareBackupFile(backup, `suuudokuuu-backup-${new Date(now).toISOString().slice(0, 10)}.json`)
                ),
                Effect.tapCause(logErrorCause)
            )
        );
    };
    const handleImport = () => {
        appRuntime.runFork(
            settingsPickBackupFile.pipe(
                Effect.tap(
                    Option.match({
                        onNone: () => Effect.void,
                        onSome: backup =>
                            Effect.sync(() => {
                                Alert(
                                    t`Import backup?`,
                                    t`Games, statistics, and themes from the file are added to this device. Nothing here is removed, and your settings stay as they are.`,
                                    [
                                        { text: t`Cancel`, style: 'cancel' },
                                        {
                                            text: t`Import`,
                                            onPress: () => {
                                                handleConfirmedImport(backup);
                                            }
                                        }
                                    ]
                                );
                            })
                    })
                ),
                Effect.tapCause(logErrorCause)
            )
        );
    };

    return (
        <AppSettingsSection title={t`Backup`}>
            <SettingsActionRow
                description={t`Save your games, statistics, and themes to a file`}
                onPress={handleExport}
                testID={SettingsScreenSelectors.ExportBackupButton}
                title={t`Export backup`}
            />
            <SettingsActionRow
                description={t`Add games, statistics, and themes from a backup file`}
                onPress={handleImport}
                testID={SettingsScreenSelectors.ImportBackupButton}
                title={t`Import backup`}
            />
        </AppSettingsSection>
    );
};
