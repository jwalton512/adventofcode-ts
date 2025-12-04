import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { EventDate } from './aoc/types'
import { dayToString } from './utils'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))

export const projectRoot = () => repoRoot

export const eventDatePath = (eventDate: EventDate) => {
  const { year, day } = eventDate
  return join(repoRoot, 'events', String(year), `day${dayToString(day)}`)
}
