import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

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

                <ScrollViewStyleReset />
            </head>

            <body>{children}</body>
        </html>
    );
}
