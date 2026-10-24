import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import test from 'node:test'

import { inputFilePath, readInputFile } from '../src/aoc/input'
import { temporaryDirectory } from './helpers'

test('input reading normalizes newlines without discarding puzzle whitespace', t => {
  const directory = temporaryDirectory(t)
  const path = inputFilePath(directory)
  const cases = [
    ['', ''],
    ['first\nsecond\n', 'first\nsecond'],
    ['first\r\nsecond\r\n', 'first\nsecond'],
    ['  first  \nlast  \n\n', '  first  \nlast  \n'],
    ['last  ', 'last  '],
    ['last\t\n', 'last\t'],
  ]

  for (const [raw, expected] of cases) {
    writeFileSync(path, raw)
    assert.equal(readInputFile(path), expected)
    assert.equal(readFileSync(path, 'utf8'), raw)
  }
})

test('input and sample variants select separate files', t => {
  const directory = temporaryDirectory(t)
  writeFileSync(inputFilePath(directory), 'actual\n')
  writeFileSync(inputFilePath(directory, 'sample'), 'sample\n')

  assert.equal(readInputFile(inputFilePath(directory)), 'actual')
  assert.equal(readInputFile(inputFilePath(directory, 'sample')), 'sample')
})
