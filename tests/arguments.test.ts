import assert from 'node:assert/strict'
import test from 'node:test'

import { InvalidArgumentError } from 'commander'

import { parseDay, parsePart, parseYear } from '../src/cli/arguments'

test('year and day accept their integer boundaries', () => {
  assert.equal(parseYear('2015'), 2015)
  assert.equal(parseYear('9999'), 9999)
  assert.equal(parseDay('1'), 1)
  assert.equal(parseDay('25'), 25)
  assert.equal(parseDay('01'), 1)
})

test('year and day reject malformed, unsafe, and out-of-range numbers', () => {
  for (const value of [
    '',
    ' ',
    '12abc',
    '1.5',
    '-1',
    '1e1',
    '0x10',
    'Infinity',
    '9007199254740993',
  ]) {
    assert.throws(() => parseYear(value), InvalidArgumentError, value)
    assert.throws(() => parseDay(value), InvalidArgumentError, value)
  }
  for (const value of ['2014', '10000']) {
    assert.throws(() => parseYear(value), InvalidArgumentError, value)
  }
  for (const value of ['0', '26']) {
    assert.throws(() => parseDay(value), InvalidArgumentError, value)
  }
})

test('part accepts only 1 or 2', () => {
  assert.equal(parsePart('1'), 1)
  assert.equal(parsePart('2'), 2)
  for (const value of ['', '0', '3', '1abc', '1.0', '01']) {
    assert.throws(() => parsePart(value), InvalidArgumentError, value)
  }
})
