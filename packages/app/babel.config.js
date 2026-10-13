module.exports = function (api) {
    api.cache(true);

    return {
        presets: [['babel-preset-expo', { worklets: false }]],
        plugins: [
            [
                'react-native-unistyles/plugin',
                {
                    root: 'src',
                    autoProcessPaths: ['packages/ui/src'],
                    autoProcessImports: ['@suuudokuuu/ui']
                }
            ],
            'macros',
            '@lingui/babel-plugin-lingui-macro',
            ['react-native-worklets/plugin', { bundleMode: true, importForwarding: { moduleNames: ['@suuudokuuu/puzzle-forge'] } }]
        ]
    };
};
