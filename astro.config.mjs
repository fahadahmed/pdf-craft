// @ts-check
import { defineConfig } from 'astro/config'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@astrojs/react'
import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [react()],
  vite: {
    plugins: [vanillaExtractPlugin()],
    optimizeDeps: {
      noDiscovery: true, // Disables dependency discovery
      include: [], // Ensure this is empty or undefined
    },
    ssr: {
      target: 'node',
      noExternal: ['react', 'react-dom'],
    },
  },
})
