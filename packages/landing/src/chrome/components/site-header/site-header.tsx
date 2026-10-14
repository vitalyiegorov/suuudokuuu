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
import { buildLocalePath } from '../../../seo/utils/build-locale-path.util';
import { getPageLocales } from '../../../seo/utils/get-page-locales.util';
import { ComfortScaleStepEnum } from '../../enums/comfort-scale-step.enum';
import { ComfortControl } from '../comfort-control/comfort-control';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

import type { LocaleType } from '../../../seo/types/locale.type';

const TRANSLATED_PAGE_LOCALES = Object.fromEntries(
    PAGE_METADATA_REGISTRY.filter(({ translations }) => isDefined(translations)).map(pageMetadata => [
        pageMetadata.path,
        getPageLocales(pageMetadata)
    ])
);

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
    const homePath = getPageLocales(homePageMetadata).includes(locale)
        ? buildLocalePath(locale, homePageMetadata.path)
        : homePageMetadata.path;

    return (
        <header className="site-header">
            <Link className="site-header__brand" href={homePath}>
                <img alt="" className="site-header__mark" height={32} src="/brand/icon-64.png" width={32} />
                {SITE_NAME}
            </Link>
            <nav aria-label={t`Primary`} className="site-header__nav">
                <Link href={howToPlayPageMetadata.path}>
                    <Trans>How to play</Trans>
                </Link>
                <Link href={techniquesPageMetadata.path}>
                    <Trans>Techniques</Trans>
                </Link>
                <Link href={sudokuDifficultiesPageMetadata.path}>
                    <Trans>Difficulty</Trans>
                </Link>
                <Link href={solverPageMetadata.path}>
                    <Trans>Solver</Trans>
                </Link>
                <Link href={printableSudokuPageMetadata.path}>
                    <Trans>Printable</Trans>
                </Link>
            </nav>
            <div className="site-header__controls">
                <LanguageSwitcher label={t`Language`} locale={locale} translatedPageLocales={TRANSLATED_PAGE_LOCALES} />
                <ComfortControl label={t`Text size`} stepLabels={comfortStepLabels} />
                <a className="site-header__play" href={SITE_PLAY_URL}>
                    <Trans>Play</Trans>
                </a>
            </div>
        </header>
    );
};
