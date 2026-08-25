import { PageHead } from '../@generic/components/page-head/page-head';
import { usePauseGameOnSettingsFocus } from '../game/hooks/use-pause-game-on-settings-focus.hook';
import { SettingsPageContent } from '../settings/component/settings-page-content/settings-page-content';

export default function GameSettingsPage() {
    usePauseGameOnSettingsFocus();

    return (
        <>
            <PageHead noIndex />

            <SettingsPageContent />
        </>
    );
}
