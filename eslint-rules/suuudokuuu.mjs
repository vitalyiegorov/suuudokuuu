import { enumMemberCaseRule } from './enum-member-case.mjs';
import { maxComponentPropsRule } from './max-component-props.mjs';
import { noLeakedJsxAndRule } from './no-leaked-jsx-and.mjs';

export default {
    meta: { name: 'suuudokuuu' },
    rules: {
        'enum-member-case': enumMemberCaseRule,
        'max-component-props': maxComponentPropsRule,
        'no-leaked-jsx-and': noLeakedJsxAndRule
    }
};
