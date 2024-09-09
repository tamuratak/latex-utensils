import eslint from "@eslint/js";
import tseslint from 'typescript-eslint';

const commonRules = {
    "no-undef": "off",
    "no-constant-condition": "off",
    "@typescript-eslint/ban-ts-comment": "error",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/prefer-interface": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/naming-convention": ["error",
        {
          "selector": "default",
          "format": ["camelCase", "PascalCase", "UPPER_CASE"],
          "leadingUnderscore": "allow"
        },
        {
          "selector": "method",
          "format": ["camelCase"]
        },
        {
          "selector": "function",
          "format": ["camelCase"]
        },
        {
          "selector": "typeLike",
          "format": ["PascalCase"]
        }
    ],
    "@typescript-eslint/no-use-before-define": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "args": "none" }],
    "prefer-arrow-callback": [ "error", { "allowUnboundThis": false } ],
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-misused-promises": [ "error", { "checksVoidReturn": false } ],
    "@typescript-eslint/no-require-imports": "off",
    "@typescript-eslint/prefer-readonly": "error",
    "no-return-await": "off",
    "@typescript-eslint/return-await": "error",
    "require-await": "off",
    "@typescript-eslint/require-await": "error",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "error",
    "no-unused-expressions": "off",
    "@typescript-eslint/no-unused-expressions": "error",
    "curly": "error",
    "eol-last": "error",
    "no-prototype-builtins": "off",
    "no-caller": "error",
    "no-multiple-empty-lines": "error",
    "no-new-wrappers": "error",
    "no-eval": "error",
    "no-invalid-this": "error",
    "no-console": "off",
    "no-trailing-spaces": "error",
    "no-empty": ["error", { "allowEmptyCatch": true }],
    "no-var": "error",
    "object-shorthand": "error",
    "one-var": ["error", { "initialized": "never", "uninitialized": "never" }],
    "prefer-const": "error",
    "quotes": ["error", "single", {"avoidEscape": true}],
    "default-case": "error",
    "eqeqeq": ["error", "always"],
    "space-before-function-paren": ["error", {"anonymous": "always", "named": "never", "asyncArrow": "always"}],
    "func-call-spacing": ["error", "never"],
    "no-multi-spaces": ["error", { "ignoreEOLComments": true }]
};

export default tseslint.config(
    {
        ignores: [
            "dev/",
            "docs/",
            "node_modules/",
            "out/",
            "sample/",
            ".vscode/",
            ".git/",
            ".github/",
            "test/latex_log",
        ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
    {
        files: [
            "src/**/*.ts",
            "test/**/*.ts"
        ],
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 2018,
            sourceType: "commonjs",
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        rules: {
            ...commonRules,
        },
    }
)
