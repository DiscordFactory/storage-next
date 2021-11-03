import Addon from '../index'
import { ObjectResolvable } from '../types'
import QueryBuilder from '../QueryBuilder'

export function Model (tableName: string): (target: Function) => any {
  return (target: Function) => {
    target.prototype.tableName = `${tableName}s`
    return target.prototype.constructor
  }
}

export abstract class BaseModel {
  public static fileType = 'model'
  // public relation: Relation<typeof BaseModel> = new Relation(target.prototype.constructor)
  public addon!: Addon
  public tableName!: string

  private static $queryBuilder: QueryBuilder<BaseModel>

  public setContext (ctx: Addon) {
    this.addon = ctx
    BaseModel.$queryBuilder = new QueryBuilder(this.tableName, (ctx as any).storage.databaseClient)
  }

  public static getQuery () {
    return this.$queryBuilder.getQuery()
  }

  public static async create<K extends keyof BaseModel> (data: ObjectResolvable) {
    this.$queryBuilder.beforeHook(this.$queryBuilder.modelName, data)
    await this.$queryBuilder.getQuery().insert(data)

    return await this.$queryBuilder.lastInsert() as { [K: string]: any }
  }
}
