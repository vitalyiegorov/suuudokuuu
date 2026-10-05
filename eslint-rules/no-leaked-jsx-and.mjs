const BOOLEAN_NAME_PATTERN = /^(?:is|has|should|can|was|did|are|will)(?:[A-Z]|$)/u;
const BOOLEAN_CALL_PATTERN = /^(?:is|has)/u;
const COMPARISON_OPERATORS = new Set(['===', '!==', '==', '!=', '<', '>', '<=', '>=', 'in', 'instanceof']);

const getName = node => {
    if (node.type === 'Identifier') {
        return node.name;
    }

    if (node.type === 'MemberExpression' && !node.computed) {
        return node.property.name;
    }

    return '';
};

const unwrap = node => (node.type === 'ChainExpression' ? node.expression : node);

const isVisiblyBoolean = rawNode => {
    const node = unwrap(rawNode);

    switch (node.type) {
        case 'BinaryExpression':
            return COMPARISON_OPERATORS.has(node.operator);
        case 'UnaryExpression':
            return node.operator === '!';
        case 'CallExpression':
            return getName(node.callee) === 'Boolean' || BOOLEAN_CALL_PATTERN.test(getName(node.callee));
        case 'Identifier':
        case 'MemberExpression':
            return BOOLEAN_NAME_PATTERN.test(getName(node));
        case 'Literal':
            return typeof node.value === 'boolean';
        case 'LogicalExpression':
            return node.operator !== '??' && isVisiblyBoolean(node.left) && isVisiblyBoolean(node.right);
        default:
            return false;
    }
};

const isJsx = node => {
    switch (node.type) {
        case 'JSXElement':
        case 'JSXFragment':
            return true;
        case 'ConditionalExpression':
            return isJsx(node.consequent) || isJsx(node.alternate);
        case 'LogicalExpression':
            return isJsx(node.left) || isJsx(node.right);
        default:
            return false;
    }
};

const isInJsxContainer = node => {
    const { parent } = node;

    if (parent.type === 'JSXExpressionContainer') {
        return true;
    }

    if ((parent.type === 'ConditionalExpression' && parent.test !== node) || parent.type === 'LogicalExpression') {
        return isInJsxContainer(parent);
    }

    return false;
};

export const noLeakedJsxAndRule = {
    meta: {
        type: 'problem',
        messages: {
            leakedRender:
                'The left side of a JSX `&&` must be visibly boolean. Extract a named boolean (`const hasItems = items.length > 0`) or use a type guard.'
        },
        schema: []
    },
    create: context => ({
        'LogicalExpression[operator="&&"]': node => {
            if (isJsx(node.right) && !isVisiblyBoolean(node.left) && isInJsxContainer(node)) {
                context.report({ node: node.left, messageId: 'leakedRender' });
            }
        }
    })
};
