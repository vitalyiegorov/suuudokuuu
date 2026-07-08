import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { donationLinkConstant } from '../../constants/donation.constant';
import { donationGetText } from '../../utils/donation-get-text.util';
import { BlackButton } from '../black-button/black-button';

import { DonationStyles as styles } from './donation.styles';

interface Props {
    readonly type: 'loser' | 'paused' | 'winner';
}

export const Donation = ({ type }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();

    const wrapperStyles = [styles.donation, { borderBottomColor: theme.colors.black, borderTopColor: theme.colors.black }];
    const textStyles = [styles.donationText, { color: theme.colors.black }];

    return (
        <View style={wrapperStyles}>
            <Text allowFontScaling={false} style={textStyles}>
                {donationGetText(type)}
            </Text>

            <BlackButton href={donationLinkConstant} text={t`Help Ukraine win!`} />
        </View>
    );
};
