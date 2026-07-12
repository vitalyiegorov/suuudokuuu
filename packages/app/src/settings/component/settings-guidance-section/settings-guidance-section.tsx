import { useLingui } from '@lingui/react/macro';
import { AppSettingsSection } from '@suuudokuuu/ui';

import { SettingsSwitch } from '../settings-switch/settings-switch';

export const SettingsGuidanceSection = () => {
    const { t } = useLingui();

    return (
        <AppSettingsSection title={t`Guidance`}>
            <SettingsSwitch
                description={t`Show the row, column, and box for the selected cell`}
                setting="showAreas"
                title={t`Highlight areas`}
            />
            <SettingsSwitch
                description={t`Show cells with the same number as the selected cell`}
                setting="showIdenticalNumbers"
                title={t`Highlight matching numbers`}
            />
            <SettingsSwitch
                description={t`Animate completed rows, columns, and boxes`}
                setting="showComboAnimation"
                title={t`Completion animations`}
            />
            <SettingsSwitch
                description={t`Shade cells that already have a number`}
                setting="showFilledNumbers"
                title={t`Highlight filled numbers`}
            />
            <SettingsSwitch
                description={t`Show matching notes for the selected cell`}
                setting="showActiveCandidates"
                title={t`Highlight pencil marks`}
            />
            <SettingsSwitch
                description={t`Keep selection after tapping outside the board`}
                setting="keepActiveCell"
                title={t`Keep cell selected`}
            />
        </AppSettingsSection>
    );
};
