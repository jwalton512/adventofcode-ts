import 'dotenv/config'

import { Argument, Command } from 'commander'

import { runDay } from '../aoc/runner'
import { EventDate, SolutionPart } from '../aoc/types'
import { scaffoldDayAndDownload } from './scaffold'
import { submitSolution } from './submit'

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
    const variant = options.sample ? 'sample' : 'input'

    const results = await runDay({ year, day, part: options.part, variant })

    console.log(`Year ${year}, Day ${day}, variant=${variant}`)

    if (results.part1) {
      const { value, ms } = results.part1 as { value: unknown; ms: number }
      console.log(`Part 1: ${String(value)} (${ms.toFixed(2)} ms)`)
    }

    if (results.part2) {
      const { value, ms } = results.part2 as { value: unknown; ms: number }
      console.log(`Part 2: ${String(value)} (${ms.toFixed(2)} ms)`)
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
    const results = await runDay({ year, day })
    const result = results[`part${part}`]

    if (result?.value === undefined) {
      console.error(`No result found for part ${part}`)
      return
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
