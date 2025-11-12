module.exports = {
    presets: [
        "@babel/preset-typescript",
        [
            require("@babel/preset-env"),
            {
                useBuiltIns: "entry",
                corejs: 3,
                targets: {
                    esmodules: true
                }
            },
        ],
    ],
};