import Link from 'next/link';

import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { SITE_AUTHOR_NAME, SITE_LICENSE, SITE_LICENSE_URL, SITE_NAME } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { homePageMetadata } from '../metadata';
import { privacyPolicyPageMetadata } from '../privacy-policy/metadata';

import { termsOfUsePageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(termsOfUsePageMetadata);

const CONTACT_EMAIL = 'vitalyiegorov@gmail.com';
const EFFECTIVE_DATE = '5 November 2026';

const TermsOfUsePage = () => (
    <main>
        <PageHeader metadata={termsOfUsePageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Terms of use</BreadcrumbListItem>
        </PageHeader>
        <p>Terms of Use Effective Date: {EFFECTIVE_DATE}</p>
        <p>
            These terms apply to the {SITE_NAME} sudoku apps for iOS and Android and to the {SITE_NAME} website (together, the “App”). By
            using the App, you agree to them. If you do not agree, please do not use it.
        </p>
        <h2>1. Who We Are</h2>
        <p>
            {SITE_NAME} is provided by {SITE_AUTHOR_NAME} (“we,” “us,” or “our”), acting as a trader. Our trader details are shown on the
            App’s Google Play listing, and you can reach us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <h2>2. The App</h2>
        <p>
            The App is a sudoku game with learning material. It is free to use, shows no ads, has no in-app purchases, and does not require
            an account.
        </p>
        <h2>3. Permission to Use the App</h2>
        <p>
            You may use the App for your personal, non-commercial enjoyment. The {SITE_NAME} source code is separately available under the{' '}
            <a href={SITE_LICENSE_URL}>{SITE_LICENSE} license</a>, and nothing in these terms limits the rights that license gives you over
            that code. The {SITE_NAME} name and logo remain ours.
        </p>
        <h2>4. App Stores</h2>
        <p>
            If you download the App from an app store, that store’s terms also apply to your download. On iOS, your license to the App is
            governed by{' '}
            <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">
                Apple’s Licensed Application End User License Agreement
            </a>
            , and these terms apply where they do not conflict with it. On Android, the{' '}
            <a href="https://play.google.com/about/play-terms/">Google Play Terms of Service</a> apply. Apple and Google are not responsible
            for the App or for support of it.
        </p>
        <h2>5. Acceptable Use</h2>
        <p>
            Please do not use the App unlawfully, try to disrupt the website or its availability to others, or present the App or its name
            as your own.
        </p>
        <h2>6. Your Game Data and Privacy</h2>
        <p>
            Your game progress is stored on your device or in your browser, and removing the App or clearing its data may permanently delete
            it, because we hold no copy. Links you choose to share, such as a challenge to a friend, contain puzzle data that anyone with
            the link can open. Our <Link href={privacyPolicyPageMetadata.path}>Privacy Policy</Link> explains how information is handled.
        </p>
        <h2>7. Changes to the App</h2>
        <p>
            We may update, change, or stop offering the App or any of its features, for example to fix problems, keep it secure, or improve
            it. We will keep these changes proportionate, and where the law requires it we will tell you in advance.
        </p>
        <h2>8. Your Consumer Rights</h2>
        <p>
            Nothing in these terms removes rights you have under the mandatory consumer protection law of the country where you live. If you
            live in the European Economic Area or the United Kingdom, that includes your statutory rights where digital content or a digital
            service does not conform to the contract, and your right to bring a claim in the courts of your country. If something is wrong
            with the App, please contact us first at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <h2>9. Disclaimer and Liability</h2>
        <p>
            To the extent the law allows, the App is provided “as is” and “as available,” without warranties of any kind, and we are not
            liable for indirect or consequential loss or for lost game progress. This section does not limit liability that cannot be
            limited by law, including liability for death or personal injury caused by negligence, for fraud, or under the consumer rights
            described in section 8.
        </p>
        <h2>10. Changes to These Terms</h2>
        <p>
            We may update these terms from time to time. We will post the updated version on this page with a new effective date. If a
            change is significant, we will also tell you within the App where we reasonably can.
        </p>
        <h2>11. Contact Us</h2>
        <p>
            If you have any questions or complaints about these terms or the App, please contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <p>Last updated: {EFFECTIVE_DATE}</p>
    </main>
);

export default TermsOfUsePage;
