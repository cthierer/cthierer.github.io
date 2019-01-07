
module.exports = {
  parser: 'babel-eslint',
  plugins: ['flowtype'],
  extends: ['airbnb'],
  rules : {
    semi: [2, 'never'],
    'no-unused-vars': [2, {'args': 'after-used', 'argsIgnorePattern': '^_'}],
    'no-unused-expressions': [2, { allowShortCircuit: true, allowTernary: true }],
  },
  plugins : []
}
