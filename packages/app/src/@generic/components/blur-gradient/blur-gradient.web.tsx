import { createElement, use } from 'react';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ColorSchemaEnum } from '../../../theme/enum/color-schema.enum';

import {
    BlurGradientDefaultBottomHeight,
    BlurGradientDefaultHeaderHeight,
    BlurGradientDefaultIntensity,
    type BlurGradientPosition
} from './constant/blur-gradient.constant';
import { blurGradientGetBackdropFilter } from './utils/blur-gradient-get-backdrop-filter.util';

import type { CSSProperties, ReactNode } from 'react';

interface Props {
    readonly animatedBlurProps?: unknown;
    readonly children?: ReactNode;
    readonly edgeOffset?: number;
    readonly height?: number;
    readonly intensity?: number;
    readonly position: BlurGradientPosition;
    readonly safeAreaTop?: number;
}

type WebOverlayStyleConfig = {
    readonly backgroundImage: string;
    readonly maskImage: string;
};

const WebOverlayTopDarkBackground =
    'linear-gradient(to bottom, rgba(0, 0, 0, 0.42) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(0, 0, 0, 0.08) 72%, rgba(0, 0, 0, 0) 100%)';
const WebOverlayBottomDarkBackground =
    'linear-gradient(to top, rgba(0, 0, 0, 0.42) 0%, rgba(0, 0, 0, 0.22) 42%, rgba(0, 0, 0, 0.08) 72%, rgba(0, 0, 0, 0) 100%)';
const WebOverlayTopLightBackground =
    'linear-gradient(to bottom, rgba(255, 255, 255, 0.36) 0%, rgba(255, 255, 255, 0.18) 42%, rgba(255, 255, 255, 0.06) 72%, rgba(255, 255, 255, 0) 100%)';
const WebOverlayBottomLightBackground =
    'linear-gradient(to top, rgba(255, 255, 255, 0.36) 0%, rgba(255, 255, 255, 0.18) 42%, rgba(255, 255, 255, 0.06) 72%, rgba(255, 255, 255, 0) 100%)';
const WebOverlayTopMask =
    'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.96) 24%, rgba(0, 0, 0, 0.72) 48%, rgba(0, 0, 0, 0.24) 76%, rgba(0, 0, 0, 0) 100%)';
const WebOverlayBottomMask =
    'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.96) 24%, rgba(0, 0, 0, 0.72) 48%, rgba(0, 0, 0, 0.24) 76%, rgba(0, 0, 0, 0) 100%)';

const WebOverlayStyles: Record<ColorSchemaEnum, Record<BlurGradientPosition, WebOverlayStyleConfig>> = {
    [ColorSchemaEnum.Dark]: {
        bottom: {
            backgroundImage: WebOverlayBottomDarkBackground,
            maskImage: WebOverlayBottomMask
        },
        top: {
            backgroundImage: WebOverlayTopDarkBackground,
            maskImage: WebOverlayTopMask
        }
    },
    [ColorSchemaEnum.Light]: {
        bottom: {
            backgroundImage: WebOverlayBottomLightBackground,
            maskImage: WebOverlayBottomMask
        },
        top: {
            backgroundImage: WebOverlayTopLightBackground,
            maskImage: WebOverlayTopMask
        }
    }
};

export const BlurGradient = ({
    children,
    edgeOffset = 0,
    height,
    intensity = BlurGradientDefaultIntensity,
    position,
    safeAreaTop = 0
}: Props) => {
    const { colorScheme } = use(ThemeContext);

    const computedHeight = position === 'top' ? safeAreaTop + BlurGradientDefaultHeaderHeight : BlurGradientDefaultBottomHeight;
    const overlayHeight = height ?? computedHeight;
    const containerHeight = overlayHeight + edgeOffset;
    const edgeStyle = position === 'top' ? { top: -edgeOffset } : { bottom: -edgeOffset };
    const overlayConfig = WebOverlayStyles[colorScheme][position];
    const backdropFilter = blurGradientGetBackdropFilter(intensity);
    const style: CSSProperties = {
        ...edgeStyle,
        WebkitBackdropFilter: backdropFilter,
        WebkitMaskImage: overlayConfig.maskImage,
        backdropFilter,
        backgroundImage: overlayConfig.backgroundImage,
        height: containerHeight,
        left: 0,
        maskImage: overlayConfig.maskImage,
        pointerEvents: 'none',
        position: 'absolute',
        right: 0,
        zIndex: 2
    };

    return (
        <>
            {createElement('div', { style })}
            {children}
        </>
    );
};
