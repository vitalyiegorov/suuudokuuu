import { useResumeGameOnSettingsClose } from '../game/hooks/use-resume-game-on-settings-close.hook';
import { SettingsPageContent } from '../settings/component/settings-page-content/settings-page-content';

export default function GameSettingsPage() {
    useResumeGameOnSettingsClose();

    return <SettingsPageContent />;
}
