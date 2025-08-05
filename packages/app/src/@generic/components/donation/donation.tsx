import { i18n } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { donationLinkConstant } from '../../constants/donation.constant';
import { BlackButton } from '../black-button/black-button';

import { DonationStyles as styles } from './donation.styles';

interface Props {
    readonly type: 'loser' | 'paused' | 'winner';
}

// TODO: Add different random texts based on difficulty and results
const getText = (type: Props['type']) => {
    if (type === 'winner') {
        return i18n._(msg`You won and Ukraine needs to!\n\nEvery 1$ donation matters!`);
    } else if (type === 'loser') {
        return i18n._(msg`You lost but Ukraine must win!\n\nEvery 1$ donation matters!`);
    }

    return i18n._(msg`While you were away Ukraine continued its fight for freedom!\n\nEvery 1$ donation matters!`);
};

export const Donation = ({ type }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();

    return (
        <View style={[styles.donation, { borderBottomColor: theme.colors.black, borderTopColor: theme.colors.black }]}>
            <Text allowFontScaling={false} style={[styles.donationText, { color: theme.colors.black }]}>
                {getText(type)}
            </Text>

            <BlackButton href={donationLinkConstant} text={t`Help Ukraine win!`} />
        </View>
    );
};
