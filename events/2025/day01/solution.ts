import { fileURLToPath } from 'node:url'
import type { DaySolution } from '../../../src/aoc/types'
import { dirname, join } from 'node:path'
import { readFileSync } from 'node:fs'

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

const main = () => {
  const filePath = fileURLToPath(import.meta.url)
  const dir = dirname(filePath)
  const inputPath = join(dir, 'input.txt')

  const raw = readFileSync(inputPath, 'utf8').trimEnd()

  console.log(`Running: ${inputPath}`)
  console.log('Part 1:', part1(raw))
  console.log('Part 2:', part2(raw))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
