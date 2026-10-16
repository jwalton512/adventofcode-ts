import 'dotenv/config'

import { Argument, Command } from 'commander'

import { ensureInput } from '../aoc/input'
import { runDay, runPart } from '../aoc/runner'
import { EventDate, InputVariant, SolutionPart } from '../aoc/types'
import { scaffoldDayAndDownload } from './scaffold'
import { submitSolution } from './submit'
import { downloadInput } from './utils'

const program = new Command()

program.name('aoc').description('Advent of Code utilities').version('0.1.0')

program
  .command('scaffold')
  .description('Scaffold event folders and solution templates')
  .argument('<year>', 'Year (e.g. 2025)', value => Number.parseInt(value, 10))
  .argument('<day>', 'Day (1-25)', value => Number.parseInt(value, 10))
  .action(async (year, day) => {
    await scaffoldDayAndDownload({ year, day })
  })

program
  .command('run')
  .description('Run solution for a specific event')
  .argument('<year>', 'Year (e.g. 2025)', value => Number.parseInt(value, 10))
  .argument('<day>', 'Day (1-25)', value => Number.parseInt(value, 10))
  .option('-p, --part <part>', 'specific part to run (1 or 2)', value =>
    Number.parseInt(value, 10),
  )
  .option('-s, --sample', 'run with sample data instead of input')
  .action(async (year, day, options) => {
    const variant: InputVariant = options.sample ? 'sample' : 'input'

    if (variant === 'input') {
      const { inputPath, downloaded } = await ensureInput(
        { year, day },
        downloadInput,
      )

      if (downloaded) {
        console.log(`Downloaded input to ${inputPath}`)
      }
    }

    const optionsForDay = { year, day, variant }

    if (options.part !== undefined) {
      const result = await runPart({
        ...optionsForDay,
        part: options.part,
      })

      console.log(
        `Part ${options.part}: ${String(result.value)} (${result.elapsedMs.toFixed(2)} ms)`,
      )
    } else {
      const results = await runDay(optionsForDay)

      console.log(`Year ${year}, Day ${day}, variant=${variant}`)

      if (results.part1) {
        const { value, elapsedMs } = results.part1
        console.log(`Part 1: ${String(value)} (${elapsedMs.toFixed(2)} ms)`)
      }

      if (results.part2) {
        const { value, elapsedMs } = results.part2
        console.log(`Part 2: ${String(value)} (${elapsedMs.toFixed(2)} ms)`)
      }
    }
  })

program
  .command('submit')
  .argument('<year>', 'Year (e.g. 2025)', value => Number.parseInt(value, 10))
  .argument('<day>', 'Day (1-25)', value => Number.parseInt(value, 10))
  .addArgument(
    new Argument('<part>', 'Part (1 or 2)')
      .choices(['1', '2'])
      .argParser(value => Number.parseInt(value, 10)),
  )
  .action(async (year: number, day: number, part: SolutionPart) => {
    const result = await runPart({ year, day, part })

    if (result.value === undefined) {
      throw new Error(`No answer returned for part ${part}`)
    }

    const eventDate: EventDate = { year, day }
    await submitSolution({ eventDate, part }, result.value as number)
  })

const main = async () => {
  await program.parseAsync(process.argv)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
