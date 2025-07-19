import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { WinnerScreen } from '../screens/components/winner-screen/winner.screen';

export default function WinnerPage() {
    return (
        <Page>
            <PageHeader title="Winners-winner, chicken dinner!" />

            <WinnerScreen />
        </Page>
    );
}
