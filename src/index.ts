import { BaseAddon } from '@discord-factory/core-next'
import Storage from './Storage'
import { Migration, BaseMigration } from './entities/Migration'
import { Schema, Table } from './types'
import MakeMigration from './commands/MakeMigration'
import RunMigration from './commands/RunMigration'
import DownMigration from './commands/DownMigration'

export default class Index extends BaseAddon<Index> {
  public addonName = 'storage'
  public storage: Storage = new Storage(this)

  public async init (): Promise<Index> {
    await this.storage.initialize()
    await this.storage.migrationManager.initialize()
    return this
  }

  public registerHooks () {
    return []
  }

  public registerCLI () {
    return [
      MakeMigration,
      RunMigration,
      DownMigration,
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