module.exports = {
    root: true,
    extends: ["eslint:recommended", "universe/native", "plugin:prettier/recommended"],
    rules: {
        // Ensures props and state inside functions are always up-to-date
        "react-hooks/exhaustive-deps": "warn",
    },
};
