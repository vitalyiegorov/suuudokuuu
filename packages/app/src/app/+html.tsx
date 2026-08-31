import '../theme/unistyles.config';

import { msg } from '@lingui/core/macro';
import { ScrollViewStyleReset } from 'expo-router/html';

import { brandConfig } from '../../brand.config';

import type { PropsWithChildren } from 'react';

const DefaultTitle = msg`Suuudokuuu — Free Online Sudoku, No Ads`.message ?? '';
const DefaultDescription =
    msg`Play free Sudoku online with six difficulty levels, hints, and no ads. Fast, distraction-free puzzles that work great on any device.`
        .message ?? '';
const DefaultOgImageUrl = `${brandConfig.webOrigin}icon.png`;

/*
 * This file is web-only and used to configure the root HTML for every
 * web stripe-checkout-form during static rendering.
 * The contents of this function only run in Node.js environments and
 * do not have access to the DOM or browser APIs.
 */
export default function Root({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />

                <meta content="IE=edge" httpEquiv="X-UA-Compatible" />

                <meta content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no" name="viewport" />
                <meta content="app-id=6449440933" name="apple-itunes-app" />

                <title>{DefaultTitle}</title>
                <meta content={DefaultDescription} name="description" />
                <meta content={brandConfig.splashBackgroundColor} name="theme-color" />

                <meta content={DefaultTitle} property="og:title" />
                <meta content={DefaultDescription} property="og:description" />
                <meta content="website" property="og:type" />
                <meta content={brandConfig.webOrigin} property="og:url" />
                <meta content={DefaultOgImageUrl} property="og:image" />

                <meta content="summary_large_image" name="twitter:card" />
                <meta content={DefaultTitle} name="twitter:title" />
                <meta content={DefaultDescription} name="twitter:description" />
                <meta content={DefaultOgImageUrl} name="twitter:image" />

                <link href="/manifest.json" rel="manifest" />

                <ScrollViewStyleReset />
            </head>

            <body>{children}</body>
        </html>
    );
}
