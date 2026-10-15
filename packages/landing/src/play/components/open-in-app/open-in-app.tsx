import { StoreBadges } from '../../../chrome/components/store-badges/store-badges';
import { StoreBadgeCampaignEnum } from '../../../chrome/enums/store-badge-campaign.enum';
import { SITE_NAME, SITE_PLAY_URL } from '../../../seo/constants/site.constant';

export const OpenInApp = () => (
    <>
        <a className="hero__cta" href={SITE_PLAY_URL}>
            Open {SITE_NAME}
        </a>
        <StoreBadges campaign={StoreBadgeCampaignEnum.CONTENT} />
    </>
);
