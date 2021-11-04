import Addon from '../index'
import { KnexClient, ObjectResolvable, TypeResolvable } from '../types'
import QueryBuilder from '../QueryBuilder'
import { Collection } from 'discord.js'

export function Model (tableName: string): any {
  return (target: any) => {
    target.tableName = `${tableName}s`
    target.modelName = tableName
    target.prototype.tableName = `${tableName}s`
    return target.prototype.constructor
  }
}

export function beforeCreate (): (target: any) => void {
  return (target: any) => {
    if (!target.hooks) {
      target.hooks = new Collection()
      target.hooks.set('beforeCreate', [])
    }

    const hook = target.hooks.get('beforeCreate')
    hook.push(target)
  }
}

export class BaseModel<Model> {
  public static fileType = 'model'
  public static tableName: string
  public static modelName: string
  // public relation: Relation<typeof BaseModel> = new Relation(target.prototype.constructor)
  public addon!: Addon
  public tableName!: string

  private static $databaseClient: KnexClient | undefined

  public setContext (ctx: Addon) {
    this.addon = ctx
    console.log(this.tableName)
    // BaseModel.$queryBuilder = new QueryBuilder(this.tableName, ctx.storage.databaseClient!)
    BaseModel.$databaseClient = ctx.storage.databaseClient
  }

  public setQueryBuilder<M> (knexClient: KnexClient) {
    BaseModel.$databaseClient = knexClient
  }

  private _patch (fields: ObjectResolvable) {
    Object.entries(fields).forEach(([key, value]) => {
      this[key] = value
    })
  }

  private static getQueryBuilder () {
    return new QueryBuilder(this.tableName, this.$databaseClient!)
  }

  /**
   * @description Knex query builder entry point
   * @see QueryInterface
   * @return Knex.QueryBuilder<ObjectResolvable , any>
   */
  public static getQuery () {
    return this.getQueryBuilder().getQuery()
  }

  /**
   * @description Retrieves the entire contents of the table that the model represents
   * @return Promise
   */
  public static async findAll () {
    const response = await this.getQuery().where({}) as ObjectResolvable[]
    return response.map((response: ObjectResolvable) => {
      const model = new BaseModel<BaseModel<unknown>>()

      model.setQueryBuilder(this.$databaseClient!)
      model._patch(response)

      return model
    })
  }

  /**
   * @description Retrieves one resource of the table that the model represents
   * @param {TypeResolvable} value
   * @see TypeResolvable
   */
  public static async find (value: TypeResolvable) {
    const response = await this.getQuery()
      .where({ id: value })
      .first()

    const model = new BaseModel<BaseModel<unknown>>()

    model.setQueryBuilder(this.$databaseClient!)
    model._patch(response)

    return model
  }

  public static async findAllWhere (columnName: string, value: TypeResolvable | null | undefined) {
    const response = await this.getQuery().where({ [columnName]: value }) as ObjectResolvable[]

    return response.map((response: ObjectResolvable) => {
      const model = new BaseModel<BaseModel<unknown>>()

      model.setQueryBuilder(this.$databaseClient!)
      model._patch(response)

      return model
    })
  }

  /**
   * @description Retrieves a resource according to a column and a value
   * @param {ObjectResolvable} data
   */
  public static async findBy (data: ObjectResolvable)
  public static async findBy (columnName: string, value: TypeResolvable)
  public static async findBy (data: ObjectResolvable | string, value?: TypeResolvable) {
    const model = new BaseModel<BaseModel<unknown>>()
    model.setQueryBuilder(this.$databaseClient!)

    const response = typeof data === 'string' && value
      ? await this.getQuery()
        .where({ [data]: value })
        .first()
      : await this.getQuery()
        .where({ [Object.keys(data)[0]]: Object.values(data)[0] })
        .first()

    model._patch(response)

    return model
  }

  /**
   * @description Create one resource from passed data
   * @param {ObjectResolvable} data
   * @return Promise
   */
  public static async create (data: ObjectResolvable) {
    this.getQueryBuilder().beforeCreate(this.tableName, data)
    await this.getQuery().insert(data)

    const response = await this.getQueryBuilder()
      .lastInsert() as ObjectResolvable

    const model = new BaseModel<BaseModel<unknown>>()

    model.setQueryBuilder(this.$databaseClient!)
    model._patch(response)

    return model
  }

  /**
   * @description Create multiple resources from passed data
   * @param {ObjectResolvable[]} data
   * @return Promise
   */
  public static async createMany (data: ObjectResolvable[]): Promise<unknown[]> {
    await Promise.all(
      data.map(async (data: ObjectResolvable) => {
        this.getQueryBuilder().beforeCreate(this.modelName, data)
        await this.getQuery().insert(data)
      })
    )

    const responses = await this.getQueryBuilder()
      .lastInsert(data.length) as ObjectResolvable[]

    return responses.map((response: ObjectResolvable) => {
      const model = new BaseModel<BaseModel<unknown>>()

      model.setQueryBuilder(this.$databaseClient!)
      model._patch(response)

      return model
    })
  }

  public async update (data: ObjectResolvable) {
    const response = await BaseModel.getQuery()
      .where({ id: this['id'] })
      .update(data)

    this._patch(data)
    return { $persisted: response === 1 }
  }

  public async delete () {
    const response = await BaseModel.getQuery()
      .where({ id: this['id'] })
      .delete()

    return { $deleted: response === 1 }
  }
}