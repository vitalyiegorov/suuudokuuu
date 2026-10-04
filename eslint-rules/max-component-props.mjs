const PROPS_TYPE_NAME_PATTERN = /^Props$|PropsInterface$/u;

const toPosixPath = filename => filename.split('\\').join('/');

const isPropsTypeName = name => PROPS_TYPE_NAME_PATTERN.test(name);

const isExemptFile = (filename, allow) => {
    const normalizedFilename = toPosixPath(filename);

    return allow.some(allowedPath => normalizedFilename.endsWith(allowedPath));
};

const countOwnMembers = members =>
    members.filter(member => member.type === 'TSPropertySignature' || member.type === 'TSMethodSignature').length;

const reportIfTooManyMembers = (context, node, typeName, members, max) => {
    const memberCount = countOwnMembers(members);

    if (memberCount > max) {
        context.report({ node, messageId: 'tooManyProps', data: { typeName, count: String(memberCount), max: String(max) } });
    }
};

export const maxComponentPropsRule = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Disallow component Props types with more than `max` own members. Only counts members declared directly in the body — members brought in through `extends` (interfaces) or intersection (`&`) type members are not counted, so a Props type that re-exports a large shared interface will not trigger this rule.'
        },
        schema: [
            {
                type: 'object',
                properties: {
                    max: { type: 'integer', minimum: 1 },
                    allow: { type: 'array', items: { type: 'string' } }
                },
                additionalProperties: false
            }
        ],
        messages: {
            tooManyProps:
                '{{typeName}} has {{count}} members (max {{max}}). Split the component or use composition (children/compound components) instead of prop bags.'
        }
    },
    defaultOptions: [{ max: 10, allow: [] }],
    create(context) {
        const [options] = context.options;
        const max = options?.max ?? 10;
        const allow = options?.allow ?? [];

        if (isExemptFile(context.filename, allow)) {
            return {};
        }

        return {
            TSInterfaceDeclaration(node) {
                if (isPropsTypeName(node.id.name)) {
                    reportIfTooManyMembers(context, node, node.id.name, node.body.body, max);
                }
            },
            TSTypeAliasDeclaration(node) {
                if (isPropsTypeName(node.id.name) && node.typeAnnotation.type === 'TSTypeLiteral') {
                    reportIfTooManyMembers(context, node, node.id.name, node.typeAnnotation.members, max);
                }
            }
        };
    }
};
