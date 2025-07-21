import { donationLinkConstant } from '../../constants/donation.constant';
import { BlackButton } from '../black-button/black-button';

export const DonateButton = () => <BlackButton href={donationLinkConstant} text="Help Ukraine win!" />;
