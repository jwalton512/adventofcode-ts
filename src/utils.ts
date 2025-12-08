import { fileURLToPath } from 'node:url'

import { EventDate } from './aoc/types'

export const dayToString = (day: number | string) => {
  return day.toString().padStart(2, '0')
}

export const isMainModule = (moduleUrl: string) =>
  process.argv[1] === fileURLToPath(moduleUrl)

export const eventDateFromModule = (moduleUrl: string): EventDate | null => {
  const filePath = fileURLToPath(moduleUrl)
  const match = filePath.match(/[/\\]events[/\\](\\d{4})[/\\]day(\\d{2})/)
  if (!match) return null
  const [, year, day] = match
  return { year: Number(year), day: Number(day) }
}
