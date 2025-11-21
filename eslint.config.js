import globals from "globals";

export default [
    {
        files: ["**/*.ts"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
            parser: await import("@typescript-eslint/parser").then(m => m.default),
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": await import("@typescript-eslint/eslint-plugin").then(m => m.default),
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_"
            }],
            "@typescript-eslint/no-explicit-any": "warn",
            "no-console": "off",
            "prefer-const": "warn",
        },
    },
    {
        ignores: [
            "node_modules/**",
            "dist/**",
            "docs/**",
            "*.config.js",
            "*.config.mjs",
            "bin/**",
        ],
    },
];
