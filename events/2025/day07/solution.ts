import { runSolution } from '../../../src/aoc/runner'
import type { DaySolution } from '../../../src/aoc/types'
import { isMainModule } from '../../../src/utils'

const parseInput = (raw: string) => {
  return raw.split('\n')
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
