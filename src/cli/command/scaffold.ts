import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { Command } from 'commander'

import { ensureInput } from '../../aoc/input'
import { EventDate } from '../../aoc/types'
import { eventDatePath } from '../../paths'
import { dayToString, ensureDir } from '../../utils'
import { parseDay, parseYear } from '../arguments'
import { solutionTemplate } from '../templates'
import { downloadInput } from '../utils'

export const createScaffoldCommand = () => {
  return new Command('scaffold')
    .description('Scaffold event folders and solution templates')
    .argument('<year>', 'Year (e.g. 2025)', parseYear)
    .argument('<day>', 'Day (1-25)', parseDay)
    .action(async (year, day) => {
      await scaffoldDayAndDownload({ year, day })
    })
}

const scaffoldDay = async (eventDate: EventDate) => {
  const baseDir = eventDatePath(eventDate)

  ensureDir(baseDir)

  const samplePath = join(baseDir, 'sample.txt')
  const solutionPath = join(baseDir, 'solution.ts')

  if (!existsSync(samplePath)) {
    writeFileSync(samplePath, '', { encoding: 'utf8' })
  }

  if (!existsSync(solutionPath)) {
    writeFileSync(solutionPath, solutionTemplate, { encoding: 'utf8' })
  }

  const { inputPath, downloaded } = await ensureInput(eventDate, downloadInput)

  return {
    baseDir,
    inputPath,
    downloaded,
    samplePath,
    solutionPath,
  }
}

const scaffoldDayAndDownload = async (eventDate: EventDate) => {
  const scaffold = await scaffoldDay(eventDate)
  console.log(
    `Scaffolded year ${eventDate.year} day ${dayToString(eventDate.day)}`,
  )

  if (scaffold.downloaded) {
    console.log(`Downloaded input to ${scaffold.inputPath}`)
  }
}
