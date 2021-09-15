import { BaseAddon } from '@discord-factory/core-next'
import Addon from '../index'
import { Schema } from '../types'

export function Migration () {
  return (target: Function) => {
    return class Migration extends MigrationEntity {
      constructor (addon: BaseAddon<Addon>) {
        super(
          addon,
          target.prototype.up,
          target.prototype.down
        )
      }
    } as any
  }
}

export class MigrationEntity {
  public static type: string = 'migration'
  constructor (
    public addon: BaseAddon<Addon>,
    public up: (table: any) => Promise<void>,
    public down: (table: any) => Promise<void>,
  ) {
  }
}

export abstract class BaseMigration {
  public addon: BaseAddon<Addon> | undefined
  public abstract up (table: Schema): Promise<any>
  public abstract down (table: Schema): Promise<any>
}