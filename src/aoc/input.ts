import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { eventDatePath } from '../paths'
import { ensureDir } from '../utils'
import { EventDate } from './types'

export const ensureInput = async (
  eventDate: EventDate,
  downloadInput: (eventDate: EventDate) => Promise<string>,
) => {
  const baseDir = eventDatePath(eventDate)
  const inputPath = join(baseDir, 'input.txt')

  let downloaded = false
  if (!existsSync(inputPath)) {
    const input = await downloadInput(eventDate)

    if (!input) {
      throw new Error(
        `Downloaded input is empty for year ${eventDate.year}, day ${eventDate.day}`,
      )
    }

    ensureDir(baseDir)
    writeFileSync(inputPath, input, { encoding: 'utf8', flag: 'wx' })
    downloaded = true
  }

  return { inputPath, downloaded }
}
