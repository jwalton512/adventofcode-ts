import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { performance } from 'node:perf_hooks'
import { fileURLToPath } from 'node:url'

import { eventDatePath } from '../paths'
import { dayToString, eventDateFromModule } from '../utils'
import { DaySolution, InputVariant, PartFn, SolutionPart } from './types'

export type PartResult = {
  value: unknown
  elapsedMs: number
}

export type RunResult = {
  part1?: PartResult
  part2?: PartResult
}

type RunOptions = {
  year: number
  day: number
  variant?: InputVariant
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

const loadDay = async (options: RunOptions) => {
  const { year, day } = options
  const modulePath = join(eventDatePath({ year, day }), 'solution.ts')
  const mod = (await import(modulePath)) as {
    default?: DaySolution
  }

  if (!mod.default) {
    throw new Error(
      `No default DaySolution export found for ${year}/day${dayToString(day)}`,
    )
  }

  return {
    solution: mod.default,
    input: readInput(options),
  }
}

const executePart = (fn: PartFn, input: string): PartResult => {
  const start = performance.now()
  const value = fn(input)

  return {
    value,
    elapsedMs: performance.now() - start,
  }
}

export const runPart = async (
  options: RunOptions & { part: SolutionPart },
): Promise<PartResult> => {
  const { solution, input } = await loadDay(options)
  const fn = solution[`part${options.part}`]

  if (!fn) {
    throw new Error(
      `Part ${options.part} is not implemented for ${options.year}/day${dayToString(options.day)}`,
    )
  }

  return executePart(fn, input)
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

export const runDay = async (options: RunOptions): Promise<RunResult> => {
  const { solution, input } = await loadDay(options)
  const results: RunResult = {}

  if (solution.part1) {
    results.part1 = executePart(solution.part1, input)
  }

  if (solution.part2) {
    results.part2 = executePart(solution.part2, input)
  }

  return results
}
