import { EventSolutionPart } from '../aoc/types'
import { createAocClient } from './utils'

export const submitSolution = async (
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
