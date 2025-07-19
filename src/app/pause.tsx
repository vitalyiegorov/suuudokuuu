import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { PauseScreen } from '../screens/components/pause-screen/pause.screen';

export default function PausePage() {
    return (
        <Page>
            <PageHeader title="Game paused" />
            <PauseScreen />
        </Page>
    );
}
