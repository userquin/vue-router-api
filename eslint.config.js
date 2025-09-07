import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  ignores: [
    '**/dist/**',
    '**/node_modules/**',
    // dont change vite layout: pnpm create vite > Vanilla > TypesScript
    'tsconfig.*',
  ],
})
