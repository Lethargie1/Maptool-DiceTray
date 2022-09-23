import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve'
import html from '@rollup/plugin-html';
import { babel } from '@rollup/plugin-babel';
import livereload from 'rollup-plugin-livereload'


import preprocess from 'svelte-preprocess';
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default commandLineArgs => {
  return {
    input: ['src/main.js'],
    output: [
      {
        dir: commandLineArgs.configDebug ? 'public/build/' : 'public/release/',
        format: 'iife',
        name: 'sveltemodule',
        sourcemap: commandLineArgs.configDebug ? 'inline' : false,
        entryFileNames: commandLineArgs.configDebug ? '[name].js' : '[name]-[hash].js'
      },
    ],
    plugins: [
      svelte({
        include: 'src/**/*.svelte',
        preprocess: preprocess({
          postcss: {
              plugins: [
                  tailwind, 
                  autoprefixer
              ]
          }
        }),
        emitCss: false,
      }),
      resolve({ browser: true }),
      html({
        publicPath: './'
      }),
      babel({ babelHelpers: 'bundled' }),
      commandLineArgs.configDebug && livereload(),
    ]
  }
};