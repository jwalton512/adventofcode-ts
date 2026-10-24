import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cpSync, mkdirSync, symlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { pathToFileURL } from 'node:url'

import { runSolution } from '../src/aoc/runner'
import { projectRoot } from '../src/paths'
import { eventDateFromModule } from '../src/utils'
import { temporaryDirectory } from './helpers'

test('event date inference recognizes event directories without partial matches', () => {
  const moduleUrl = (path: string) =>
    pathToFileURL(join(projectRoot(), path)).href
  assert.deepEqual(
    eventDateFromModule(moduleUrl('events/2025/day01/solution.ts')),
    {
      year: 2025,
      day: 1,
    },
  )
  assert.equal(
    eventDateFromModule(moduleUrl('events/2025/day010/solution.ts')),
    null,
  )
  assert.equal(eventDateFromModule(moduleUrl('other/solution.ts')), null)
})

test('direct execution outside events reads the requested adjacent sample', t => {
  const directory = temporaryDirectory(t)
  writeFileSync(join(directory, 'input.txt'), 'actual\n')
  writeFileSync(join(directory, 'sample.txt'), 'sample  \r\n')
  t.mock.method(console, 'log', () => {})

  const result = runSolution(
    { part1: input => input },
    pathToFileURL(join(directory, 'solution.ts')).href,
    'sample',
  )
  assert.equal(result.part1?.value, 'sample  ')
  assert.equal(result.part2, undefined)
})

test('runner entry points agree on sample selection and whitespace', t => {
  const root = temporaryDirectory(t)
  writeFileSync(join(root, 'package.json'), JSON.stringify({ type: 'module' }))
  cpSync(join(projectRoot(), 'src'), join(root, 'src'), { recursive: true })
  symlinkSync(
    join(projectRoot(), 'node_modules'),
    join(root, 'node_modules'),
    'dir',
  )
  const directory = join(root, 'events', '2025', 'day01')
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(directory, 'sample.txt'), 'sample  \r\n')
  writeFileSync(
    join(directory, 'solution.ts'),
    `
import { runSolution } from '../../../src/aoc/runner'
import { isMainModule } from '../../../src/utils'
const solution = { part1: (raw: string) => raw, part2: (raw: string) => raw.length }
export default solution
if (isMainModule(import.meta.url)) runSolution(solution, import.meta.url, 'sample')
`,
  )

  const run = (args: string[]) =>
    spawnSync(process.execPath, ['--import', 'tsx', ...args], {
      cwd: root,
      env: { ...process.env, AOC_TOKEN: '', USER_AGENT: '' },
      encoding: 'utf8',
      timeout: 10_000,
    })
  const cli = join(root, 'src', 'cli', 'index.ts')
  for (const args of [
    [cli, 'run', '2025', '1', '--sample'],
    [cli, 'run', '2025', '1', '--sample', '--part', '1'],
    [join(directory, 'solution.ts')],
  ]) {
    const result = run(args)
    assert.equal(result.error, undefined)
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /Part 1: sample {3}\(/)
  }

  for (const args of [
    ['run', '2025junk', '1', '--sample'],
    ['scaffold', '2025', '0'],
    ['submit', '2025', '1', '3'],
    ['run', '2025', '1', '--part', '3'],
  ]) {
    const result = run([cli, ...args])
    assert.equal(result.error, undefined)
    assert.equal(result.status, 1)
    assert.match(result.stderr, /error: .*invalid/i)
  }
})
