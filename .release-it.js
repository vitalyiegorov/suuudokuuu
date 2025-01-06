const version = '${version}';

module.exports = {
    plugins: {
        '@release-it/conventional-changelog': {
            path: '.',
            infile: 'CHANGELOG.md',
            preset: 'conventionalcommits',
            gitRawCommitsOpts: {
                path: '.'
            }
        }
    },
    git: {
        push: false,
        tagName: `v${version}`,
        pushRepo: 'git@github.com:vitalyiegorov/suuudokuuu.git',
        commitsPath: '.',
        commitMessage: `chore: released version v${version} [no ci]`,
        requireCommits: true,
        requireCommitsFail: false,
        requireCleanWorkingDir: false
    },
    github: {
        release: true
    },
    hooks: {
        'before:release': ['react-native-version --never-amend', 'git add --all']
    }
};
