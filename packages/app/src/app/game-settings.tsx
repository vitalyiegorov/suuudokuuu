import { usePauseGameOnSettingsFocus } from '../game/hooks/use-pause-game-on-settings-focus.hook';
import { SettingsPageContent } from '../settings/component/settings-page-content/settings-page-content';

export default function GameSettingsPage() {
    usePauseGameOnSettingsFocus();

    return <SettingsPageContent />;
}
