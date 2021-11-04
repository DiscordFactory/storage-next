import { BaseAddon } from '@discord-factory/core-next'
import Storage from './Storage'
import { BaseMigration, Migration } from './entities/Migration'
import { BaseModel, beforeCreate, Model } from './entities/Model'
import { Schema, Table } from './types'
import MakeMigration from './commands/MakeMigration'
import RunMigration from './commands/RunMigration'
import DownMigration from './commands/DownMigration'
import MakeModel from './commands/MakeModel'
import Uuid from './Uuid'

export default class Index extends BaseAddon<Index> {
  public addonName = 'storage'
  public storage: Storage = new Storage(this)

  public async init (): Promise<Index> {
    await this.storage.initialize()
    await this.storage.migrationManager.initialize()
    await this.storage.modelManager.initialize()

    return this
  }

  public registerHooks () {
    return []
  }

  public registerCLI () {
    return [
      MakeModel,
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
  Model,
  BaseModel,
  Schema,
  Table,
  Uuid,

  beforeCreate,

  // hasMany,
  // belongTo,
  // manyToMany,
}