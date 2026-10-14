import { SITE_APP_STORE_PROVIDER_TOKEN, SITE_APP_STORE_URL, SITE_GOOGLE_PLAY_URL, SITE_ORIGIN } from '../../../seo/constants/site.constant';

import type { StoreBadgeCampaignEnum } from '../../enums/store-badge-campaign.enum';

const CAMPAIGN_SOURCE = new URL(SITE_ORIGIN).hostname;

interface Props {
    campaign: StoreBadgeCampaignEnum;
}

export const StoreBadges = ({ campaign }: Props) => {
    const appStoreParameters = new URLSearchParams({ pt: SITE_APP_STORE_PROVIDER_TOKEN, ct: campaign, mt: '8' });
    const googlePlayReferrer = new URLSearchParams({ utm_source: CAMPAIGN_SOURCE, utm_medium: 'badge', utm_campaign: campaign });
    const googlePlayParameters = new URLSearchParams({ referrer: googlePlayReferrer.toString() });

    return (
        <div className="store-badges">
            <a href={`${SITE_APP_STORE_URL}?${appStoreParameters.toString()}`}>
                <img alt="Download on the App Store" height={40} src="/brand/app-store-badge.svg" width={120} />
            </a>
            <a href={`${SITE_GOOGLE_PLAY_URL}&${googlePlayParameters.toString()}`}>
                <img alt="Get it on Google Play" height={40} src="/brand/google-play-badge.png" width={135} />
            </a>
        </div>
    );
};
