import { enumMemberCaseRule } from './enum-member-case.mjs';
import { maxComponentPropsRule } from './max-component-props.mjs';

export default {
    meta: { name: 'suuudokuuu' },
    rules: {
        'enum-member-case': enumMemberCaseRule,
        'max-component-props': maxComponentPropsRule
    }
};
