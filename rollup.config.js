import tsc from 'typescript';
import typescript from 'rollup-plugin-typescript2';
import replace from 'rollup-plugin-replace';
import * as pkg from './package.json';

export default {
  input: 'source/SportsEngine.ts',
  output: [
    { file: 'lib/se.js', format: 'cjs' },
    { file: 'lib/se.es.js', format: 'es' },
    { file: 'bin/se.js', format: 'umd', name: 'SportsEngine' }
  ],
  plugins: [
    typescript({
      typescript: tsc,
      useTsconfigDeclarationDir: true,
      tsconfig: 'tsconfig.json',
      cacheRoot: 'cache'
    }),
    replace({
      ASSEMBLY_VERSION: pkg.version
    })
  ]
}
