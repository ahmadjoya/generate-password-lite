import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'

import packageJSON from './package.json' assert { type: 'json' }

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJSON.main,
        format: 'cjs',
        exports: 'named',
      },
    ],
    plugins: [
      typescript({
        check: true,
        tsconfig: './tsconfig.json',
      }),
      commonjs({
        extensions: ['.js', '.ts', '.tsx'],
      }),
      terser(),
    ],
  },
  {
    input: 'src/types.d.ts',
    output: {
      file: 'dist/types.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
]
