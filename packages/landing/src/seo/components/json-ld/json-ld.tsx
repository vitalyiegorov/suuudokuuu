const ScriptOpeningBracketPattern = /</gu;

const SCRIPT_SAFE_OPENING_BRACKET = '\\u003c';

interface Props {
    data: Record<string, unknown>;
}

export const JsonLd = ({ data }: Props) => {
    const scriptHtml = { __html: JSON.stringify(data).replace(ScriptOpeningBracketPattern, SCRIPT_SAFE_OPENING_BRACKET) };

    return <script type="application/ld+json" dangerouslySetInnerHTML={scriptHtml} />;
};
