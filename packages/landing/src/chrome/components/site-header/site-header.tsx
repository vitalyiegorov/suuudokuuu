import { Trans, useLingui } from '@lingui/react/macro';
import Link from 'next/link';

import { isDefined } from '@rnw-community/shared';

import { howToPlayPageMetadata } from '../../../app/(en)/how-to-play/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { printableSudokuPageMetadata } from '../../../app/(en)/printable/metadata';
import { solverPageMetadata } from '../../../app/(en)/solver/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/(en)/sudoku/metadata';
import { techniquesPageMetadata } from '../../../app/(en)/techniques/metadata';
import { SITE_NAME, SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { PAGE_METADATA_REGISTRY } from '../../../seo/registries/page-metadata.registry';
import { buildLocalizedPagePath } from '../../../seo/utils/build-localized-page-path.util';
import { getPageLocales } from '../../../seo/utils/get-page-locales.util';
import { ComfortScaleStepEnum } from '../../enums/comfort-scale-step.enum';
import { ComfortControl } from '../comfort-control/comfort-control';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';
import type { LocaleType } from '../../../seo/types/locale.type';
import type { TranslatedPageGroupInterface } from '../../interfaces/translated-page-group.interface';

const TRANSLATED_PAGES = PAGE_METADATA_REGISTRY.filter(({ translations }) => isDefined(translations));

const hasSameLocales = (firstPage: PageMetadataInterface, secondPage: PageMetadataInterface): boolean =>
    getPageLocales(firstPage).join() === getPageLocales(secondPage).join();

const TRANSLATED_PAGE_GROUPS: readonly TranslatedPageGroupInterface[] = TRANSLATED_PAGES.filter(
    (pageMetadata, index) => TRANSLATED_PAGES.findIndex(otherPage => hasSameLocales(otherPage, pageMetadata)) === index
).map(pageMetadata => ({
    locales: getPageLocales(pageMetadata),
    paths: TRANSLATED_PAGES.filter(otherPage => hasSameLocales(otherPage, pageMetadata)).map(({ path }) => path)
}));

interface Props {
    locale: LocaleType;
}

export const SiteHeader = ({ locale }: Props) => {
    const { t } = useLingui();
    const comfortStepLabels = {
        [ComfortScaleStepEnum.DEFAULT]: t`Default text size`,
        [ComfortScaleStepEnum.LARGE]: t`Large text size`,
        [ComfortScaleStepEnum.LARGEST]: t`Largest text size`
    };

    return (
        <header className="site-header">
            <Link className="site-header__brand" href={buildLocalizedPagePath(homePageMetadata)}>
                <img alt="" className="site-header__mark" height={32} src="/brand/icon-64.png" width={32} />
                {SITE_NAME}
            </Link>
            <div className="site-header__links">
                <nav aria-label={t`Primary`} className="site-header__nav">
                    <Link href={buildLocalizedPagePath(howToPlayPageMetadata)}>
                        <Trans>How to play</Trans>
                    </Link>
                    <Link href={buildLocalizedPagePath(techniquesPageMetadata)}>
                        <Trans>Techniques</Trans>
                    </Link>
                    <Link href={buildLocalizedPagePath(sudokuDifficultiesPageMetadata)}>
                        <Trans>Difficulty</Trans>
                    </Link>
                    <Link href={buildLocalizedPagePath(solverPageMetadata)}>
                        <Trans>Solver</Trans>
                    </Link>
                    <Link href={buildLocalizedPagePath(printableSudokuPageMetadata)}>
                        <Trans>Printable</Trans>
                    </Link>
                </nav>
                <LanguageSwitcher label={t`Language`} locale={locale} translatedPageGroups={TRANSLATED_PAGE_GROUPS} />
            </div>
            <div className="site-header__controls">
                <ComfortControl label={t`Text size`} stepLabels={comfortStepLabels} />
                <a className="site-header__play" href={SITE_PLAY_URL}>
                    <Trans>Play</Trans>
                </a>
            </div>
        </header>
    );
};
