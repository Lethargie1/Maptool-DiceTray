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
import url from '@rollup/plugin-url';
import sizes from 'rollup-plugin-sizes';
import { terser } from "rollup-plugin-terser";
import css from 'rollup-plugin-css-only'
import { v4 as uuidv4 } from 'uuid';

export default commandLineArgs => {
  let debug = commandLineArgs.configDebug
  return {
    input: ['src/main.js'],
    output: [
      {
        dir: debug ? 'public/build/' : 'public/release/',
        format: 'iife',
        name: 'sveltemodule',
        sourcemap: debug ? 'inline' : false,
        entryFileNames: debug ? '[name].js' : '[name]-[hash].js'
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
        emitCss: !debug,
      }),
      debug ? null : css({ output: debug ? null : "bundle-"+uuidv4()+".css" }),
      resolve({ browser: true }),
      html({
        publicPath: './'
      }),
      replace({
        'process.env.NODE_ENV': debug ? JSON.stringify('development') : JSON.stringify('production'),
        __buildDate__: () => JSON.stringify(new Date()),
        __buildVersion: 1,
        preventAssignment:true
      }),
      svg({base64:true}),
      babel({ babelHelpers: 'bundled' }),
      debug && livereload(),
      url(
        { 
          exclude:['**/*.svg'],
          limit: 0 
        }),
        sizes(),
        !debug && terser()
    ]
  }
};