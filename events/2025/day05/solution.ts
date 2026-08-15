import { runSolution } from '../../../src/aoc/runner'
import type { DaySolution } from '../../../src/aoc/types'
import { isMainModule } from '../../../src/utils'

type Range = { start: number; end: number }

const parseInput = (raw: string): [Range[], number[]] => {
  const [fresh, ingredients] = raw.split('\n\n')

  return [
    fresh.split('\n').map(line => {
      const [start, end] = line.split('-').map(Number)
      return { start, end }
    }),
    ingredients.split('\n').map(Number),
  ]
}

const sortRanges = (ranges: Range[]): Range[] => {
  return ranges.sort((a, b) => {
    if (a.start !== b.start) return a.start < b.start ? -1 : 1
    return a.end < b.end ? -1 : 1
  })
}

const canMerge = (
  next: Range,
  active: { start: number; end: number },
): boolean => {
  return next.start <= active.end + 1
}

const sumRange = (active: { start: number; end: number }): number => {
  return active.end - active.start + 1
}

const part1 = (raw: string): number => {
  const [freshRanges, ingredients] = parseInput(raw)
  let fresh = 0

  for (const i of ingredients) {
    const ranges = freshRanges.filter(r => r.start <= i && r.end >= i).length
    if (ranges) fresh++
  }

  return fresh
}

const part2 = (raw: string): number => {
  let result = 0
  const [ranges] = parseInput(raw)
  const sortedRanges = sortRanges(ranges)

  let active = { start: sortedRanges[0].start, end: sortedRanges[0].end }
  for (let i = 1; i < sortedRanges.length; i++) {
    const next = sortedRanges[i]
    if (canMerge(next, active)) {
      active.end = Math.max(active.end, next.end)
      continue
    }
    result += sumRange(active)
    active = { start: next.start, end: next.end }
  }

  result += sumRange(active)
  return result
}

const solution: DaySolution = {
  part1,
  part2,
}

export default solution

if (isMainModule(import.meta.url)) {
  runSolution(solution, import.meta.url)
}
