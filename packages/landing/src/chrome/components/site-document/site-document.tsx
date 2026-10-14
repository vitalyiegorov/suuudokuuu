import '../../../app/global.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { isNotEmptyString } from '@rnw-community/shared';

import { MicrosoftClarity } from '../../../analytics/components/microsoft-clarity/microsoft-clarity';
import {
    CLARITY_PROJECT_ID_ENVIRONMENT_VARIABLE,
    VERCEL_DEPLOYMENT_FLAG,
    VERCEL_ENVIRONMENT_NAME_VARIABLE,
    VERCEL_ENVIRONMENT_VARIABLE,
    VERCEL_PRODUCTION_ENVIRONMENT_NAME
} from '../../../analytics/constants/analytics.constant';
import { activateLocale } from '../../../i18n/utils/activate-locale.util';
import { RIGHT_TO_LEFT_LOCALES } from '../../../seo/constants/site.constant';
import { buildComfortScaleInitScript } from '../../utils/build-comfort-scale-init-script.util';
import { SiteFooter } from '../site-footer/site-footer';
import { SiteHeader } from '../site-header/site-header';

import type { LocaleType } from '../../../seo/types/locale.type';
import type { ReactNode } from 'react';

interface Props {
    locale: LocaleType;
    children: ReactNode;
}

export const SiteDocument = ({ children, locale }: Props) => {
    activateLocale(locale);
    const comfortScaleInitScript = { __html: buildComfortScaleInitScript() };
    const direction = RIGHT_TO_LEFT_LOCALES.includes(locale) ? 'rtl' : 'ltr';
    const clarityProjectId = process.env[CLARITY_PROJECT_ID_ENVIRONMENT_VARIABLE];
    const isVercelDeployment = process.env[VERCEL_ENVIRONMENT_VARIABLE] === VERCEL_DEPLOYMENT_FLAG;
    const isProductionDeployment = process.env[VERCEL_ENVIRONMENT_NAME_VARIABLE] === VERCEL_PRODUCTION_ENVIRONMENT_NAME;
    const isClarityEnabled = isProductionDeployment && isNotEmptyString(clarityProjectId);

    return (
        <html dir={direction} lang={locale}>
            <body>
                <script dangerouslySetInnerHTML={comfortScaleInitScript} />
                <SiteHeader locale={locale} />
                {children}
                <SiteFooter />
                {isVercelDeployment ? <Analytics /> : null}
                {isProductionDeployment ? <SpeedInsights /> : null}
                {isClarityEnabled ? <MicrosoftClarity projectId={clarityProjectId} /> : null}
            </body>
        </html>
    );
};
