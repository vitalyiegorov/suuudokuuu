import { useLingui } from '@lingui/react/macro';
import { LucideLogOut, LucidePlay, LucideShare2 } from 'lucide-react-native';
import { use } from 'react';
import { type PressableProps } from 'react-native';

import { AppLinkButton } from '../../../../@generic/components/app-link-button/app-link-button';
import { GlassIconButton } from '../../../../@generic/components/glass-icon-button/glass-icon-button';
import { ScreenActionBar } from '../../../../@generic/components/screen-action-bar/screen-action-bar';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { PauseScreenSelectors } from '../pause-screen.selectors';

interface Props {
    readonly onQuit: NonNullable<PressableProps['onPress']>;
    readonly onResume: NonNullable<PressableProps['onPress']>;
    readonly onShare: NonNullable<PressableProps['onPress']>;
}

export const PauseScreenActions = ({ onQuit, onResume, onShare }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const shareButton = (
        <GlassIconButton accessibilityLabel={t`Share puzzle`} onPress={onShare} testID={PauseScreenSelectors.ShareButton}>
            <LucideShare2 color={theme.colors.inkText} />
        </GlassIconButton>
    );
    const quitButton = (
        <GlassIconButton accessibilityLabel={t`Quit`} onPress={onQuit} testID={PauseScreenSelectors.QuitButton}>
            <LucideLogOut color={theme.colors.danger} />
        </GlassIconButton>
    );

    return (
        <ScreenActionBar left={shareButton} right={quitButton}>
            <AppLinkButton icon={LucidePlay} onPress={onResume} testID={PauseScreenSelectors.ResumeButton} text={t`Continue`} />
        </ScreenActionBar>
    );
};
