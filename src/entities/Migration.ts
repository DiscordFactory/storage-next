import { BaseAddon } from '@discord-factory/core-next'
import Addon from '../index'
import { Schema } from '../types'

export function Migration (): (target: Function) => any {
  return (target: Function) => {
    const migration = new target.prototype.constructor
    return class Migration extends MigrationEntity {
      constructor (addon: BaseAddon<Addon>) {
        super(
          addon,
          migration.tableName,
          target.prototype.up,
          target.prototype.down
        )
      }
    }
  }
}

export class MigrationEntity {
  public static type: string = 'migration'
  constructor (
    public addon: BaseAddon<Addon>,
    public tableName: string,
    public up: (table: any) => Promise<void>,
    public down: (table: any) => Promise<void>,
  ) {
  }
}

export abstract class BaseMigration {
  public addon: BaseAddon<Addon> | undefined
  public abstract tableName: string
  public abstract up (table: Schema): Promise<any>
  public abstract down (table: Schema): Promise<any>
}