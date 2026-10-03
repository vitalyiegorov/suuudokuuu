import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { PageHead } from '../@generic/components/page-head/page-head';
import { useCurrentRun } from '../game/query/use-current-run.query';
import { runCurrentRunCommand } from '../game/utils/run-current-run-command.util';
import { SettingsPageContent } from '../settings/component/settings-page-content/settings-page-content';

export default function GameSettingsPage() {
    const { isPaused, sudokuString } = useCurrentRun();
    const shouldPause = isNotEmptyString(sudokuString) && !isPaused;

    useFocusEffect(
        useCallback(() => {
            if (shouldPause) {
                void runCurrentRunCommand(currentRunService => currentRunService.pause(false));
            }
        }, [shouldPause])
    );

    return (
        <>
            <PageHead noIndex />

            <SettingsPageContent />
        </>
    );
}
