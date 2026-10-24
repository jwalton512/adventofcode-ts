import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { eventDatePath } from '../paths'
import { ensureDir } from '../utils'
import { EventDate, InputVariant } from './types'

export const inputFilePath = (
  directory: string,
  variant: InputVariant = 'input',
) => join(directory, `${variant}.txt`)

// Normalize line endings and remove one file-ending newline, preserving puzzle data.
export const readInputFile = (filePath: string) =>
  readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').replace(/\n$/, '')

export const readInput = (params: {
  eventDate: EventDate
  variant?: InputVariant
}) =>
  readInputFile(inputFilePath(eventDatePath(params.eventDate), params.variant))

export const ensureInput = async (
  eventDate: EventDate,
  downloadInput: (eventDate: EventDate) => Promise<string>,
) => {
  const baseDir = eventDatePath(eventDate)
  const inputPath = inputFilePath(baseDir)

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
