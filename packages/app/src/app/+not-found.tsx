import { Redirect } from 'expo-router';

import { HomeHrefConstant } from '../@generic/constants/home-href.constant';

export default function NotFound() {
    return <Redirect href={HomeHrefConstant} />;
}
