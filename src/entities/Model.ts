import Addon from '../index'
import { ObjectResolvable } from '../types'
import QueryBuilder from '../QueryBuilder'
import GenericModel from './GenericModel'

export function Model (tableName: string): (target: Function) => any {
  return (target: Function) => {
    target.prototype.tableName = `${tableName}s`
    return target.prototype.constructor
  }
}

export abstract class BaseModel<Model> {
  public static fileType = 'model'
  // public relation: Relation<typeof BaseModel> = new Relation(target.prototype.constructor)
  public addon!: Addon
  public tableName!: string

  private static $queryBuilder: QueryBuilder<BaseModel<unknown>>

  public setContext (ctx: Addon) {
    this.addon = ctx
    console.log(this.tableName)
    BaseModel.$queryBuilder = new QueryBuilder(this.tableName, (ctx as any).storage.databaseClient)
  }

  public static getQuery () {
    return this.$queryBuilder.getQuery()
  }

  public static async create (data: { [K: string]: any }) {
    this.$queryBuilder.beforeCreate(this.$queryBuilder.modelName, data)
    await this.$queryBuilder.getQuery().insert(data)

    const response = await this.$queryBuilder.lastInsert() as ObjectResolvable

    return new GenericModel<typeof Model>(response, this.$queryBuilder)
  }
}
