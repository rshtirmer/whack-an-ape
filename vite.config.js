import { defineConfig } from 'vite';

export default defineConfig({
  base: '/whack-an-ape/',
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
