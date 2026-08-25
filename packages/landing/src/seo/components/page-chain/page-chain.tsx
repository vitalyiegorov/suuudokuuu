import { isDefined } from '@rnw-community/shared';

import { PageChainLink } from '../page-chain-link/page-chain-link';

import type { PageMetadataInterface } from '../../interfaces/page-metadata.interface';

interface Props {
    ariaLabel: string;
    previousLabel: string;
    nextLabel: string;
    previous?: Pick<PageMetadataInterface, 'path' | 'title'>;
    next?: Pick<PageMetadataInterface, 'path' | 'title'>;
}

export const PageChain = ({ ariaLabel, next, nextLabel, previous, previousLabel }: Props) => {
    const previousLink = isDefined(previous) ? <PageChainLink label={previousLabel} metadata={previous} /> : null;
    const nextLink = isDefined(next) ? <PageChainLink label={nextLabel} metadata={next} /> : null;

    return (
        <nav aria-label={ariaLabel} className="page-chain">
            {previousLink}
            {nextLink}
        </nav>
    );
};
