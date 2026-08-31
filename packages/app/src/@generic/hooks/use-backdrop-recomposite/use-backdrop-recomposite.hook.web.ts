import { useCallback, useEffect, useRef } from 'react';

import { isDefined } from '@rnw-community/shared';

import { recompositeBackdropLayers } from '../../utils/recomposite-backdrop-layers.util.web';

import type { BackdropRecompositeRef } from './backdrop-recomposite-ref.interface';

export const useBackdropRecomposite = (): BackdropRecompositeRef => {
    const containerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const recompositeContainer = () => {
            if (isDefined(containerRef.current)) {
                recompositeBackdropLayers(containerRef.current);
            }
        };
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                recompositeContainer();
            }
        };
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                recompositeContainer();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pageshow', handlePageShow);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pageshow', handlePageShow);
        };
    }, []);

    return useCallback((node: unknown) => {
        containerRef.current = node instanceof HTMLElement ? node : null;
    }, []);
};
