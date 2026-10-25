import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { SITE_NAME } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { homePageMetadata } from '../metadata';

import { privacyPolicyPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(privacyPolicyPageMetadata);

const CONTACT_EMAIL = 'vitalyiegorov@gmail.com';
const EFFECTIVE_DATE = '25 May 2023';

const PrivacyPolicyPage = () => (
    <main>
        <PageHeader metadata={privacyPolicyPageMetadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem>Privacy policy</BreadcrumbListItem>
        </PageHeader>
        <p>Privacy Policy Effective Date: {EFFECTIVE_DATE}</p>
        <p>Thank you for choosing {SITE_NAME} (“App,” “we,” “us,” or “our”).</p>
        <p>
            This Privacy Policy is intended to inform you about the types of information we collect from you when you use our App, how we
            use that information, and the choices you have regarding our use of your information.
        </p>
        <h2>Information We Collect</h2>
        <p>
            1.1 Personal Information: We do not knowingly collect personal information from children under the age of 13. If you are a
            parent or guardian and believe that your child has provided us with personal information, please contact us immediately at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, and we will take steps to remove that information from our systems.
        </p>
        <p>
            1.2 Non-Personal Information: When you use our App, we may collect certain non-personal information, such as device information
            (including device type, operating system version, and unique device identifiers), usage data (such as the features you use
            within the App and the time spent on each feature), and anonymized user analytics data.
        </p>
        <h2>Use of Information</h2>
        <p>
            2.1 Non-Personal Information: We use non-personal information for statistical purposes, to improve and optimize our App, and to
            enhance user experience. This information helps us understand how users interact with our App and allows us to make necessary
            updates and improvements.
        </p>
        <p>
            2.2 Third-Party Analytics: We may use third-party analytics tools to collect, measure, and analyze non-personal information.
            These tools assist us in understanding user behavior and preferences, and they help us provide a better user experience.
        </p>
        <h2>3. Data Security</h2>
        <p>
            We are committed to protecting the security of your information. We implement reasonable technical and organizational measures
            to safeguard your data against unauthorized access, loss, or alteration. However, please be aware that no method of transmission
            over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your
            information, we cannot guarantee its absolute security.
        </p>
        <h2>4. Children’s Privacy</h2>
        <p>
            Our App is intended for general audiences and does not specifically target or market to children under the age of 13. If a
            parent or guardian becomes aware that their child has provided us with personal information without their consent, they should
            contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will promptly delete the information from our records.
        </p>
        <h2>5. Changes to this Privacy Policy</h2>
        <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the updated Privacy Policy
            within the App. We recommend that you review this Privacy Policy periodically for any updates or modifications.
        </p>
        <h2>6. Contact Us</h2>
        <p>
            If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <p>By using {SITE_NAME}, you agree to the collection and use of information as described in this Privacy Policy.</p>
        <p>Last updated: {EFFECTIVE_DATE}</p>
    </main>
);

export default PrivacyPolicyPage;
