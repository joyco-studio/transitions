import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['packages/core/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ['react', '@joycostudio/transitions'],
})
