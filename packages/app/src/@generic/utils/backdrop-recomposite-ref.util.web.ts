import { emptyFn } from '@rnw-community/shared';

import { recompositeBackdropLayers } from './recomposite-backdrop-layers.util.web';

export const backdropRecompositeRef = (node: unknown) => {
    if (!(node instanceof HTMLElement)) {
        return emptyFn;
    }

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            recompositeBackdropLayers(node);
        }
    };
    const handlePageShow = (event: PageTransitionEvent) => {
        if (event.persisted) {
            recompositeBackdropLayers(node);
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('pageshow', handlePageShow);
    };
};
