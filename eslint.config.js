import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  pnpm: true,

  typescript: {
    tsconfigPath: './tsconfig.json',
  },
})
