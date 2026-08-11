import './global.css';
import { SiteFooter } from '../chrome/components/site-footer/site-footer';
import { SiteHeader } from '../chrome/components/site-header/site-header';
import { DEFAULT_LOCALE, SITE_NAME, SITE_ORIGIN, SITE_THEME_COLOR } from '../seo/constants/site.constant';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
    metadataBase: new URL(SITE_ORIGIN),
    applicationName: SITE_NAME,
    robots: { index: true, follow: true }
};

export const viewport: Viewport = {
    themeColor: SITE_THEME_COLOR,
    colorScheme: 'dark'
};

interface Props {
    children: ReactNode;
}

const RootLayout = ({ children }: Props) => (
    <html lang={DEFAULT_LOCALE}>
        <body>
            <SiteHeader />
            {children}
            <SiteFooter />
        </body>
    </html>
);

export default RootLayout;
