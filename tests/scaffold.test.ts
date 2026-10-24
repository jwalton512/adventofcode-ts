import assert from 'node:assert/strict'
import { existsSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { pathToFileURL } from 'node:url'

import ts from 'typescript'

import { scaffoldDay } from '../src/aoc/scaffold'
import { projectRoot } from '../src/paths'
import { temporaryDirectory } from './helpers'

test('scaffolding works offline and preserves existing files on subsequent runs', t => {
  const root = temporaryDirectory(t)
  const directory = join(root, 'events', '2025', 'day01')
  const date = { year: 2025, day: 1 }
  const result = scaffoldDay(date, directory)

  assert.equal(readFileSync(result.samplePath, 'utf8'), '')
  assert.equal(existsSync(join(directory, 'input.txt')), false)

  writeFileSync(result.samplePath, 'existing sample\n')
  writeFileSync(result.solutionPath, 'existing solution\n')
  writeFileSync(join(directory, 'input.txt'), 'existing input\n')
  assert.deepEqual(scaffoldDay(date, directory), result)
  assert.equal(readFileSync(result.samplePath, 'utf8'), 'existing sample\n')
  assert.equal(readFileSync(result.solutionPath, 'utf8'), 'existing solution\n')
  assert.equal(
    readFileSync(join(directory, 'input.txt'), 'utf8'),
    'existing input\n',
  )
})

test('generated solutions typecheck and report unfinished parts explicitly', async t => {
  const root = temporaryDirectory(t)
  writeFileSync(join(root, 'package.json'), JSON.stringify({ type: 'module' }))
  symlinkSync(join(projectRoot(), 'src'), join(root, 'src'), 'dir')
  symlinkSync(
    join(projectRoot(), 'node_modules'),
    join(root, 'node_modules'),
    'dir',
  )
  const { solutionPath } = scaffoldDay(
    { year: 2025, day: 1 },
    join(root, 'events', '2025', 'day01'),
  )

  const configPath = join(projectRoot(), 'tsconfig.json')
  const { config, error } = ts.readConfigFile(configPath, ts.sys.readFile)
  assert.equal(error, undefined)
  const { options } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    projectRoot(),
  )
  const program = ts.createProgram([solutionPath], {
    ...options,
    rootDir: undefined,
    noEmit: true,
  })
  const diagnostics = ts.getPreEmitDiagnostics(program)
  assert.equal(
    diagnostics.length,
    0,
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: name => name,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => '\n',
    }),
  )

  const { default: solution } = await import(pathToFileURL(solutionPath).href)
  assert.throws(() => solution.part1('example'), /Part 1 is not implemented/)
  assert.throws(() => solution.part2('example'), /Part 2 is not implemented/)
})
