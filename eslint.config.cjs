module.exports = {
  env: {
    browser: true,
    node: true,
    es2023: true
  },
  extends: ['eslint:recommended', 'plugin:react-hooks/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  ignorePatterns: ['dist', 'build', 'node_modules'],
  rules: {}
};
