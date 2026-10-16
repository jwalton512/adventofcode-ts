import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { ensureInput } from '../aoc/input'
import { EventDate } from '../aoc/types'
import { eventDatePath } from '../paths'
import { dayToString, ensureDir } from '../utils'
import { downloadInput } from './utils'

const solutionTemplate = `import { runSolution } from '../../../src/aoc/runner'
import type { DaySolution } from '../../../src/aoc/types'
import { isMainModule } from '../../../src/utils'

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

if (isMainModule(import.meta.url)) {
  runSolution(solution, import.meta.url)
}
`

export const scaffoldDay = async (eventDate: EventDate) => {
  const baseDir = eventDatePath(eventDate)

  ensureDir(baseDir)

  const samplePath = join(baseDir, 'sample.txt')
  const solutionPath = join(baseDir, 'solution.ts')

  if (!existsSync(samplePath)) {
    writeFileSync(samplePath, '', { encoding: 'utf8' })
  }

  if (!existsSync(solutionPath)) {
    writeFileSync(solutionPath, solutionTemplate, { encoding: 'utf8' })
  }

  const { inputPath, downloaded } = await ensureInput(eventDate, downloadInput)

  return {
    baseDir,
    inputPath,
    downloaded,
    samplePath,
    solutionPath,
  }
}

export const scaffoldDayAndDownload = async (eventDate: EventDate) => {
  const scaffold = await scaffoldDay(eventDate)
  console.log(
    `Scaffolded year ${eventDate.year} day ${dayToString(eventDate.day)}`,
  )

  if (scaffold.downloaded) {
    console.log(`Downloaded input to ${scaffold.inputPath}`)
  }
}
