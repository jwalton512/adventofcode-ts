import { Command } from 'commander'

import { ensureInput } from '../../aoc/input'
import { scaffoldDay } from '../../aoc/scaffold'
import { EventDate } from '../../aoc/types'
import { dayToString } from '../../utils'
import { parseDay, parseYear } from '../arguments'
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

const scaffoldDayAndDownload = async (eventDate: EventDate) => {
  scaffoldDay(eventDate)
  console.log(
    `Scaffolded year ${eventDate.year} day ${dayToString(eventDate.day)}`,
  )

  const { inputPath, downloaded } = await ensureInput(eventDate, downloadInput)
  if (downloaded) {
    console.log(`Downloaded input to ${inputPath}`)
  }
}
