import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/main.js',
  output: {
    file: '../wwwroot/js/bundle.js',
    format: 'iife',
    name: 'app',
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    svelte({
      include: 'src/**/*.svelte',
      emitCss: false,
      compilerOptions: {
        customElement: false,
      },
    }),
  ],
};
