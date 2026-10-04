import { builtinRules } from 'eslint/use-at-your-own-risk';

const ruleNames = ['camelcase', 'consistent-this', 'newline-before-return', 'no-undef-init', 'require-atomic-updates'];

export default {
    meta: { name: 'eslint-js' },
    rules: Object.fromEntries(ruleNames.map(ruleName => [ruleName, builtinRules.get(ruleName)]))
};
