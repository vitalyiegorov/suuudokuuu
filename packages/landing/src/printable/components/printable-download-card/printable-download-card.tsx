import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { Trans } from '@lingui/react/macro';

import { printableSudokuPageMetadata } from '../../../app/(en)/printable/metadata';
import { getActiveLocale } from '../../../i18n/utils/get-active-locale.util';
import { buildLocalePath } from '../../../seo/utils/build-locale-path.util';
import { extractNodeText } from '../../../seo/utils/extract-node-text.util';
import { findSlots } from '../../../seo/utils/find-slots.util';
import { PrintableDownloadFact } from '../printable-download-fact/printable-download-fact';

import type { ReactNode } from 'react';

const BYTES_PER_KILOBYTE = 1024;

const resolvePublicFile = (filePath: string): string => join(process.cwd(), 'public', filePath);

interface Props {
    readonly title: string;
    readonly fileName: string;
    readonly children: ReactNode;
}

export const PrintableDownloadCard = ({ children, fileName, title }: Props) => {
    const factElements = findSlots(children, PrintableDownloadFact);
    const localizedFilePath = `${buildLocalePath(getActiveLocale(), printableSudokuPageMetadata.path)}/${fileName}`;
    const filePath = existsSync(resolvePublicFile(localizedFilePath))
        ? localizedFilePath
        : `${printableSudokuPageMetadata.path}/${fileName}`;
    const fileSizeKilobytes = Math.ceil(statSync(resolvePublicFile(filePath)).size / BYTES_PER_KILOBYTE);

    return (
        <div className="printable-download">
            <a className="printable-download__cta hero__cta" download href={filePath}>
                <Trans>Download {title} (PDF)</Trans>
            </a>
            <ul className="printable-download__facts">
                {factElements.map(factElement => (
                    <li key={extractNodeText(factElement.props.children)}>{factElement.props.children}</li>
                ))}
                <li>
                    <Trans>{fileSizeKilobytes} KB PDF, US Letter</Trans>
                </li>
            </ul>
        </div>
    );
};
