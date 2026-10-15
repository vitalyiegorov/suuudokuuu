import { Trans, useLingui } from '@lingui/react/macro';
import Link from 'next/link';

import { dailySudokuPageMetadata } from '../../../app/(en)/daily-sudoku/metadata';
import { glossaryPageMetadata } from '../../../app/(en)/glossary/metadata';
import { sudokuCluesVsDifficultyPageMetadata } from '../../../app/(en)/guides/sudoku-clues-vs-difficulty/metadata';
import { sudokuDifficultyRatingPageMetadata } from '../../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { howToPlayPageMetadata } from '../../../app/(en)/how-to-play/metadata';
import { largePrintSudokuPageMetadata } from '../../../app/(en)/large-print-sudoku/metadata';
import { printableSudokuPageMetadata } from '../../../app/(en)/printable/metadata';
import { solverPageMetadata } from '../../../app/(en)/solver/metadata';
import { sudokuForSeniorsPageMetadata } from '../../../app/(en)/sudoku-for-seniors/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/(en)/sudoku/metadata';
import { techniquesPageMetadata } from '../../../app/(en)/techniques/metadata';
import { whySuuudokuuuPageMetadata } from '../../../app/(en)/why-suuudokuuu/metadata';
import { SITE_GITHUB_URL, SITE_LICENSE, SITE_NAME, SITE_PLAY_URL, SITE_PRIVACY_URL } from '../../../seo/constants/site.constant';
import { StoreBadgeCampaignEnum } from '../../enums/store-badge-campaign.enum';
import { StoreBadges } from '../store-badges/store-badges';

// oxlint-disable-next-line max-lines-per-function -- Layout/form component requires many lines
export const SiteFooter = () => {
    const { t } = useLingui();

    return (
        <footer className="site-footer">
            <div className="site-footer__top">
                <div className="site-footer__brand-block">
                    <p className="site-footer__brand">{SITE_NAME}</p>
                    <p className="site-footer__tagline">
                        <Trans>Free offline Sudoku for iOS, Android and the web</Trans>
                    </p>
                    <StoreBadges campaign={StoreBadgeCampaignEnum.FOOTER} />
                </div>
                <nav aria-label={t`Footer`} className="site-footer__nav">
                    <div className="site-footer__group">
                        <p className="site-footer__group-title">
                            <Trans>Learn</Trans>
                        </p>
                        <Link href={howToPlayPageMetadata.path}>
                            <Trans>How to play</Trans>
                        </Link>
                        <Link href={techniquesPageMetadata.path}>
                            <Trans>Sudoku techniques</Trans>
                        </Link>
                        <Link href={glossaryPageMetadata.path}>
                            <Trans>Sudoku glossary</Trans>
                        </Link>
                        <Link href={sudokuDifficultyRatingPageMetadata.path}>
                            <Trans>Difficulty rating</Trans>
                        </Link>
                        <Link href={sudokuCluesVsDifficultyPageMetadata.path}>
                            <Trans>Clues versus difficulty</Trans>
                        </Link>
                    </div>
                    <div className="site-footer__group">
                        <p className="site-footer__group-title">
                            <Trans>Play</Trans>
                        </p>
                        <Link href={dailySudokuPageMetadata.path}>
                            <Trans>Daily sudoku</Trans>
                        </Link>
                        <Link href={sudokuDifficultiesPageMetadata.path}>
                            <Trans>Difficulty levels</Trans>
                        </Link>
                        <Link href={solverPageMetadata.path}>
                            <Trans>Sudoku solver</Trans>
                        </Link>
                        <a href={SITE_PLAY_URL}>
                            <Trans>Play {SITE_NAME}</Trans>
                        </a>
                    </div>
                    <div className="site-footer__group">
                        <p className="site-footer__group-title">
                            <Trans>Print</Trans>
                        </p>
                        <Link href={printableSudokuPageMetadata.path}>
                            <Trans>Printable sudoku</Trans>
                        </Link>
                        <Link href={largePrintSudokuPageMetadata.path}>
                            <Trans>Large print sudoku</Trans>
                        </Link>
                        <Link href={sudokuForSeniorsPageMetadata.path}>
                            <Trans>Sudoku for seniors</Trans>
                        </Link>
                    </div>
                    <div className="site-footer__group">
                        <p className="site-footer__group-title">
                            <Trans>Project</Trans>
                        </p>
                        <Link href={whySuuudokuuuPageMetadata.path}>
                            <Trans>Why {SITE_NAME}</Trans>
                        </Link>
                        <a href={SITE_GITHUB_URL}>
                            <Trans>Source on GitHub</Trans>
                        </a>
                        <a href={SITE_PRIVACY_URL}>
                            <Trans>Privacy policy</Trans>
                        </a>
                    </div>
                </nav>
            </div>
            <p className="site-footer__note">
                <Trans>
                    Free and open source under the {SITE_LICENSE} license. No ads, no account, no tracking in the game — read{' '}
                    <Link href={whySuuudokuuuPageMetadata.path}>why</Link> or browse the <a href={SITE_GITHUB_URL}>full source on GitHub</a>
                    . Apple and the Apple logo are trademarks of Apple Inc., registered in the U.S. and other countries. App Store is a
                    service mark of Apple Inc. Google Play and the Google Play logo are trademarks of Google LLC.
                </Trans>
            </p>
        </footer>
    );
};
