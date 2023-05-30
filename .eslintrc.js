module.exports = {
    env: {
        browser: true,
        es2021: true,
        'react-native/react-native': true,
        'jest/globals': true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'standard-with-typescript',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:promise/recommended',
        'plugin:prettier/recommended',
        'plugin:react-native/all'
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
    plugins: ['react', 'react-native', 'import', 'prettier', 'jest'],
    rules: {
        'no-void': 'off',
        'import/namespace': 'off',
        'prettier/prettier': 'error',
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
                        pattern: '@seezona/*',
                        position: 'after'
                    }
                ],
                pathGroupsExcludedImportTypes: ['builtin']
            }
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-confusing-void-expression': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'react-native/no-raw-text': 'off'
    }
};
