import { getAocClient } from '../aoc/client'
import { EventDate } from '../aoc/types'

export const createAocClient = () => {
  const token = process.env.AOC_TOKEN!
  const userAgent = process.env.USER_AGENT!

  return getAocClient(token, userAgent)
}

export const downloadInput = (eventDate: EventDate) => {
  const client = createAocClient()
  return client.getInput(eventDate)
}
