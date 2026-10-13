import { statSync } from 'node:fs';
import { join } from 'node:path';

import { extractNodeText } from '../../../seo/utils/extract-node-text.util';
import { findSlots } from '../../../seo/utils/find-slots.util';
import { PrintableDownloadFact } from '../printable-download-fact/printable-download-fact';

import type { ReactNode } from 'react';

const BYTES_PER_KILOBYTE = 1024;

interface Props {
    readonly title: string;
    readonly fileName: string;
    readonly children: ReactNode;
}

export const PrintableDownloadCard = ({ children, fileName, title }: Props) => {
    const factElements = findSlots(children, PrintableDownloadFact);
    const fileSizeKilobytes = Math.ceil(statSync(join(process.cwd(), 'public', 'printable', fileName)).size / BYTES_PER_KILOBYTE);

    return (
        <div className="printable-download">
            <a className="printable-download__cta hero__cta" download href={`/printable/${fileName}`}>
                Download {title} (PDF)
            </a>
            <ul className="printable-download__facts">
                {factElements.map(factElement => (
                    <li key={extractNodeText(factElement.props.children)}>{factElement.props.children}</li>
                ))}
                <li>{fileSizeKilobytes} KB PDF, US Letter</li>
            </ul>
        </div>
    );
};
