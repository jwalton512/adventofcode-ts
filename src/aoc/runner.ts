import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { performance } from 'node:perf_hooks'
import { fileURLToPath } from 'node:url'

import { eventDatePath } from '../paths'
import { dayToString, eventDateFromModule } from '../utils'
import {
  Answer,
  DaySolution,
  EventDate,
  InputVariant,
  PartFn,
  SolutionPart,
} from './types'

export type PartResult = {
  value: Answer
  elapsedMs: number
}

export type RunResult = {
  part1?: PartResult
  part2?: PartResult
}

type RunArguments = {
  eventDate: EventDate
  variant?: InputVariant
}

export const readInput = (params: {
  eventDate: EventDate
  variant?: InputVariant
}) => {
  const { eventDate, variant = 'input' } = params

  const filename = variant === 'sample' ? 'sample.txt' : 'input.txt'

  const filePath = join(eventDatePath(eventDate), filename)

  return readFileSync(filePath, 'utf8').trimEnd()
}

const loadDay = async (args: RunArguments) => {
  const { year, day } = args.eventDate
  const modulePath = join(eventDatePath(args.eventDate), 'solution.ts')
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
    input: readInput(args),
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

const executeSolution = (
  solution: DaySolution,
  input: string,
  part?: SolutionPart,
): RunResult => {
  const results: RunResult = {}
  const parts: SolutionPart[] = part === undefined ? [1, 2] : [part]

  for (const selectedPart of parts) {
    const key = `part${selectedPart}` as const
    const fn = solution[key]

    if (!fn) {
      if (part !== undefined) {
        throw new Error(`Part ${part} not implemented`)
      }
      continue
    }

    results[key] = executePart(fn, input)
  }
  return results
}

export const runPart = async (
  options: RunArguments & { part: SolutionPart },
): Promise<PartResult> => {
  const { solution, input } = await loadDay(options)
  const fn = solution[`part${options.part}`]

  if (!fn) {
    throw new Error(
      `Part ${options.part} is not implemented for ${options.eventDate.year}/day${dayToString(options.eventDate.day)}`,
    )
  }

  const results = executeSolution(solution, input, options.part)
  return results[`part${options.part}`]!
}

export const runSolution = (
  solution: DaySolution,
  moduleUrl: string,
  variant: InputVariant = 'input',
): RunResult => {
  const eventDate = eventDateFromModule(moduleUrl)

  const input =
    eventDate !== null
      ? readInput({ eventDate, variant })
      : readFileSync(
          join(dirname(fileURLToPath(moduleUrl)), `${variant}.txt`),
          'utf8',
        ).trimEnd()

  console.log(
    `Running: ${
      eventDate
        ? join(eventDatePath(eventDate), `${variant}.txt`)
        : join(dirname(fileURLToPath(moduleUrl)), `${variant}.txt`)
    }`,
  )

  const result = executeSolution(solution, input)
  printResult(result)

  return result
}

export const runDay = async (options: RunArguments): Promise<RunResult> => {
  const { solution, input } = await loadDay(options)

  return executeSolution(solution, input)
}

export const printResult = (result: RunResult) => {
  for (const part of [1, 2] as const) {
    const partResult = result[`part${part}`]
    if (!partResult) continue

    console.log(
      `Part ${part}: ${String(partResult.value)} (${partResult.elapsedMs.toFixed(2)} ms)`,
    )
  }
}
