import { format } from 'date-fns';

const email = 'vitalyiegorov@gmail.com';
const date = format(new Date('2023-05-25'), 'dd MMMM yyyy');

export const privacyPolicyConstant = `
Privacy Policy Effective Date: ${date}

Thank you for choosing Suuudokuuu ("App," "we," "us," or "our").

This Privacy Policy is intended to inform you about the types of information we collect from you when you use our App, how we use that information, and the choices you have regarding our use of your information.

Information We Collect
1.1 Personal Information: We do not knowingly collect personal information from children under the age of 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately at ${email}, and we will take steps to remove that information from our systems.

1.2 Non-Personal Information: When you use our App, we may collect certain non-personal information, such as device information (including device type, operating system version, and unique device identifiers), usage data (such as the features you use within the App and the time spent on each feature), and anonymized user analytics data.

Use of Information
2.1 Non-Personal Information: We use non-personal information for statistical purposes, to improve and optimize our App, and to enhance user experience. This information helps us understand how users interact with our App and allows us to make necessary updates and improvements.

2.2 Third-Party Analytics: We may use third-party analytics tools to collect, measure, and analyze non-personal information. These tools assist us in understanding user behavior and preferences, and they help us provide a better user experience.

3. Data Security
We are committed to protecting the security of your information. We implement reasonable technical and organizational measures to safeguard your data against unauthorized access, loss, or alteration. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.

4. Children's Privacy
Our App is intended for general audiences and does not specifically target or market to children under the age of 13. If a parent or guardian becomes aware that their child has provided us with personal information without their consent, they should contact us at ${email}. We will promptly delete the information from our records.

5. Changes to this Privacy Policy
We may update our Privacy Policy from time to time. We will notify you of any changes by posting the updated Privacy Policy within the App. We recommend that you review this Privacy Policy periodically for any updates or modifications.

6. Contact Us
If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at ${email}.

By using Suuudokuuu, you agree to the collection and use of information as described in this Privacy Policy.

Last updated: ${date}`;
