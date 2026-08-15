import { runSolution } from '../../../src/aoc/runner'
import type { DaySolution } from '../../../src/aoc/types'
import { isMainModule } from '../../../src/utils'

type Operator = '+' | '*'

const splitColumns = (lines: string[]): string[][] => {
  const width = Math.max(...lines.map(l => l.length))
  const isGap = new Array<boolean>(width)

  for (let x = 0; x < width; x++) {
    let gap = true
    for (let y = 0; y < lines.length; y++) {
      if (lines[y][x] !== ' ') {
        gap = false
        break
      }
    }
    isGap[x] = gap
  }

  const segments: Array<[number, number]> = []
  let i = 0

  while (i < width) {
    while (i < width && isGap[i]) i++
    if (i >= width) break

    const start = i
    while (i < width && !isGap[i]) i++
    segments.push([start, i])
  }

  return segments.map(([s, e]) => lines.map(row => row.slice(s, e)))
}

const peelRightToLeft = (colRows: string[]): number[] => {
  const width = Math.max(...colRows.map(s => s.length))
  const out: number[] = []

  for (let x = width - 1; x >= 0; x--) {
    let s = ''
    for (let y = 0; y < colRows.length; y++) {
      const row = colRows[y]
      const ch = x < row.length ? row[x] : ' '
      if (ch !== ' ') s += ch
    }
    if (s) out.push(Number(s))
  }
  return out
}

const parseInput = (raw: string): [string[][], Operator[]] => {
  const lines = raw.trimEnd().split('\n')
  const opsLine = lines.pop() ?? ''

  const columns = splitColumns(lines)
  const ops = opsLine.trim().split(/\s+/) as Operator[]

  return [columns, ops]
}

const operations: Record<Operator, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '*': (a, b) => a * b,
}

const reduceColumnNumbers = (col: string[], op: Operator): number => {
  if (op === '+') {
    let sum = 0
    for (let i = 0; i < col.length; i++) sum += Number(col[i])
    return sum
  }

  let product = 1
  for (let i = 0; i < col.length; i++) product *= Number(col[i])
  return product
}

const reduceColumnValues = (values: number[], op: Operator): number => {
  const fn = operations[op]
  let acc = op === '+' ? 0 : 1
  for (let i = 0; i < values.length; i++) acc = fn(acc, values[i])
  return acc
}

const part1 = (raw: string): number => {
  const [cols, ops] = parseInput(raw)
  let result = 0
  for (let i = 0; i < cols.length; i++) {
    result += reduceColumnNumbers(cols[i], ops[i])
  }
  return result
}

const part2 = (raw: string): number => {
  const [cols, ops] = parseInput(raw)
  let result = 0
  for (let i = 0; i < cols.length; i++) {
    const peeled = peelRightToLeft(cols[i])
    result += reduceColumnValues(peeled, ops[i])
  }
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
