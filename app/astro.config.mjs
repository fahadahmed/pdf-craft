import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  integrations: [react()],
  output: 'server',
  adapter: node({
    mode: 'middleware',
  }),
  vite: {
    plugins: [
      vanillaExtractPlugin({
        emitCssInSsr: true,
        minifyCss: true,
      }),
    ],
  },
});
