import { SCHEMA_CONTEXT } from '@suuudokuuu/landing/src/seo/constants/schema.constant';

const JsonLdScriptPattern = /<script type="application\/ld\+json">(.*?)<\/script>/gsu;

const MISSING_SCHEMA_JSON = 'null';

export const readJsonLdSchema = (html: string, schemaType: string): unknown => {
    const schemaPrefix = `{"@context":"${SCHEMA_CONTEXT}","@type":"${schemaType}"`;
    const block = Array.from(html.matchAll(JsonLdScriptPattern), match => match[1]).find(candidate => candidate.startsWith(schemaPrefix));
    const schema: unknown = JSON.parse(block ?? MISSING_SCHEMA_JSON);

    return schema;
};
