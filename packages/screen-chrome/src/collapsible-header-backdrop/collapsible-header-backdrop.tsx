import { ReactNode } from 'react';

import { EdgeFade } from '../edge-fade/edge-fade';
import { useScreenChrome } from '../hook/use-screen-chrome.hook';

export const CollapsibleHeaderBackdrop = (): ReactNode => {
    const { config } = useScreenChrome();
    const scrollAnimation = {
        opacityInputRange: [config.collapseStart, config.smallTitleStart] as const,
        intensityInputRange: [config.collapseStart, config.collapseEnd] as const
    };

    return <EdgeFade position="top" height={config.headerBackdropHeight} scrollAnimation={scrollAnimation} />;
};
