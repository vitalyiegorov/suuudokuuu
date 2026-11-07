import { useCallback, useEffect, useRef } from 'react';

import { emptyFn } from '@rnw-community/shared';

import { backdropRecompositeRef } from '../utils/backdrop-recomposite-ref.util';

export const useBackdropRecompositeRef = () => {
    const cleanupRef = useRef(emptyFn);

    useEffect(() => () => void cleanupRef.current(), []);

    return useCallback((node: unknown) => {
        cleanupRef.current();
        cleanupRef.current = backdropRecompositeRef(node);
    }, []);
};
