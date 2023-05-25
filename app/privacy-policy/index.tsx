import { format } from 'date-fns';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '../../components/header/header';
import { PageHeader } from '../../components/page-header/page-header';
import { PlayAgainButton } from '../../components/play-again-button/play-again-button';

import { PrivacyPolicyStyles as styles } from './privacy-policy.styles';

const email = 'vitalyiegorov@gmail.com';
const date = format(new Date('2023-05-25'), 'dd MMMM yyyy');

const text = `
Privacy Policy Effective Date: ${date}

Thank you for choosing Suuudokuuu ("App," "we," "us," or "our").

This Privacy Policy is intended to inform you about the types of information we collect from you when you use our App,
how we use that information, and the choices you have regarding our use of your information.

Information We Collect

1.1 Personal Information:

We do not collect any personal information that can directly identify you, such as your name,
address, email address, or phone number.

1.2 Non-Personal Information:

When you use our App, we may collect certain
non-personal information, such as device information (including device type, operating system version, and unique device
identifiers), usage data (such as the features you use within the App and the time spent on each feature), and
anonymized user analytics data. Use of Information

2.1 Non-Personal Information:

We use non-personal information for
statistical purposes, to improve and optimize our App, and to enhance user experience. This information helps us
understand how users interact with our App and allows us to make necessary updates and improvements.

2.2 Third-Party

Analytics: We may use third-party analytics tools to collect, measure, and analyze non-personal information. These tools
assist us in understanding user behavior and preferences, and they help us in providing a better user experience. Data
Security We are committed to protecting the security of your information. We implement reasonable technical and
organizational measures to safeguard your data against unauthorized access, loss, or alteration. However, please be
aware that no method of transmission over the internet or electronic storage is 100% secure. While we strive to use
commercially acceptable means to protect your information, we cannot guarantee its absolute security. Children's Privacy
Our App is not intended for use by children under the age of 13. We do not knowingly collect personal information from
children. If you believe that we may have inadvertently collected personal information from a child under 13, please
contact us immediately at ${email}, and we will take appropriate steps to delete such information from our
records.

Changes to this Privacy Policy We may update our Privacy Policy from time to time. We will notify you of any changes by posting the updated Privacy Policy within the App.

We recommend that you review this Privacy Policy periodically for any updates or modifications.

Contact Us If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at ${email}. By using Suuudokuuu, you agree to the collection and use of information as described in this Privacy Policy.

Last updated: ${date}`;
export default function PrivacyPolicy() {
    return (
        <SafeAreaView style={styles.container}>
            <PageHeader title="Privacy policy" />
            <Header text="Privacy policy" />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.text}>{text}</Text>
            </ScrollView>
            <PlayAgainButton />
        </SafeAreaView>
    );
}
