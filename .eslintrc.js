module.exports = {
    env: {
        browser: true,
        es2021: true,
        'react-native/react-native': true,
        'jest/globals': true
    },
    extends: [
        'eslint:all',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:promise/recommended',
        'plugin:react-native/all',
        'plugin:react/all',
        'plugin:@typescript-eslint/all',
        'plugin:react-hooks/recommended',
        'plugin:n/recommended'
    ],
    overrides: [
        {
            files: ['*.spec.ts', '*.spec.tsx'],
            plugins: ['jest'],
            extends: ['plugin:jest/recommended'],
            rules: { 'jest/prefer-expect-assertions': 'off' }
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
        ecmaFeatures: {
            jsx: true
        }
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    plugins: ['react', 'react-native', 'import', 'jest', 'react-compiler'],
    rules: {
        'n/no-missing-import': 'off',
        'react-compiler/react-compiler': 'error',
        'jest/max-expects': 'off',
        '@typescript-eslint/parameter-properties': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/prefer-readonly-parameter-types': 'off',
        '@typescript-eslint/semi': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/space-before-function-paren': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/no-magic-numbers': 'off',
        '@typescript-eslint/init-declarations': 'off',
        '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreVoidOperator: true }],
        '@typescript-eslint/no-type-alias': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-meaningless-void-operator': 'off',
        '@typescript-eslint/no-import-type-side-effects': 'off',
        '@typescript-eslint/naming-convention': ['error', { selector: 'enumMember', format: ['UPPER_CASE', 'PascalCase'] }],
        'import/namespace': 'off',
        'import/order': [
            'error',
            {
                alphabetize: {
                    caseInsensitive: true,
                    order: 'asc'
                },
                groups: ['builtin', 'external', 'object', 'parent', 'sibling', 'index'],
                'newlines-between': 'always',
                pathGroups: [
                    {
                        group: 'object',
                        pattern: '@*/*',
                        position: 'after'
                    }
                ],
                pathGroupsExcludedImportTypes: ['builtin']
            }
        ],
        'lines-between-class-members': 'off',
        camelcase: 'off',
        'class-methods-use-this': 'off',
        'no-duplicate-imports': 'off',
        'no-ternary': 'off',
        'no-void': 'off',
        'no-undef': 'off',
        'no-useless-constructor': 'off',
        'no-unused-vars': 'off',
        'one-var': 'off',
        'new-cap': 'off',
        'no-redeclare': 'off',
        'no-undefined': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'react-native/no-raw-text': 'off',
        'sort-imports': [
            'error',
            {
                allowSeparatedGroups: false,
                ignoreCase: false,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ['all', 'multiple', 'none', 'single']
            }
        ],
        'no-warning-comments': ['error', { terms: ['fixme', 'xxx'], location: 'start' }],
        'sort-keys': 'off',
        'no-shadow': 'off',
        'no-return-await': 'off',
        'capitalized-comments': 'off',
        'arrow-body-style': ['error', 'as-needed'],
        'multiline-ternary': 'off',
        'max-lines-per-function': ['error', { max: 85, skipBlankLines: true, skipComments: true }],
        'max-statements': ['error', { max: 12 }, { ignoreTopLevelFunctions: true }],
        'id-length': ['error', { exceptions: ['x', 'y', 'z', 'i', 'j', 'e', '_', 'w', 'h'] }],
        'max-params': ['error', { max: 4 }],
        'newline-before-return': 'error',
        'require-await': 'off',
        'react/display-name': 'off',
        'react/prop-types': 'off',
        'react/forbid-component-props': 'off',
        'react/function-component-definition': 'off',
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
        'react/require-default-props': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/jsx-max-depth': ['error', { max: 4 }],
        'react/jsx-no-literals': 'off',
        'react/jsx-no-bind': 'off',
        'react/jsx-no-constructed-context-values': 'off',
        'react/jsx-max-props-per-line': 'off',
        'react/jsx-newline': 'off',
        'prefer-named-capture-group': 'off',
        'react/jsx-one-expression-per-line': 'off',
        'jest/require-hook': 'off',
        'no-magic-numbers': [
            'error',
            {
                ignore: [-20, -10, 0, 0.5, 1, 1.3, 2, 2.9, 3, 4, 5, 6, 7, 8, 9, 10, 20, 40, 50, 60, 70, 100, 360, 600, 1000, 1200]
            }
        ],
        'react-hooks/exhaustive-deps': [
            'error',
            {
                additionalHooks: '(useAnimatedStyle|useDerivedValue|useAnimatedProps)'
            }
        ]
    }
};
