import Script from 'next/script';

import { buildMicrosoftClarityScript } from '../../utils/build-microsoft-clarity-script.util';

interface Props {
    projectId: string;
}

export const MicrosoftClarity = ({ projectId }: Props) => {
    const clarityScript = { __html: buildMicrosoftClarityScript(projectId) };

    return <Script dangerouslySetInnerHTML={clarityScript} id="microsoft-clarity" strategy="afterInteractive" />;
};
