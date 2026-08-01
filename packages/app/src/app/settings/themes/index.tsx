import { useLingui } from '@lingui/react/macro';

import { PageHorizontalSafeAreaEdges } from '../../../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../../../@generic/components/page/page';
import { PageHeader } from '../../../@generic/components/page-header/page-header';
import { ThemesScreen } from '../../../screens/components/themes-screen/themes.screen';

export default function ThemesPage() {
    const { t } = useLingui();

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHeader title={t`Theme`} />

            <ThemesScreen />
        </Page>
    );
}
