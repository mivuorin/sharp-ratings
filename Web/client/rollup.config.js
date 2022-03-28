﻿import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/main.js',
    output: {
        file: '../wwwroot/js/bundle.js',
        format: 'iife',
        name: 'app'
    },
    plugins: [
        svelte({
            include: 'src/**/*.svelte',
            emitCss: false,
            compilerOptions: {
                customElement: false
            }
        }),
        resolve({browser: true})
    ]
}