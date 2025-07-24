import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { LoserScreen } from '../screens/components/loser-screen/loser.screen';

export default function LoserPage() {
    return (
        <Page>
            <PageHeader title="Looooooser! =)" />

            <LoserScreen />
        </Page>
    );
}
