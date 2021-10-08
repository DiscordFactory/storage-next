import { BaseAddon } from '@discord-factory/core-next'
import Addon from '../index'
import { QueryBuilder } from '../QueryBuilder'
import { Collection } from 'discord.js'
import { RelationOptions } from '../types'

export function Model (tableName: string): (target: Function) => any {
  return (target: Function) => {

    class ModelConstructor extends target.prototype.constructor {
      public addon!: BaseAddon<Addon>
      public tableName!: string
    }

    return class Model extends ModelConstructor {
      private queryBuilder!: QueryBuilder<typeof Model>
      public static $instance: Model
      public static tableName = tableName
      public static type: string = 'model'
      public static relations = {
        hasMany: target.prototype.hasMany,
        belongTo: target.prototype.belongTo,
      }

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
    }
  }
}

export function hasMany (relation: typeof BaseModel, options?: RelationOptions) {
  return function (target: any, propertyKey: string) {
    if (!target.hasMany) {
      target.hasMany = new Collection<string, { new (): BaseModel }>()
    }

    target.hasMany.set(propertyKey, {
      model: relation,
      options
    })
  } as any
}

export function belongTo (relation: typeof BaseModel, options?: RelationOptions) {
  return function (target: any, propertyKey: string) {
    if (!target.hasMany) {
      target.belongTo = new Collection<string, { new (): BaseModel }>()
    }

    target.belongTo.set(propertyKey, {
      model: relation,
      options
    })
  } as any
}

export function manyToMany (relation: typeof BaseModel, options?: RelationOptions) {
  return function (target: any, propertyKey: string) {
    if (!target.manyToMany) {
      target.manyToMany = new Collection<string, { new (): BaseModel }>()
    }

    target.manyToMany.set(propertyKey, {
      model: relation,
      options
    })
  } as any
}

export abstract class BaseModel {
  public static query (): QueryBuilder<BaseModel> {
    return BaseModel.query()
  }

  public static beforeInsert (model: BaseModel) {}
  public static beforeSave (model: BaseModel) {}
}
