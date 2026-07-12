module.exports = {
    extends: ['@commitlint/config-conventional', '@commitlint/config-workspace-scopes'],
    ignores: [message => message.includes('WIP')]
};
