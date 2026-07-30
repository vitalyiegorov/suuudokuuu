module.exports = {
    extends: ['@commitlint/config-conventional', '@commitlint/config-workspace-scopes'],
    rules: {
        'type-enum': [2, 'always', ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'i18n', 'perf', 'refactor', 'revert', 'style', 'test']]
    },
    ignores: [message => message.includes('WIP')]
};
