import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve'
import html from '@rollup/plugin-html';
import { babel } from '@rollup/plugin-babel';
import livereload from 'rollup-plugin-livereload'
import replace from '@rollup/plugin-replace';
import svg from 'rollup-plugin-svg'
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
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        __buildDate__: () => JSON.stringify(new Date()),
        __buildVersion: 1,
        preventAssignment:true
      }),
      svg({base64:true}),
      babel({ babelHelpers: 'bundled' }),
      commandLineArgs.configDebug && livereload(),
    ]
  }
};