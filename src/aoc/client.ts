import axios from 'axios'

import { EventDate, EventSolutionPart } from './types'

const BASE_URL = 'https://adventofcode.com'

const eventDateUrl = (eventDate: EventDate, path: string = '') => {
  const { year, day } = eventDate
  return `${year}/day/${day}/${path}`
}

export type SubmitResult =
  | { kind: 'correct' }
  | { kind: 'already-completed' }
  | { kind: 'rate-limited'; wait?: string }
  | { kind: 'incorrect' }

export type AocClient = {
  getInput: (eventDate: EventDate) => Promise<string>
  postSolution: (eventSolutionPart: EventSolutionPart, solution: number) => Promise<SubmitResult>
}

export const getAocClient = (token: string, userAgent: string): AocClient => {
  if (!token) throw new Error('AoC session token is required')
  if (!userAgent) throw new Error('AoC User-Agent is required')

  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      Cookie: `session=${token}`,
      'User-Agent': userAgent,
    },
    timeout: 10_000,
  })

  return {
    getInput: async (eventDate: EventDate): Promise<string> => {
      const url = eventDateUrl(eventDate, 'input')
      const resp = await client.get(url, { responseType: 'text' })

      if (resp.status !== 200)
        throw new Error(`AoC input request failed (${resp.status} ${resp.statusText}) for ${url}`)

      return resp.data.toString().trimEnd()
    },

    postSolution: async (
      eventSolutionPart: EventSolutionPart,
      solution: number,
    ): Promise<SubmitResult> => {
      const { eventDate, part } = eventSolutionPart

      const url = eventDateUrl(eventDate, 'answer')

      const body = new URLSearchParams({
        level: String(part),
        answer: String(solution),
      })

      const resp = await client.post(url, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      if (resp.status !== 200)
        throw new Error(
          `AoC solution submission failed (${resp.status} ${resp.statusText}) for ${url}`,
        )

      const respText = resp.data.toString().toLowerCase()

      if (respText.includes('did you already complete it')) {
        return { kind: 'already-completed' }
      }

      if (respText.includes('you have to wait')) {
        const matches = respText.match(/you have ([\w ]+) left to wait/)
        return { kind: 'rate-limited', wait: matches?.[1] }
      }

      if (respText.includes("that's the right answer")) {
        return { kind: 'correct' }
      }

      return { kind: 'incorrect' }
    },
  }
}
