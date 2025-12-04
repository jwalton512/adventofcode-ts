export type EventDate = { year: number; day: number }

export type SolutionPart = 1 | 2

export type PartFn = (input: string) => unknown

export type DaySolution = {
  part1?: PartFn
  part2?: PartFn
}

export type EventSolutionPart = { eventDate: EventDate; part: SolutionPart }

export type InputVariant = 'input' | 'sample'
