import { SiteDocument } from '../../chrome/components/site-document/site-document';
import { DEFAULT_LOCALE, SITE_VIEWPORT } from '../../seo/constants/site.constant';
import { buildRootMetadata } from '../../seo/utils/build-root-metadata.util';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = SITE_VIEWPORT;

interface Props {
    children: ReactNode;
}

const EnglishLayout = ({ children }: Props) => <SiteDocument locale={DEFAULT_LOCALE}>{children}</SiteDocument>;

export default EnglishLayout;
