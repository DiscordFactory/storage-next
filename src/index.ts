import { BaseAddon } from '@discord-factory/core-next'
import Storage from './Storage'
import { Migration, BaseMigration } from './entities/Migration'
import { Schema, Table } from './types'
import MakeMigration from './commands/MakeMigration'

export default class Index extends BaseAddon<Index> {
  public addonName = 'storage'
  public storage: Storage | undefined

  public registerHooks () {
    return []
  }

  public registerCLI () {
    return [
      MakeMigration,
    ]
  }

  public registerCommands () {
    return []
  }

  public registerEvents () {
    return [
    ]
  }

  public defineKeys () {
    return ['DRIVER', 'PATH']
  }
}

export {
  Migration,
  BaseMigration,
  Schema,
  Table,
}