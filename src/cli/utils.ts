import { getAocClient } from '../aoc/client'

export const createAocClient = () => {
  const token = process.env.AOC_TOKEN!
  const userAgent = process.env.USER_AGENT!

  return getAocClient(token, userAgent)
}
