import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { isDefined } from '@rnw-community/shared';

const getThemeColorMeta = (initialColor?: string) => {
    const tag = document.querySelector<HTMLMetaElement>(`meta[name='theme-color']`);

    if (!isDefined(tag)) {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = initialColor ?? '';
        document.head.appendChild(meta);

        return meta;
    }

    return tag;
};

export const useHtmlThemeColor = (baseColor: string) => {
    useFocusEffect(
        useCallback(() => {
            const rootDiv = document.querySelector<HTMLDivElement>('#root');
            if (isDefined(rootDiv)) {
                rootDiv.style.backgroundColor = baseColor;
            }
            document.body.style.backgroundColor = baseColor;
            getThemeColorMeta().setAttribute('content', baseColor);
        }, [baseColor])
    );
};
