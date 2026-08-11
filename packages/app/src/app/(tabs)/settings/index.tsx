import { useLingui } from '@lingui/react/macro';

import { PageHead } from '../../../@generic/components/page-head/page-head';
import { SettingsPageContent } from '../../../settings/component/settings-page-content/settings-page-content';

export default function SettingsPage() {
    const { t } = useLingui();
    const description = t`Customize your Sudoku experience: themes, difficulty, and gameplay preferences.`;

    return (
        <>
            <PageHead description={description} title={t`Settings — Suuudokuuu`} />

            <SettingsPageContent />
        </>
    );
}
