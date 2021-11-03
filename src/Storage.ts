import Addon from './index'
import Knex from 'knex'
import { driverType, KnexClient } from './types'
import path from 'path'
import MigrationManager from './managers/MigrationManager'
import ModelManager from './managers/ModelManager'

export default class Storage {
  public databaseClient: KnexClient | undefined
  public migrationManager: MigrationManager = new MigrationManager(this)
  public modelManager: ModelManager = ModelManager.getManager(this)

  constructor (public addon: Addon) {
  }

  public async initialize () {
    const driver: driverType = this.addon.context.getModuleEnvironment('Storage', 'DRIVER') as driverType
    const databaseLocation: string = this.addon.context.getModuleEnvironment('Storage', 'PATH') as string

    this.databaseClient = Knex({
      client: driver,
      useNullAsDefault: true,
      connection: {
        filename: path.join(process.cwd(), databaseLocation),
      }
    })

    return this.databaseClient
  }
}