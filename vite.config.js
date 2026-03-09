import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    execArgv: ['--expose-gc'],
    isolate: false,
    maxWorkers: 1,
    vmMemoryLimit: '300Mb',
  },
});
