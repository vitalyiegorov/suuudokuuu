import { useLingui } from '@lingui/react/macro';

import { PageHorizontalSafeAreaEdges } from '../../../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../../../@generic/components/page/page';
import { PageHeader } from '../../../@generic/components/page-header/page-header';
import { ThemeEditorScreen } from '../../../screens/components/theme-editor-screen/theme-editor.screen';

export default function ThemeEditorPage() {
    const { t } = useLingui();

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHeader title={t`Theme editor`} />

            <ThemeEditorScreen />
        </Page>
    );
}
