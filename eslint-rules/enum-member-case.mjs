const isUpperCase = name => name === name.toUpperCase() && !name.includes('__');
const isPascalCase = name => name.charAt(0) === name.charAt(0).toUpperCase() && !name.includes('_');

export const enumMemberCaseRule = {
    meta: {
        type: 'suggestion',
        messages: { invalidCase: 'Enum member `{{name}}` must be UPPER_CASE or PascalCase.' },
        schema: []
    },
    create: context => ({
        TSEnumMember: node => {
            const name = node.id.type === 'Identifier' ? node.id.name : String(node.id.value);

            if (!isUpperCase(name) && !isPascalCase(name)) {
                context.report({ node: node.id, messageId: 'invalidCase', data: { name } });
            }
        }
    })
};
