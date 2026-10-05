import Head from 'expo-router/head';

import { isNotEmptyString } from '@rnw-community/shared';

interface Props {
    readonly title?: string;
    readonly description?: string;
    readonly isNoIndex?: boolean;
}

export const PageHead = ({ title, description, isNoIndex = false }: Props) => (
    <Head>
        {isNotEmptyString(title) && <title>{title}</title>}
        {isNotEmptyString(description) && <meta content={description} name="description" />}
        {isNoIndex && <meta content="noindex" name="robots" />}
    </Head>
);
