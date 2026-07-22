import { LucideHouse, LucideRotateCcw } from 'lucide-react-native';
import { use } from 'react';

import { PlayAgainButtonSelectors } from '../../../@generic/components/play-again-button/play-again-button.selectors';
import { ScreenActionBar } from '../../../@generic/components/screen-action-bar/screen-action-bar';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeResultNavButton } from '../challenge-result-nav-button/challenge-result-nav-button';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const ChallengeResultFooter = ({ children }: Props) => {
    const { theme } = use(ThemeContext);

    const replayButton = (
        <ChallengeResultNavButton testID={PlayAgainButtonSelectors.Root}>
            <LucideRotateCcw color={theme.colors.label.main} />
        </ChallengeResultNavButton>
    );
    const homeButton = (
        <ChallengeResultNavButton>
            <LucideHouse color={theme.colors.label.main} />
        </ChallengeResultNavButton>
    );

    return (
        <ScreenActionBar left={replayButton} right={homeButton}>
            {children}
        </ScreenActionBar>
    );
};
