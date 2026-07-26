module.exports = function (api) {
    api.cache(true);

    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'react-native-unistyles/plugin',
                {
                    root: 'src',
                    autoProcessPaths: ['packages/ui/src', 'packages/screen-chrome/src'],
                    autoProcessImports: ['@suuudokuuu/ui', '@suuudokuuu/screen-chrome']
                }
            ],
            'macros',
            '@lingui/babel-plugin-lingui-macro'
        ]
    };
};
