import { useLingui } from '@lingui/react/macro';
import { AppSettingsSection } from '@suuudokuuu/ui';

import { SettingsScreenSelectors } from '../../../screens/components/settings-screen/settings-screen.selectors';
import { SettingsSwitch } from '../settings-switch/settings-switch';

export const SettingsFeedbackSection = () => {
    const { t } = useLingui();

    return (
        <AppSettingsSection title={t`Feedback`}>
            <SettingsSwitch description={t`Show elapsed time while you play`} setting="hasTimer" title={t`Timer`} />
            <SettingsSwitch description={t`Vibrate on taps and game actions`} setting="hasVibration" title={t`Vibration`} />
            <SettingsSwitch
                description={t`Hide the score and finish with a calm summary instead`}
                setting="calmMode"
                testID={SettingsScreenSelectors.CalmModeSwitch}
                title={t`Calm play`}
            />
        </AppSettingsSection>
    );
};
