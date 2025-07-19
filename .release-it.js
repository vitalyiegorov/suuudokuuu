const version = '${version}';

module.exports = {
    plugins: {
        '@release-it/conventional-changelog': {
            infile: 'CHANGELOG.md',
            preset: {
                name: 'conventionalcommits'
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
};
