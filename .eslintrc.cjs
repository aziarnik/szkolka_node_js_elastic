module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  root: true,
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    project: ["tsconfig.json"]
  },
  rules: {
    "prettier/prettier": 2
  },
  plugins: [
    "@typescript-eslint",
    "prettier"
  ]
}
