import Addon from './index'
import Knex from 'knex'
import { driverType, KnexClient } from './types'
import path from 'path'
import MigrationManager from './managers/MigrationManager'

export default class Storage {
  public databaseClient: KnexClient | undefined
  public migrationManager: MigrationManager = new MigrationManager(this)

  constructor (public addon: Addon) {
    this.initialize()
  }

  private async initialize () {
    const driver: driverType = this.addon.context.getModuleEnvironment('Storage', 'DRIVER') as driverType
    const databaseLocation: string = this.addon.context.getModuleEnvironment('Storage', 'PATH') as string

    this.databaseClient = Knex({
      client: driver,
      useNullAsDefault: true,
      connection: {
        filename: path.resolve(process.cwd(), databaseLocation)
      }
    })
  }
}