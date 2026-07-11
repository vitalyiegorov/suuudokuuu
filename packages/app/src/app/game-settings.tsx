import { useResumeGameAfterSettingsClose } from '../game/hooks/use-resume-game-after-settings-close.hook';
import { SettingsPageContent } from '../settings/component/settings-page-content/settings-page-content';

export default function GameSettingsPage() {
    useResumeGameAfterSettingsClose();

    return <SettingsPageContent />;
}
