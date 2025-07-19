import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { HomeScreen } from '../screens/components/home-screen/home.screen';

export default function HomePage() {
    return (
        <Page>
            <PageHeader />
            <HomeScreen />
        </Page>
    );
}
