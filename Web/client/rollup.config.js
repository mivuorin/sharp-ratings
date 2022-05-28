import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import autoPreprocess from 'svelte-preprocess';

export default {
  input: 'src/main.js',
  output: {
    file: '../wwwroot/bundle.js',
    format: 'iife',
    name: 'app',
  },
  plugins: [
    svelte({
      emitCss: false,
      preprocess: autoPreprocess(),
      compilerOptions: {
        customElement: false,
      },
    }),
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
  ],
};
