import { SiteDocument } from '../../chrome/components/site-document/site-document';
import { SITE_VIEWPORT } from '../../seo/constants/site.constant';
import { buildRootMetadata } from '../../seo/utils/build-root-metadata.util';
import { resolveLocaleSegment } from '../../seo/utils/resolve-locale-segment.util';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const dynamicParams = false;

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = SITE_VIEWPORT;

interface Props {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}

const LocaleLayout = async ({ children, params }: Props) => {
    const { locale } = await params;

    return <SiteDocument locale={resolveLocaleSegment(locale)}>{children}</SiteDocument>;
};

export default LocaleLayout;
