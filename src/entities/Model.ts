import { BaseAddon } from '@discord-factory/core-next'
import Addon from '../index'
import { QueryBuilder } from '../QueryBuilder'

export function Model (tableName: string) {
  return (target: Function) => {

    class ModelConstructor extends target.prototype.constructor {
      public addon!: BaseAddon<Addon>
      public tableName!: string
    }

    return class Model extends ModelConstructor {
      private queryBuilder!: QueryBuilder<typeof Model>
      public static tableName = tableName
      public static type: string = 'model'
      public static $instance: Model

      public static getInstance () {
        if (!this.$instance) {
          this.$instance = new Model()
        }
        return this.$instance
      }

      public setContext (ctx: BaseAddon<Addon>) {
        this.addon = ctx
        this.queryBuilder = new QueryBuilder(Model as any, (ctx as any).storage.databaseClient)
      }

      public static query (): QueryBuilder<typeof Model> {
        return this.$instance.queryBuilder
      }
    } as any
  }
}

export abstract class BaseModel {
  public static query (): QueryBuilder<unknown> {
    return BaseModel.query()
  }

  public static beforeInsert (model: BaseModel) {}
  public static beforeSave (model: BaseModel) {}
}
