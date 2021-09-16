import { CLICommand, BaseAddonCommand } from '@discord-factory/core-next'
import Addon from '../index'
import Logger from '@leadcodedev/logger'
import { MigrationEntity } from '../entities/Migration'

@CLICommand({
  name: 'Create migration file',
  prefix: 'migration:run',
  usages: []
})
export default class RunMigration extends BaseAddonCommand<Addon> {
  public async run (): Promise<void> {
    await Promise.all(
      this.context!.addon.storage!.migrationManager.migrations.map(async (migration: MigrationEntity) => {
        const isAlreadyMigrate = await this.context?.addon.storage?.databaseClient?.schema.hasTable(migration.tableName)
        if (!isAlreadyMigrate) {
          try {
            await migration.up(this.context?.addon.storage.databaseClient?.schema)
          } catch (err) {}
        }
      })
    )

    Logger.send('info', `Migrations have been migrated.`)
    process.exit(0)
  }
}