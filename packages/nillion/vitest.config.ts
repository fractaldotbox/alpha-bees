import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import path from 'node:path';


export default defineConfig(({ mode }) => {
  return {
    test: {
      env: loadEnv(mode, path.resolve(__dirname, '../..'), '')
    }
  }
})