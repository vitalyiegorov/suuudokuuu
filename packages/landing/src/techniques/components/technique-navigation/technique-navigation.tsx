import { isDefined } from '@rnw-community/shared';

import { TechniqueNavigationLink } from '../technique-navigation-link/technique-navigation-link';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

interface Props {
    previous?: Pick<PageMetadataInterface, 'path' | 'title'>;
    next?: Pick<PageMetadataInterface, 'path' | 'title'>;
}

export const TechniqueNavigation = ({ next, previous }: Props) => {
    const previousLink = isDefined(previous) ? <TechniqueNavigationLink label="Previous technique" metadata={previous} /> : null;
    const nextLink = isDefined(next) ? <TechniqueNavigationLink label="Continue to" metadata={next} /> : null;

    return (
        <nav aria-label="Technique difficulty chain" className="technique-chain">
            {previousLink}
            {nextLink}
        </nav>
    );
};
