import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import nodePlugin from 'eslint-plugin-n';
import promisePlugin from 'eslint-plugin-promise';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import pluginLingui from 'eslint-plugin-lingui';
import rnwcPlugin from '@rnw-community/eslint-plugin';

export default defineConfig(
    {
        ignores: [
            '**/.next/**',
            '**/.turbo/**',
            '**/.expo/**',
            '**/.android/**',
            '**/.ios/**',

            '**/node_modules/**',
            '**/dist/**',
            '**/public/**',
            '**/build/**',
            '**/drizzle/**',

            '**/*.html',
            '**/*.json',
            '**/*.d.ts',

            '**/messages.po',
            '**/messages.ts',
            '**/babel.config.js',
            '**/fingerprint.config.js',

            'eslint.config.mjs'
        ]
    },
    {
        files: ['**/*.{ts,tsx}'],
        extends: [js.configs.all],
        rules: {
            camelcase: ['error', { properties: 'never' }],
            complexity: ['error', 25],
            indent: 'off',
            strict: 'off',
            'init-declarations': 'off',
            'class-methods-use-this': 'off',
            'one-var': 'off',
            'new-cap': 'off',
            'lines-between-class-members': 'off',
            'no-duplicate-imports': 'off',
            'no-ternary': 'off',
            'no-void': 'off',
            'no-useless-constructor': 'off',
            'no-undef': 'off',
            'no-magic-numbers': 'off',
            'no-unused-vars': 'off',
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
            'no-empty-function': ['error', { allow: ['constructors'] }],
            'capitalized-comments': 'off',
            'arrow-body-style': ['error', 'as-needed'],
            'multiline-ternary': 'off',
            'max-lines-per-function': ['error', { max: 85, skipBlankLines: true, skipComments: true }],
            'max-statements': ['error', { max: 14 }, { ignoreTopLevelFunctions: true }],
            'id-length': ['warn', { exceptions: ['x', 'y', 'z', 'i', 'j', 'e', '_', 'w', 'h', 't'] }],
            'max-params': 'off',
            'operator-linebreak': 'off',
            'newline-before-return': 'error',
            'require-await': 'off',
            'prefer-named-capture-group': 'off',
            'member-ordering': 'off'
        }
    },
    {
        files: ['**/*.{ts,tsx}'],
        extends: [tseslint.configs.strictTypeChecked],
        rules: {
            '@typescript-eslint/class-methods-use-this': 'off',
            '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
            '@typescript-eslint/no-magic-numbers': [
                'error',
                {
                    ignore: [
                        -20, -10, -1, 0, 0.05, 0.1, 0.5, 0.7, 0.8, 1, 1.2, 1.3, 1.8, 2, 2.5, 2.9, 3, 3.7, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                        14, 15, 16, 20, 30, 35, 40, 45, 50, 60, 70, 75, 99, 100, 155, 235, 300, 360, 400, 500, 600, 700, 800, 960, 999,
                        1000, 1200, 3600, 8191
                    ]
                }
            ],
            '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreVoidOperator: true }],
            '@typescript-eslint/no-meaningless-void-operator': 'off',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/promise-function-async': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/max-params': ['error', { max: 4 }],
            '@typescript-eslint/no-misused-promises': [
                'error',
                {
                    checksVoidReturn: {
                        attributes: false
                    }
                }
            ],
            '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
            '@typescript-eslint/no-deprecated': 'off',
            '@typescript-eslint/no-unnecessary-type-parameters': 1,
            '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description', minimumDescriptionLength: 5 }],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '(^_)|(Fields$)',
                    ignoreRestSiblings: true
                }
            ],
            '@typescript-eslint/no-empty-object-type': 1,
            '@typescript-eslint/no-extraneous-class': [2, { allowWithDecorator: true }],
            '@typescript-eslint/naming-convention': ['error', { selector: 'enumMember', format: ['UPPER_CASE', 'PascalCase'] }],
            '@typescript-eslint/member-ordering': [
                'error',
                {
                    classes: [
                        'signature',
                        'public-static-field',
                        'protected-static-field',
                        'private-static-field',
                        'public-decorated-field',
                        'protected-decorated-field',
                        'private-decorated-field',
                        'public-instance-field',
                        'protected-instance-field',
                        'private-instance-field',
                        'public-abstract-field',
                        'protected-abstract-field',
                        'public-field',
                        'protected-field',
                        'private-field',
                        'static-field',
                        'instance-field',
                        'abstract-field',
                        'decorated-field',
                        'field',
                        'public-constructor',
                        'protected-constructor',
                        'private-constructor',
                        'constructor',
                        'public-static-get',
                        'protected-static-get',
                        'private-static-get',
                        'public-decorated-get',
                        'protected-decorated-get',
                        'private-decorated-get',
                        'public-instance-get',
                        'protected-instance-get',
                        'private-instance-get',
                        'public-abstract-get',
                        'protected-abstract-get',
                        'public-get',
                        'protected-get',
                        'private-get',
                        'static-get',
                        'instance-get',
                        'abstract-get',
                        'decorated-get',
                        'get',
                        'public-static-set',
                        'protected-static-set',
                        'private-static-set',
                        'public-decorated-set',
                        'protected-decorated-set',
                        'private-decorated-set',
                        'public-instance-set',
                        'protected-instance-set',
                        'private-instance-set',
                        'public-abstract-set',
                        'protected-abstract-set',
                        'public-set',
                        'protected-set',
                        'private-set',
                        'static-set',
                        'instance-set',
                        'abstract-set',
                        'decorated-set',
                        'set',
                        'public-decorated-method',
                        'protected-decorated-method',
                        'private-decorated-method',
                        'public-instance-method',
                        'protected-instance-method',
                        'private-instance-method',
                        'public-abstract-method',
                        'protected-abstract-method',
                        'public-method',
                        'protected-method',
                        'private-method',
                        'public-static-method',
                        'protected-static-method',
                        'private-static-method',
                        'static-method',
                        'instance-method',
                        'abstract-method',
                        'decorated-method',
                        'method'
                    ]
                }
            ]
        }
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: true
            }
        }
    },
    {
        files: ['**/*.{ts,tsx}'],
        extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module'
        },
        rules: {
            'import/named': 'off',
            'import/namespace': 'off',
            'import/default': 'off',
            'import/no-named-as-default-member': 'off',
            'import/no-unresolved': 'off',
            'import/no-named-as-default': 'off',
            'import/no-cycle': 'off',
            'import/no-unused-modules': 'off',
            'import/no-deprecated': 'off',
            'import/extensions': 'off',
            'import/order': [
                'error',
                {
                    alphabetize: {
                        caseInsensitive: true,
                        order: 'asc'
                    },
                    groups: ['builtin', 'external', 'object', 'parent', 'sibling', 'index', 'type'],
                    'newlines-between': 'always',
                    pathGroups: [
                        {
                            group: 'object',
                            pattern: '@rnw-community/*',
                            position: 'after'
                        }
                    ],
                    pathGroupsExcludedImportTypes: ['builtin', 'type']
                }
            ]
        }
    },
    {
        files: ['**/*.ts'],
        extends: [nodePlugin.configs['flat/recommended']],
        settings: {
            node: { version: '>=22.0.0' }
        },
        rules: {
            'n/no-missing-import': 'off',
            'n/no-unsupported-features/es-syntax': 'off',
            'n/no-extraneous-import': [
                'error',
                {
                    allowModules: ['@jest/globals']
                }
            ]
        }
    },
    {
        files: ['**/*.{ts,tsx}'],
        extends: [promisePlugin.configs['flat/recommended']]
    },
    {
        files: ['packages/app/**/*.{ts,tsx}', 'packages/landing/**/*.{ts,tsx}'],
        extends: [pluginLingui.configs['flat/recommended']],
        rules: {
            'lingui/no-unlocalized-strings': [
                'error',
                {
                    ignore: [
                        '^(?![A-Z])\\S+$',
                        '^[A-Z0-9_-]+$',
                        'rgba',
                        'rgb',
                        '^Inter_[0-9A-Z]+',
                        '^Arrow[A-Z]+',
                        'Tab',
                        'Enter',
                        'use client',
                        '^Arrow[A-Z]+',
                        '^Key[A-Z]+'
                    ],
                    ignoreNames: [
                        { regex: { pattern: 'className', flags: 'i' } },
                        { regex: { pattern: 'icon', flags: 'i' } },
                        { regex: { pattern: 'sizes', flags: 'i' } }
                    ],
                    ignoreFunctions: ['format', 'cva']
                }
            ],
            'lingui/t-call-in-function': 2,
            'lingui/no-single-variables-to-translate': 2,
            'lingui/no-expression-in-message': 2,
            'lingui/no-single-tag-to-translate': 2,
            'lingui/no-trans-inside-trans': 2
        }
    },
    {
        files: ['**/*.{ts,tsx}'],
        extends: [reactPlugin.configs.flat.recommended, reactHooksPlugin.configs.flat.recommended],
        plugins: { '@rnw-community': rnwcPlugin },
        settings: {
            react: { version: 'detect' }
        },
        rules: {
            '@rnw-community/no-complex-jsx-logic': 'error',

            'react/react-in-jsx-scope': 'off',
            'react/jsx-curly-newline': 'off',
            'react/display-name': 'off',
            'react/prop-types': 'off',
            'react/forbid-component-props': 'off',
            'react/function-component-definition': 'off',
            'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
            'react/require-default-props': 'off',
            'react/jsx-props-no-spreading': 'off',
            'react/jsx-max-depth': ['error', { max: 6 }],
            'react/jsx-no-literals': 'off',
            'react/jsx-no-bind': 'off',
            'react/jsx-no-constructed-context-values': 'off',
            'react/jsx-max-props-per-line': 'off',
            'react/jsx-newline': 'off',
            'react/jsx-one-expression-per-line': 'off',
            'react/jsx-indent': 'off',
            'react-native/no-raw-text': 'off',
            'react/jsx-child-element-spacing': 'off',
            'react/destructuring-assignment': 'off',
            'react/no-unknown-property': ['error', { ignore: ['popover', 'popoverTarget', 'popoverTargetAction'] }]
        }
    },
    {
        files: ['**/*.spec.ts'],
        extends: [jestPlugin.configs['flat/recommended']],
        rules: {
            'no-await-in-loop': 'off',

            'jest/require-hook': 'off',
            'jest/max-expects': 'off',
            'jest/unbound-method': 'off',
            'jest/expect-expect': 'off',
            'jest/no-done-callback': 'off',

            'no-undef': 'off',
            'no-undefined': 'off',
            'max-classes-per-file': 'off',
            'max-lines-per-function': 'off',
            'max-lines': 'off',
            'max-statements': 'off',
            'func-names': 'off',
            'promise/no-nesting': 'off'
        }
    }
);
