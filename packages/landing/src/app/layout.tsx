import './global.css';
import { SiteFooter } from '../chrome/components/site-footer/site-footer';
import { SiteHeader } from '../chrome/components/site-header/site-header';
import { buildComfortScaleInitScript } from '../chrome/utils/build-comfort-scale-init-script.util';
import { DEFAULT_LOCALE, SITE_THEME_COLOR } from '../seo/constants/site.constant';
import { buildRootMetadata } from '../seo/utils/build-root-metadata.util';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
    themeColor: SITE_THEME_COLOR,
    colorScheme: 'dark'
};

interface Props {
    children: ReactNode;
}

const RootLayout = ({ children }: Props) => {
    const comfortScaleInitScript = { __html: buildComfortScaleInitScript() };

    return (
        <html lang={DEFAULT_LOCALE}>
            <body>
                <script dangerouslySetInnerHTML={comfortScaleInitScript} />
                <SiteHeader />
                {children}
                <SiteFooter />
            </body>
        </html>
    );
};

export default RootLayout;
