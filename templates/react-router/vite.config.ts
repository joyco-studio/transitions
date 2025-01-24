import { reactRouter } from '@react-router/dev/vite'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ command }) => {
  return {
    ssr: {
      noExternal: command === 'build' ? true : undefined,
    },
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
    plugins: [reactRouter(), tsconfigPaths()],
    server: {
      port: 3000,
    },
  }
})
