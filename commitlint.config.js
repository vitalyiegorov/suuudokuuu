module.exports = {
    extends: ['@commitlint/config-conventional', '@commitlint/config-lerna-scopes'],
    ignores: [message => message.includes('WIP')]
};
