import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { performance } from 'node:perf_hooks'
import { fileURLToPath } from 'node:url'

import { eventDatePath } from '../paths'
import { dayToString, eventDateFromModule } from '../utils'
import { DaySolution, InputVariant } from './types'

export type RunResult = {
  part1?: { value: unknown; ms: number }
  part2?: { value: unknown; ms: number }
}

export const readInput = (params: {
  year: number
  day: number
  variant?: InputVariant
}) => {
  const { year, day, variant = 'input' } = params

  const filename = variant === 'sample' ? 'sample.txt' : 'input.txt'

  const filePath = join(eventDatePath({ year, day }), filename)

  return readFileSync(filePath, 'utf8').trimEnd()
}

export const runSolution = (
  solution: DaySolution,
  moduleUrl: string,
  variant: InputVariant = 'input',
) => {
  const eventDate = eventDateFromModule(moduleUrl)

  const input =
    eventDate !== null
      ? readInput({ ...eventDate, variant })
      : readFileSync(
          join(dirname(fileURLToPath(moduleUrl)), 'input.txt'),
          'utf8',
        ).trimEnd()

  console.log(
    `Running: ${
      eventDate
        ? join(eventDatePath(eventDate), `${variant}.txt`)
        : join(dirname(fileURLToPath(moduleUrl)), 'input.txt')
    }`,
  )
  if (solution.part1) console.log('Part 1:', solution.part1(input))
  if (solution.part2) console.log('Part 2:', solution.part2(input))
}

export const runDay = async (params: {
  year: number
  day: number
  part?: number
  variant?: InputVariant
}): Promise<RunResult> => {
  const { year, day, part, variant = 'input' } = params
  const dayStr = dayToString(day)

  const modulePath = join(eventDatePath({ year, day }), 'solution.ts')

  const mod = (await import(modulePath)) as { default?: DaySolution }
  const solution = mod.default

  if (!solution) {
    throw new Error(
      `No default DaySolution export found for ${year}/day${dayStr}`,
    )
  }

  const input = readInput({ year, day, variant })
  const result: RunResult = {}

  const runPart1 = part === undefined || part === 1
  const runPart2 = part === undefined || part === 2

  if (runPart1 && solution.part1) {
    const t0 = performance.now()
    const value = solution.part1(input)
    const t1 = performance.now()
    result.part1 = { value, ms: t1 - t0 }
  }

  if (runPart2 && solution.part2) {
    const t0 = performance.now()
    const value = solution.part2(input)
    const t1 = performance.now()
    result.part2 = { value, ms: t1 - t0 }
  }

  return result
}
