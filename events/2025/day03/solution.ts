import { fileURLToPath } from 'node:url'
import type { DaySolution } from '../../../src/aoc/types'
import { dirname, join } from 'node:path'
import { readFileSync } from 'node:fs'

type Bank = number[]

const parseInput = (raw: string): Bank[] =>
  raw.split('\n').map(bank => bank.split('').map(ch => Number.parseInt(ch, 10)))

const getJoltage = (bank: Bank, length: number): number => {
  const stack: number[] = []

  for (let i = 0; i < bank.length; i++) {
    const digit = bank[i]
    const remaining = bank.length - i - 1

    while (
      stack.length > 0 &&
      stack[stack.length - 1] < digit &&
      stack.length - 1 + (remaining + 1) >= length
    ) {
      stack.pop()
    }

    if (stack.length < length) stack.push(digit)
  }

  return Number(stack.join(''))
}

const calc = (raw: string, numBatts: number): number => {
  let total = 0
  for (const bank of parseInput(raw)) {
    total += getJoltage(bank, numBatts)
  }
  return total
}

const part1 = (raw: string): number => calc(raw, 2)

const part2 = (raw: string): number => calc(raw, 12)

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
