import { useResumeGameOnSettingsExit } from '../game/hooks/use-resume-game-on-settings-exit.hook';
import { SettingsPageContent } from '../settings/component/settings-page-content/settings-page-content';

export default function GameSettingsPage() {
    useResumeGameOnSettingsExit();

    return <SettingsPageContent />;
}
