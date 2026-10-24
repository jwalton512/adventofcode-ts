export type EventDate = { year: number; day: number }

export const SOLUTION_PARTS = [1, 2] as const

export type SolutionPart = (typeof SOLUTION_PARTS)[number]

export type PartFn = (input: string) => string | number | bigint

export type DaySolution = {
  part1?: PartFn
  part2?: PartFn
}

export type EventSolutionPart = { eventDate: EventDate; part: SolutionPart }

export type InputVariant = 'input' | 'sample'
