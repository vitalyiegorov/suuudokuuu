import './global.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { isNotEmptyString } from '@rnw-community/shared';

import { MicrosoftClarity } from '../analytics/components/microsoft-clarity/microsoft-clarity';
import {
    CLARITY_PROJECT_ID_ENVIRONMENT_VARIABLE,
    VERCEL_DEPLOYMENT_FLAG,
    VERCEL_ENVIRONMENT_NAME_VARIABLE,
    VERCEL_ENVIRONMENT_VARIABLE,
    VERCEL_PRODUCTION_ENVIRONMENT_NAME
} from '../analytics/constants/analytics.constant';
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
    const clarityProjectId = process.env[CLARITY_PROJECT_ID_ENVIRONMENT_VARIABLE];
    const isVercelDeployment = process.env[VERCEL_ENVIRONMENT_VARIABLE] === VERCEL_DEPLOYMENT_FLAG;
    const isProductionDeployment = process.env[VERCEL_ENVIRONMENT_NAME_VARIABLE] === VERCEL_PRODUCTION_ENVIRONMENT_NAME;
    const isClarityEnabled = isProductionDeployment && isNotEmptyString(clarityProjectId);

    return (
        <html lang={DEFAULT_LOCALE}>
            <body>
                <script dangerouslySetInnerHTML={comfortScaleInitScript} />
                <SiteHeader />
                {children}
                <SiteFooter />
                {isVercelDeployment ? <Analytics /> : null}
                {isProductionDeployment ? <SpeedInsights /> : null}
                {isClarityEnabled ? <MicrosoftClarity projectId={clarityProjectId} /> : null}
            </body>
        </html>
    );
};

export default RootLayout;
