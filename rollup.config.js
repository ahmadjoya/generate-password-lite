import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'

import packageJSON from './package.json' assert { type: 'json' }

export default [
  // CommonJS Build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named',
    },
    plugins: [
      resolve(),
      typescript({ tsconfig: './tsconfig.json' }),
      commonjs(),
      terser(),
    ],
  },

  // ESM Build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.mjs',
      format: 'esm',
    },
    plugins: [resolve(), typescript({ tsconfig: './tsconfig.json' }), terser()],
  },

  // Type Declarations
  {
    input: 'src/types.d.ts',
    output: {
      file: 'dist/types.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
]
