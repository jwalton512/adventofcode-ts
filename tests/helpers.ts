import { mkdtempSync, realpathSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { TestContext } from 'node:test'

export const temporaryDirectory = (t: TestContext) => {
  const directory = realpathSync(mkdtempSync(join(tmpdir(), 'aoc-test-')))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  return directory
}
