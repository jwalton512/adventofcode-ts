import { Command } from 'commander'

import { ensureInput } from '../../aoc/input'
import { runDay, runPart } from '../../aoc/runner'
import { EventDate, InputVariant, SolutionPart } from '../../aoc/types'
import { parseDay, parsePart, parseYear } from '../arguments'
import { downloadInput } from '../utils'

export const createRunCommand = () => {
  return new Command('run')
    .description('Run solution for a specific event')
    .argument('<year>', 'Year (e.g. 2025)', parseYear)
    .argument('<day>', 'Day (1-25)', parseDay)
    .option('-p, --part <part>', 'Part to run', parsePart)
    .option('-s, --sample', 'run with sample data instead of input')
    .action(async (year, day, options) => {
      await runSolution({ year, day }, options.part, options.sample ?? false)
    })
}

const runSolution = async (
  eventDate: EventDate,
  part?: SolutionPart,
  useSample: boolean = false,
) => {
  const variant: InputVariant = useSample ? 'sample' : 'input'

  if (variant === 'input') {
    const { inputPath, downloaded } = await ensureInput(
      eventDate,
      downloadInput,
    )

    if (downloaded) {
      console.log(`Downloaded input to ${inputPath}`)
    }
  }

  const optionsForDay = { eventDate, variant }

  if (part !== undefined) {
    const result = await runPart({
      ...optionsForDay,
      part,
    })

    console.log(
      `Part ${part}: ${String(result.value)} (${result.elapsedMs.toFixed(2)} ms)`,
    )
  } else {
    const results = await runDay(optionsForDay)

    console.log(
      `Year ${eventDate.year}, Day ${eventDate.day}, variant=${variant}`,
    )

    if (results.part1) {
      const { value, elapsedMs } = results.part1
      console.log(`Part 1: ${String(value)} (${elapsedMs.toFixed(2)} ms)`)
    }

    if (results.part2) {
      const { value, elapsedMs } = results.part2
      console.log(`Part 2: ${String(value)} (${elapsedMs.toFixed(2)} ms)`)
    }
  }
}
