import type { DaySolution } from '../../../src/aoc/types'
import { runSolution } from '../../../src/aoc/runner'
import { isMainModule } from '../../../src/utils'

const DIAL_SIZE = 100

const parseInput = (raw: string) =>
  raw
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => ({
      dir: line[0] === 'L' ? 'L' : 'R',
      clicks: Number.parseInt(line.slice(1), 10),
    }))

const moveDial = (
  from: number,
  dir: 'L' | 'R',
  clicks: number,
): { pos: number; zeroPass: number } => {
  const fullRotations = clicks > DIAL_SIZE ? Math.floor(clicks / DIAL_SIZE) : 0
  const move = dir === 'L' ? -clicks : clicks
  const totClicks = from + move

  const pos = ((totClicks % DIAL_SIZE) + DIAL_SIZE) % DIAL_SIZE

  let zeroPass = fullRotations

  if (pos !== 0 && from !== 0) {
    const crossed = (dir === 'L' && pos > from) || (dir === 'R' && pos < from)

    if (crossed) zeroPass++
  }

  return { pos, zeroPass }
}

const part1 = (raw: string): number => {
  let pos = 50
  let password = 0

  for (const { dir, clicks } of parseInput(raw)) {
    const { pos: nextPos } = moveDial(pos, dir as 'L' | 'R', clicks)
    if (nextPos === 0) password++
    pos = nextPos
  }

  return password
}

const part2 = (raw: string): number => {
  let pos = 50
  let password = 0

  for (const { dir, clicks } of parseInput(raw)) {
    const { pos: nextPos, zeroPass } = moveDial(pos, dir as 'L' | 'R', clicks)
    password += zeroPass

    if (nextPos === 0) password++
    pos = nextPos
  }

  return password
}

const solution: DaySolution = {
  part1,
  part2,
}

export default solution

if (isMainModule(import.meta.url)) {
  runSolution(solution, import.meta.url)
}
