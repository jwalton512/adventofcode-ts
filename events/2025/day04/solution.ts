import { runSolution } from '../../../src/aoc/runner'
import type { DaySolution } from '../../../src/aoc/types'
import { isMainModule } from '../../../src/utils'

type GridPos = { x: number; y: number }
type Grid = string[][]

const NEIGHBOR_DELTAS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
] as const

const parseInput = (raw: string): Grid => raw.split('\n').map(line => [...line])

const inbounds = (grid: Grid, { x, y }: GridPos): boolean =>
  y >= 0 && y < grid.length && x >= 0 && x < grid[y].length

const countNeighborRolls = (grid: Grid, { x, y }: GridPos): number => {
  let count = 0
  for (const [dx, dy] of NEIGHBOR_DELTAS) {
    const nx = x + dx
    const ny = y + dy
    if (inbounds(grid, { x: nx, y: ny }) && grid[ny][nx] === '@') count++
  }
  return count
}

const process = (raw: string, loop: boolean = false): number => {
  const grid = parseInput(raw)
  let accessible = 0

  while (true) {
    let accessedThisPass = 0

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] !== '@') continue
        const neighbors = countNeighborRolls(grid, { x, y })
        if (neighbors < 4) {
          if (loop) grid[y][x] = 'X'
          accessedThisPass++
          accessible++
        }
      }
    }

    if (!loop || accessedThisPass === 0) break
  }

  return accessible
}

const part1 = (raw: string): number => process(raw)

const part2 = (raw: string): number => process(raw, true)

const solution: DaySolution = {
  part1,
  part2,
}

export default solution

if (isMainModule(import.meta.url)) {
  runSolution(solution, import.meta.url)
}
