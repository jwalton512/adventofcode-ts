import type { DaySolution } from '../../../src/aoc/types'
import { runSolution } from '../../../src/aoc/runner'
import { isMainModule } from '../../../src/utils'

type Range = { start: number; end: number }

const parseInput = (raw: string): Range[] =>
  raw
    .trim()
    .split(',')
    .map(part => {
      const [start, end] = part.split('-').map(v => Number.parseInt(v, 10))
      return { start, end }
    })

const isSymmetric = (value: number): boolean => {
  const str = String(value)
  if (str.length % 2 !== 0) return false

  const mid = str.length / 2
  return str.slice(0, mid) === str.slice(mid)
}

/**
 * This works by simply doubling the string, then if we can find the original string
 * within the combined string somewhere after the beginning but before the end, it
 * is a repeated pattern
 * https://stackoverflow.com/a/21171109 is a good explanation
 */
const isRepeatedPattern = (value: number): boolean => {
  const str = String(value)
  if (str.length < 2) return false

  const doubled = str + str
  const idx = doubled.indexOf(str, 1)
  return idx !== -1 && idx < str.length
}

const calc = (raw: string, allowPatterns = false) => {
  const ranges = parseInput(raw)
  const isInvalid = allowPatterns ? isRepeatedPattern : isSymmetric

  let result = 0
  for (const { start, end } of ranges) {
    for (let i = start; i <= end; i++) {
      if (isInvalid(i)) result += i
    }
  }

  return result
}

const part1 = (raw: string): number => calc(raw)

const part2 = (raw: string): number => calc(raw, true)

const solution: DaySolution = {
  part1,
  part2,
}

export default solution

if (isMainModule(import.meta.url)) {
  runSolution(solution, import.meta.url)
}
