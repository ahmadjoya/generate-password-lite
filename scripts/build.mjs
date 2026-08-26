import { build } from 'esbuild'
import { execFileSync } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const entry = resolve(root, 'src/index.ts')

const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))

const banner = `/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * @license ${pkg.license}
 */`

await rm(dist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })

const shared = {
  entryPoints: [entry],
  bundle: true,
  platform: 'neutral',
  target: ['es2022', 'node18'],
  minify: false,
  sourcemap: true,
  banner: { js: banner },
  legalComments: 'inline',
}

// ESM build.
await build({ ...shared, format: 'esm', outfile: resolve(dist, 'index.mjs') })

// CommonJS build. `platform: neutral` leaves no CJS interop, so the CJS
// output is emitted for node explicitly.
await build({
  ...shared,
  platform: 'node',
  format: 'cjs',
  outfile: resolve(dist, 'index.cjs'),
})

// Type declarations, emitted once and published under both extensions so that
// the `import` and `require` conditions each resolve to types.
execFileSync('node', [resolve(root, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.json'], {
  cwd: root,
  stdio: 'inherit',
})

// Inline the option types into the entry declaration. A relative `./types`
// import would be left without a file extension, which Node16 ESM resolution
// rejects, so the published .d.ts is made self-contained instead.
const types = await readFile(resolve(dist, 'types.d.ts'), 'utf8')
const entryDeclaration = await readFile(resolve(dist, 'index.d.ts'), 'utf8')

const inlinedTypes = types
  .replace(/^export type ResolvedOptions[^\n]*\n?/m, '')
  .replace(/^\/\*\*\n \* Every option resolved[\s\S]*?\*\/\n/m, '')
  .trimEnd()

const declaration = `${banner}\n${inlinedTypes}\n${entryDeclaration.replace(
  /^import \{ GenerateOptions \} from '\.\/types';\n/m,
  ''
)}`

if (declaration.includes("from './types'")) {
  throw new Error('build: failed to inline ./types into the entry declaration')
}

for (const name of ['index.d.ts', 'index.d.mts', 'index.d.cts']) {
  await writeFile(resolve(dist, name), declaration)
}

// Declarations for the internal modules are never referenced by the public
// entry point.
await rm(resolve(dist, 'lib'), { recursive: true, force: true })
await rm(resolve(dist, 'types.d.ts'), { force: true })

console.log('build: dist/index.mjs, dist/index.cjs, dist/index.d.mts, dist/index.d.cts')
