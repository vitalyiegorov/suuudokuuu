import { Trans } from '@lingui/react/macro';
import Link from 'next/link';

import { techniquesPageMetadata } from '../../../app/(en)/techniques/metadata';
import { FaqAnswer } from '../../../seo/components/faq-answer/faq-answer';
import { FaqHeading } from '../../../seo/components/faq-heading/faq-heading';
import { FaqPage } from '../../../seo/components/faq-page/faq-page';
import { FaqQuestion } from '../../../seo/components/faq-question/faq-question';
import { Faq } from '../../../seo/components/faq/faq';
import { buildLocalizedPagePath } from '../../../seo/utils/build-localized-page-path.util';

export const HowToPlayFaq = () => (
    <FaqPage>
        <FaqHeading>
            <Trans>How to play Sudoku FAQ</Trans>
        </FaqHeading>
        <Faq>
            <FaqQuestion>
                <Trans>Can a Sudoku have two solutions?</Trans>
            </FaqQuestion>
            <FaqAnswer>
                <Trans>
                    A well-formed Sudoku never does. If a puzzle has more than one valid completion it is considered broken, because logic
                    alone can no longer point to a single answer.
                </Trans>
            </FaqAnswer>
        </Faq>
        <Faq>
            <FaqQuestion>
                <Trans>Do you ever have to guess?</Trans>
            </FaqQuestion>
            <FaqAnswer>
                <Trans>
                    No. Every puzzle Suuudokuuu generates is checked for a unique solution at generation time, so no cell ever requires a
                    guess — and the bundled Hell-difficulty puzzles are additionally cross-checked by two independent solving algorithms, a
                    Dancing Links exact-cover solver and a bitmask solver, before they ship. Any position that looks ambiguous just needs a
                    technique that has not been tried yet.
                </Trans>
            </FaqAnswer>
        </Faq>
        <Faq>
            <FaqQuestion>
                <Trans>What is the difference between a clue and a candidate?</Trans>
            </FaqQuestion>
            <FaqAnswer>
                <Trans>
                    A clue, or given, is a digit printed on the board before you start. A candidate is a digit you are still considering for
                    a blank cell, based on what its row, column and box currently rule out.
                </Trans>
            </FaqAnswer>
        </Faq>
        <Faq>
            <FaqQuestion>
                <Trans>Do I need pen and paper to solve Sudoku?</Trans>
            </FaqQuestion>
            <FaqAnswer>
                <Trans>
                    No. Notes mode in an app tracks candidates for you and updates them automatically as you place digits, and undo takes
                    back a mistake without erasing.
                </Trans>
            </FaqAnswer>
        </Faq>
        <Faq>
            <FaqQuestion>
                <Trans>What is the fastest way to get better at Sudoku?</Trans>
            </FaqQuestion>
            <FaqAnswer>
                <Trans>
                    Learn techniques in difficulty order rather than memorising every pattern at once. The{' '}
                    <Link href={buildLocalizedPagePath(techniquesPageMetadata)}>sudoku techniques index</Link> lists them from full house up
                    to the subset patterns, each with a worked example.
                </Trans>
            </FaqAnswer>
        </Faq>
    </FaqPage>
);
