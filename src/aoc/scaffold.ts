import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { eventDatePath } from '../paths'
import { ensureDir } from '../utils'
import { solutionTemplate } from './templates'
import { EventDate } from './types'

export const scaffoldDay = (
  eventDate: EventDate,
  baseDir = eventDatePath(eventDate),
) => {
  ensureDir(baseDir)

  const samplePath = join(baseDir, 'sample.txt')
  const solutionPath = join(baseDir, 'solution.ts')

  if (!existsSync(samplePath)) {
    writeFileSync(samplePath, '', { encoding: 'utf8', flag: 'wx' })
  }

  if (!existsSync(solutionPath)) {
    writeFileSync(solutionPath, solutionTemplate, {
      encoding: 'utf8',
      flag: 'wx',
    })
  }

  return { baseDir, samplePath, solutionPath }
}
