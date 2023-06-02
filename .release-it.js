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
        push: true,
        tagName: `v${version}`,
        pushRepo: 'git@github.com:vitalyiegorov/suuudokuuu.git',
        commitsPath: '.',
        commitMessage: `chore: released version v${version} [no ci]`,
        requireCommits: true,
        requireCommitsFail: false
    },
    npm: {
        publish: false,
        versionArgs: ['--workspaces false']
    },
    github: {
        release: true,
        releaseName: `v${version}`
    },
    hooks: {
        'before:git:release': ['git add --all']
    }
};
