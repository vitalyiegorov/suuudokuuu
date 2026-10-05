import { useLingui } from '@lingui/react/macro';
import { Redirect } from 'expo-router';

import { isNotEmptyString } from '@rnw-community/shared';

import { PageHead } from '../@generic/components/page-head/page-head';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { Page } from '../@generic/components/page/page';
import { useCurrentRun } from '../game/query/use-current-run.query';
import { PauseScreen } from '../screens/components/pause-screen/pause.screen';

export default function PausePage() {
    const { t } = useLingui();
    const isGameStarted = isNotEmptyString(useCurrentRun().sudokuString);

    if (!isGameStarted) {
        return <Redirect href="/" />;
    }

    return (
        <Page>
            <PageHead isNoIndex />
            <PageHeader title={t`Game paused`} />

            <PauseScreen />
        </Page>
    );
}
