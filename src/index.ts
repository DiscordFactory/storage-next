import { BaseAddon } from '@discord-factory/core-next'
import Guard from './Guard'
import CommandManager from './managers/CommandManager'
import { Command, BaseCommand } from './entities/Command'
import MessageCreate from './events/MessageCreate'

export default class Index extends BaseAddon<Index> {
  public addonName = 'basic_commands'
  public commandManager: CommandManager = new CommandManager(this)
  public guard: Guard = new Guard(this)

  public registerHooks () {
    return []
  }

  public registerCLI () {
    return []
  }

  public registerCommands () {
    return []
  }

  public registerEvents () {
    return [
      MessageCreate
    ]
  }

  public defineKeys () {
    return ['APP_PREFIX', 'COMMAND_AUTO_REMOVE']
  }
}

export {
  Command,
  BaseCommand,
}
