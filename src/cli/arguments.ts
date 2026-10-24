import { InvalidArgumentError } from 'commander'

import { SOLUTION_PARTS, SolutionPart } from '../aoc/types'

const parseInteger = (
  value: string,
  label: string,
  min: number,
  max: number,
): number => {
  const parsed = Number(value)

  if (
    !/^\d+$/.test(value) ||
    !Number.isSafeInteger(parsed) ||
    parsed < min ||
    parsed > max
  ) {
    throw new InvalidArgumentError(
      `${label} must be an integer between ${min} and ${max}.`,
    )
  }

  return parsed
}

export const parseYear = (value: string): number =>
  parseInteger(value, 'Year', 2015, 9999)

export const parseDay = (value: string): number =>
  parseInteger(value, 'Day', 1, 25)

export const parsePart = (value: string): SolutionPart => {
  const part = SOLUTION_PARTS.find(part => String(part) === value)

  if (part === undefined) {
    throw new InvalidArgumentError(
      `Part must be one of: ${SOLUTION_PARTS.join(', ')}.`,
    )
  }

  return part
}
