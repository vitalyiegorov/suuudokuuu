module.exports = {
    extends: '../../.eslintrc.js',
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'react/jsx-one-expression-per-line': 'off',
        'react/jsx-max-props-per-line': 'off',
        'jest/require-hook': 'off',
        'react/jsx-newline': 'off',

        'eslint-comments/disable-enable-pair': 'off',
        'eslint-comments/no-unlimited-disable': 'off',

        'lingui/no-unlocalized-strings': [
            'error',
            {
                ignore: ['^(?![A-Z])\\S+$', '^[A-Z0-9_-]+$', 'rgba', 'rgb', '^Inter_[0-9A-Z]+', '^Arrow[A-Z]+', 'Tab', 'Enter'],
                ignoreFunctions: ['format']
            }
        ],
        'lingui/t-call-in-function': 2,
        'lingui/no-single-variables-to-translate': 2,
        'lingui/no-expression-in-message': 2,
        'lingui/no-single-tag-to-translate': 2,
        'lingui/no-trans-inside-trans': 2
    }
};
