module.exports = function (api) {
    api.cache(true);

    return {
        presets: ['babel-preset-expo'],
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
            '@lingui/babel-plugin-lingui-macro'
        ]
    };
};
