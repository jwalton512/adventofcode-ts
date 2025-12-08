import type { DaySolution } from '../../../src/aoc/types'
import { runSolution } from '../../../src/aoc/runner'
import { isMainModule } from '../../../src/utils'

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

if (isMainModule(import.meta.url)) {
  runSolution(solution, import.meta.url)
}
