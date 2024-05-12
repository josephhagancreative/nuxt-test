import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'vue/component-tags-order': ['error', {
      order: ['template', 'script', 'style'],
    }],
    'antfu/top-level-function': 'off',
    'no-console': 'warn',
    'unused-imports/no-unused-imports': 'off',
  },
  typescript: true,
  vue: true,
})
