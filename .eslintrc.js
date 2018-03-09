module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    },
    sourceType: 'module'
  },
  globals: {
    atom: true
  },
  rules: {
    indent: ['error', 2, { 'SwitchCase': 1 }],
    // "linebreak-style": [
    // 	"error",
    // 	"unix"
    // ],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-console': ['warn'],
    'no-unused-vars': ['warn'],
    'comma-dangle': ['warn', 'never'],
    'no-useless-escape': [0]
  }
};