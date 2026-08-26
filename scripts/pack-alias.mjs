/**
 * Builds a publishable copy of this package under its alias name.
 *
 * The library is published twice: as `generate-password-lite` and as
 * `js-generate-password`. Both names ship identical code, so the alias is
 * generated from this package rather than maintained by hand.
 *
 * Usage: node scripts/pack-alias.mjs [--publish] [--tag <tag>] [--dry-run]
 */
import { execFileSync } from 'node:child_process'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const CANONICAL = 'generate-password-lite'
const ALIAS = 'js-generate-password'
const PLACEHOLDER = '@@PACKAGE_NAME_PLACEHOLDER@@'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const stage = resolve(root, '.publish', ALIAS)

const args = process.argv.slice(2)
const shouldPublish = args.includes('--publish')
const dryRun = args.includes('--dry-run')
const tagIndex = args.indexOf('--tag')
const tag = tagIndex === -1 ? 'latest' : args[tagIndex + 1]

/**
 * Swaps the two package names in both directions, so that a document written
 * for one package reads correctly for the other. Anything addressing the
 * `ahmadjoya/...` repository is put back afterwards: both packages are
 * maintained in the canonical repository, and the alias repository only
 * redirects to it.
 */
const swapNames = text =>
  text
    .split(ALIAS)
    .join(PLACEHOLDER)
    .split(CANONICAL)
    .join(ALIAS)
    .split(PLACEHOLDER)
    .join(CANONICAL)
    .split(`ahmadjoya/${ALIAS}`)
    .join(`ahmadjoya/${CANONICAL}`)

await rm(stage, { recursive: true, force: true })
await mkdir(stage, { recursive: true })

// Build first so the staged copy always matches the current source.
execFileSync('node', [resolve(root, 'scripts/build.mjs')], {
  cwd: root,
  stdio: 'inherit',
})

await cp(resolve(root, 'dist'), resolve(stage, 'dist'), { recursive: true })
await cp(resolve(root, 'src'), resolve(stage, 'src'), { recursive: true })
await cp(resolve(root, 'LICENSE'), resolve(stage, 'LICENSE'))

const readme = await readFile(resolve(root, 'README.md'), 'utf8')
await writeFile(resolve(stage, 'README.md'), swapNames(readme))

const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))

// The alias ships the same files but none of the development wiring.
delete pkg.devDependencies
delete pkg.scripts

await writeFile(
  resolve(stage, 'package.json'),
  JSON.stringify({ ...pkg, name: ALIAS }, null, 2) + '\n'
)

// The banner inside the built files names the canonical package.
const bannered = [
  'dist/index.mjs',
  'dist/index.cjs',
  'dist/index.d.ts',
  'dist/index.d.mts',
  'dist/index.d.cts',
]

for (const file of bannered) {
  const path = resolve(stage, file)
  await writeFile(path, swapNames(await readFile(path, 'utf8')))
}

console.log(`staged ${ALIAS}@${pkg.version} in ${stage}`)

execFileSync('npx', ['publint'], { cwd: stage, stdio: 'inherit' })

if (shouldPublish) {
  const publishArgs = ['publish', '--access', 'public', '--tag', tag]
  if (dryRun) publishArgs.push('--dry-run')
  execFileSync('npm', publishArgs, { cwd: stage, stdio: 'inherit' })
} else {
  console.log(
    `\nnot published. Re-run with --publish to publish ${ALIAS}@${pkg.version}.`
  )
}
