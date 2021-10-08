import { BaseAddon } from '@discord-factory/core-next'
import Addon from '../index'
import { QueryBuilder } from '../QueryBuilder'
import { Collection } from 'discord.js'
import { ObjectResolvable, RelationOptions, TypeResolvable } from '../types'
import Related from '../queries/Related'
import Crud from '../queries/Crud'
import { Knex } from 'knex'

export function Model (tableName: string): (target: Function) => any {
  return (target: Function) => {

    class ModelConstructor extends target.prototype.constructor {
      public addon!: BaseAddon<Addon>
      public tableName!: string
    }

    return class Model extends ModelConstructor {
      private static $queryBuilder: QueryBuilder<typeof Model>
      private static $crud: Crud<typeof Model>
      public static $instance: Model
      public static tableName = tableName
      public static type: string = 'model'
      public static relations = {
        hasMany: target.prototype.hasMany,
        belongTo: target.prototype.belongTo,
        manyToMany: target.prototype.manyToMany
      }

      public static getInstance () {
        if (!this.$instance) {
          this.$instance = new Model()
        }
        return this.$instance
      }

      public setContext (ctx: BaseAddon<Addon>) {
        this.addon = ctx
        Model.$queryBuilder = new QueryBuilder(Model as any, (ctx as any).storage.databaseClient)
        Model.$crud = new Crud(Model as any, Model.$queryBuilder)
      }

      public static query (): Knex.QueryBuilder<any, any> {
        return Model.$queryBuilder.getQuery()
      }

      public static findAll () {
        return Model.$crud.findAll()
      }

      public static find (value: TypeResolvable) {
        return Model.$crud.find(value)
      }

      public static async findBy (data: ObjectResolvable): Promise<typeof Model>
      public static async findBy (columnName: string, value: TypeResolvable): Promise<typeof Model>
      public static async findBy (data: ObjectResolvable | string, value?: TypeResolvable): Promise<typeof Model> {
        if (typeof data === 'string' && value) {
          return Model.$crud.findBy(data, value)
        } else {
          return Model.$crud.findBy(Object.keys(data)[0], Object.values(data)[0])
        }
      }

      public static create (data: ObjectResolvable) {
        if (this['beforeInsert']) {
          this['beforeInsert'](data)
        }
        return Model.$crud.create(data)
      }

      public static createMany (data: ObjectResolvable[]) {
        data.forEach((data: ObjectResolvable) => {
          if (this['beforeInsert']) {
            this['beforeInsert'](data)
          }
        })
        return Model.$crud.createMany(data)
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
  public static query (): Knex.QueryBuilder<ObjectResolvable , any> {
    return BaseModel.query()
  }

  public static findAll (): Promise<BaseModel[]> {
    return BaseModel.findAll()
  }

  public static async find (value: TypeResolvable): Promise<BaseModel> {
    return BaseModel.find(value)
  }

  public static findBy (data: ObjectResolvable): Promise<BaseModel>
  public static findBy (columnName: string, value: TypeResolvable): Promise<BaseModel>
  public static findBy (data: ObjectResolvable | string, value?: TypeResolvable): Promise<BaseModel> {
    if (typeof data === 'string' && value) {
      return BaseModel.findBy(data, value)
    } else {
      return BaseModel.findBy((Object.keys(data)[0]), Object.values(data)[0])
    }
  }

  public static async create (data: ObjectResolvable): Promise<BaseModel> {
    return BaseModel.create(data)
  }

  public static async createMany (data: ObjectResolvable[]): Promise<BaseModel[]> {
    return BaseModel.createMany(data)
  }

  public static beforeInsert (model: BaseModel) {}
  public static beforeSave (model: BaseModel) {}

  public async update (data: ObjectResolvable): Promise<BaseModel> {
    return this
  }

  public async delete (): Promise<void> {}

  public related (relationName: string): Related<BaseModel> {
    return '' as any
  }

  public async preload (alias: string): Promise<BaseModel> {
    return this
  }
}