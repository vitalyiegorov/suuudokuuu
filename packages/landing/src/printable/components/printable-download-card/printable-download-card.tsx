import { extractNodeText } from '../../../seo/utils/extract-node-text.util';
import { findSlots } from '../../../seo/utils/find-slots.util';
import { PrintableDownloadFact } from '../printable-download-fact/printable-download-fact';

import type { ReactNode } from 'react';

interface Props {
    title: string;
    fileName: string;
    children: ReactNode;
}

export const PrintableDownloadCard = ({ children, fileName, title }: Props) => {
    const factElements = findSlots(children, PrintableDownloadFact);

    return (
        <div className="printable-download">
            <a className="printable-download__cta hero__cta" download href={`/printable/${fileName}`}>
                Download {title} (PDF)
            </a>
            <ul className="printable-download__facts">
                {factElements.map(factElement => (
                    <li key={extractNodeText(factElement.props.children)}>{factElement.props.children}</li>
                ))}
            </ul>
        </div>
    );
};
