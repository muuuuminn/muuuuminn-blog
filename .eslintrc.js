/** @type {import('eslint/lib/shared/types').ConfigData} */
const eslintConfig = {
  extends: [
    "eslint:recommended",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  env: {
    es2020: true,
    jest: true,
  },
  rules: {
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling"],
          "object",
          "type",
          "index",
        ],
        pathGroups: [
          {
            pattern: "{react,next/**}",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "@/src/**",
            group: "parent",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        "newlines-between": "always",
      },
    ],
    "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
    // その他のルール
    "@typescript-eslint/no-unused-vars": [
      "warn",
      // 「_」を変数名につけた場合は、変数を使用していないよって警告を出さない
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      },
    ],
    // Propsのソート
    "react/jsx-sort-props": "warn",
  },
  overrides: [
    {
      // tsxとcodegenで生成したコード内ではempty objectなtypeを許容する
      // https://github.com/typescript-eslint/typescript-eslint/issues/2063#issuecomment-675156492
      files: ["*.tsx", "*.generated.ts"],
      rules: {
        "@typescript-eslint/ban-types": [
          "error",
          {
            extendDefaults: true,
            types: {
              "{}": false,
            },
          },
        ],
      },
    },
  ],
};

module.exports = eslintConfig;
