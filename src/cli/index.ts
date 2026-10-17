import 'dotenv/config'

import { Command } from 'commander'

import { createRunCommand } from './command/run'
import { createScaffoldCommand } from './command/scaffold'
import { createSubmitCommand } from './command/submit'

const program = new Command()

program.name('aoc').description('Advent of Code utilities').version('0.1.0')
program.addCommand(createScaffoldCommand())
program.addCommand(createSubmitCommand())
program.addCommand(createRunCommand())

const main = async () => {
  await program.parseAsync(process.argv)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
