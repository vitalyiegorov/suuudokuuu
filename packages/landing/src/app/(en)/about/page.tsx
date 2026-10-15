import Link from 'next/link';

import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { JsonLd } from '../../../seo/components/json-ld/json-ld';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { AUTHOR_PERSON_SCHEMA, SCHEMA_CONTEXT } from '../../../seo/constants/schema.constant';
import {
    DEFAULT_LOCALE,
    SITE_AUTHOR_NAME,
    SITE_AUTHOR_PROFILE_URL,
    SITE_GITHUB_URL,
    SITE_LICENSE,
    SITE_NAME
} from '../../../seo/constants/site.constant';
import { buildLocaleUrl } from '../../../seo/utils/build-locale-url.util';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { sudokuDifficultyRatingPageMetadata } from '../guides/sudoku-difficulty-rating/metadata';
import { homePageMetadata } from '../metadata';
import { techniquesPageMetadata } from '../techniques/metadata';
import { whySuuudokuuuPageMetadata } from '../why-suuudokuuu/metadata';

import { aboutPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(aboutPageMetadata);

const ABOUT_PAGE_SCHEMA = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'AboutPage',
    name: aboutPageMetadata.metaTitle,
    description: aboutPageMetadata.metaDescription,
    url: buildLocaleUrl(DEFAULT_LOCALE, aboutPageMetadata.path),
    mainEntity: AUTHOR_PERSON_SCHEMA
};

const AboutPage = () => (
    <main>
        <JsonLd data={ABOUT_PAGE_SCHEMA} />
        <PageHeader metadata={aboutPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>About</BreadcrumbListItem>
        </PageHeader>
        <p>
            {SITE_NAME} is a free, ad-free Sudoku game for iOS, Android and the web, built and maintained by {SITE_AUTHOR_NAME}. This page
            says who is behind it, what is open for inspection and how to reach the author.
        </p>
        <h2>Who builds {SITE_NAME}</h2>
        <p>
            {SITE_AUTHOR_NAME} is the author and maintainer of the project. His public profile and the rest of his work are on{' '}
            <a href={SITE_AUTHOR_PROFILE_URL}>GitHub</a>. The guides and technique pages on this site are published under his name, and the
            numbers in them come from the same code the game runs, not from hand-written estimates.
        </p>
        <h2>Why the source is public</h2>
        <p>
            The whole project, including the puzzle generator, the solvers, the technique detector, the app and this website, lives in one
            public repository under the {SITE_LICENSE} license: <a href={SITE_GITHUB_URL}>{SITE_GITHUB_URL}</a>. The reasoning is on the{' '}
            <Link href={whySuuudokuuuPageMetadata.path}>why {SITE_NAME}</Link> page: when the code that picks your puzzle and explains your
            hint is public, you do not have to take claims about advertising, tracking or fairness on trust.
        </p>
        <h2>The rating engine</h2>
        <p>
            Every puzzle carries a Sudoku Explainer style difficulty rating on the 1.0 to 12.0 scale. The rating engine is its own package
            in the repository: it runs a full logical solve over the technique ladder, cheapest technique first, and reports the hardest
            technique the cheapest path needed. The same detector powers the in-game hints and the{' '}
            <Link href={techniquesPageMetadata.path}>technique guides</Link>. How the scale works, and what it does and does not measure, is
            written up in the <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link>.
        </p>
        <h2>Contact</h2>
        <p>
            The same link sits in the app’s settings footer. Bug reports, feature requests, wrong technique explanations and corrections to
            a published number all go to the public <a href={`${SITE_GITHUB_URL}/issues`}>issue tracker</a>, where the next reader with the
            same question can find the answer. Pull requests are welcome in the same repository.
        </p>
    </main>
);

export default AboutPage;
