// @ts-check
import { defineConfig } from 'astro/config'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@astrojs/react'
import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [vanillaExtractPlugin()],
  },
  server: {
    port: 3000,
  },
  output: 'server',
  adapter: node({
    mode: 'middleware',
  }),
})
