import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { EventDate } from '../aoc/types'
import { eventDatePath } from '../paths'
import { dayToString } from '../utils'
import { createAocClient } from './utils'

const ensureDir = (path: string) => {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
  }
}

const solutionTemplate = `import { fileURLToPath } from 'node:url'
import type { DaySolution } from '../../../src/aoc/types'
import { dirname, join } from 'node:path'
import { readFileSync } from 'node:fs'

const parseInput = (raw: string) => {
  return raw.split('\\n')
}

const part1 = (raw: string): number => {
  const lines = parseInput(raw)
  // TODO: implement part 1
}

const part2 = (raw: string): number => {
  const lines = parseInput(raw)
  // TODO: implement part 2
}

const solution: DaySolution = {
  part1,
  part2,
}

export default solution

const main = () => {
  const filePath = fileURLToPath(import.meta.url)
  const dir = dirname(filePath)
  const inputPath = join(dir, 'input.txt')

  const raw = readFileSync(inputPath, 'utf8').trimEnd()

  console.log(\`Running: \${inputPath}\`)
  console.log('Part 1:', part1(raw))
  console.log('Part 2:', part2(raw))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
`

export const scaffoldDay = (eventDate: EventDate) => {
  const baseDir = eventDatePath(eventDate)

  ensureDir(baseDir)

  const inputPath = join(baseDir, 'input.txt')
  const samplePath = join(baseDir, 'sample.txt')
  const solutionPath = join(baseDir, 'solution.ts')

  if (!existsSync(inputPath)) {
    writeFileSync(inputPath, '', { encoding: 'utf8' })
  }

  if (!existsSync(samplePath)) {
    writeFileSync(samplePath, '', { encoding: 'utf8' })
  }

  if (!existsSync(solutionPath)) {
    writeFileSync(solutionPath, solutionTemplate, { encoding: 'utf8' })
  }

  return {
    baseDir,
    inputPath,
    samplePath,
    solutionPath,
  }
}

export const scaffoldDayAndDownload = async (eventDate: EventDate) => {
  const { year, day } = eventDate
  const paths = scaffoldDay({ year, day })
  console.log(`Scaffolded year ${year} day ${dayToString(day)}`)

  const client = createAocClient()

  const data = await client.getInput({ year, day })

  writeFileSync(paths.inputPath, data, { encoding: 'utf8' })
  console.log(`Downloaded input to ${paths.inputPath}`)
}
