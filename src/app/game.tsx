import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { GameScreen } from '../screens/components/game-screen/game-screen';

export default function GamePage() {
    return (
        <Page>
            <PageHeader title="Be wise, be smart, be quick..." />
            <GameScreen />
        </Page>
    );
}
