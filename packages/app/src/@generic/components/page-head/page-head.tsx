import Head from 'expo-router/head';

import { isNotEmptyString } from '@rnw-community/shared';

interface Props {
    readonly title?: string;
    readonly description?: string;
    readonly noIndex?: boolean;
}

export const PageHead = ({ title, description, noIndex = false }: Props) => (
    <Head>
        {isNotEmptyString(title) && <title>{title}</title>}
        {isNotEmptyString(description) && <meta content={description} name="description" />}
        {noIndex && <meta content="noindex" name="robots" />}
    </Head>
);
