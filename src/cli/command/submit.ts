import { Argument, Command } from 'commander'

import { runPart } from '../../aoc/runner'
import { EventDate, EventSolutionPart, SolutionPart } from '../../aoc/types'
import { createAocClient } from '../utils'

export const createSubmitCommand = () => {
  return new Command('submit')
    .description('Submit solution for review')
    .argument('<year>', 'Year (e.g. 2025)', value => Number.parseInt(value, 10))
    .argument('<day>', 'Day (1-25)', value => Number.parseInt(value, 10))
    .addArgument(
      new Argument('<part>', 'Part (1 or 2)')
        .choices(['1', '2'])
        .argParser(value => Number.parseInt(value, 10)),
    )
    .action(async (year: number, day: number, part: SolutionPart) => {
      const result = await runPart({ eventDate: { year, day }, part })

      if (result.value === undefined) {
        throw new Error(`No answer returned for part ${part}`)
      }

      const eventDate: EventDate = { year, day }
      await submitSolution({ eventDate, part }, result.value as number)
    })
}

const submitSolution = async (
  eventSolutionPart: EventSolutionPart,
  solution: number,
) => {
  const client = createAocClient()
  const result = await client.postSolution(eventSolutionPart, solution)

  const { eventDate, part } = eventSolutionPart
  const { year, day } = eventDate

  let exitCode = 0

  switch (result.kind) {
    case 'correct':
      console.log(`Solved part ${part} for ${year} day ${day}!`)
      break
    case 'already-completed':
      console.error(`Already completed part ${part} for ${year} day ${day}`)
      exitCode = 1
      break
    case 'rate-limited': {
      const msgWait = result.wait
        ? `${result.wait} left to wait`
        : 'please wait'
      console.error(`Submitting too fast, ${msgWait}`)
      exitCode = 1
      break
    }
    case 'incorrect':
      console.error(
        `Wrong answer for part ${part} for ${year} day ${day}: ${solution}`,
      )
      exitCode = 1
      break
  }

  process.exitCode = exitCode
}
