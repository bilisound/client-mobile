module.exports = function (api) {
    api.cache(true);

    return {
        presets: [
            [
                "babel-preset-expo",
                {
                    jsxImportSource: "nativewind",
                },
            ],
            "nativewind/babel",
        ],

        plugins: [
            ["react-native-worklets-core/plugin"],
            [
                "module-resolver",
                {
                    root: ["./"],
                    alias: {
                        "~": "./",
                        "tailwind.config": "./tailwind.config.js",
                    },
                },
            ],
        ],

        overrides: [
            {
                test: [/sqlocal/],
                plugins: [
                    "babel-plugin-transform-import-meta",
                    "module:@reactioncommerce/babel-remove-es-create-require",
                ],
            },
        ],
    };
};
