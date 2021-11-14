import Addon from '../index'
import { KnexClient, ObjectResolvable, RelationOptions, TypeResolvable } from '../types'
import QueryBuilder from '../QueryBuilder'
import { Collection } from 'discord.js'

export function Model (model: string): any {
  return (target: any) => {
    target.tableName = `${model}s`
    target.modelName = model
    target.prototype.tableName = `${model}s`
    return target.prototype.constructor
  }
}

export function hasMany (relation: typeof BaseModel, options?: RelationOptions) {
  return function (target: any, propertyKey: string) {
    if (!target.relations) {
      target.relations = {
        hasMany: new Collection<string, { new (): BaseModel<any> }>()
      }
    }

    target.relations.hasMany.set(propertyKey, {
      model: relation,
      options
    })
  } as any
}

export function beforeCreate (): any {
  return (target: any, propertyKey: string) => {

    if (!target.hooks) {
      target.hooks = new Collection()
    }

    if (!target.hooks.get('beforeCreate')) {
      target.hooks.set('beforeCreate', [])
    }

    const hook = target.hooks.get('beforeCreate')
    hook.push(target[propertyKey])
  }
}

export function beforeSave (): any {
  return (target: any, propertyKey: string) => {
    if (!target.hooks) {
      target.hooks = new Collection()
    }

    if (!target.hooks.get('beforeSave')) {
      target.hooks.set('beforeSave', [])
    }

    const hook = target.hooks.get('beforeSave')
    hook.push(target[propertyKey])
  }
}

export class BaseModel<Model> {
  public static fileType = 'model'
  public static tableName: string
  public static modelName: string
  // public relation: Relation<typeof BaseModel> = new Relation(this)
  public addon!: Addon
  public tableName!: string

  private static $databaseClient: KnexClient | undefined
  public $databaseClient: KnexClient | undefined

  public setContext (ctx: Addon) {
    this.addon = ctx
    BaseModel.$databaseClient = ctx.storage.databaseClient
  }

  public setLocalQueryBuilder<M> (knexClient: KnexClient) {
    this.$databaseClient = knexClient
  }

  private getLocalQueryBuilder () {
    return new QueryBuilder(this.tableName, this.$databaseClient!)
  }

  private getLocalQuery () {
    return this.getLocalQueryBuilder().getQuery()
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
  public static async findAll<Model> (): Promise<Model[]> {
    const response = await this.getQuery().where({}) as ObjectResolvable[]
    return response.map((response: ObjectResolvable) => {
      const model = new BaseModel<Model>()

      model.tableName = this.tableName
      model.setLocalQueryBuilder(this.$databaseClient!)
      model._patch(response)

      return model
    }) as unknown as Model[]
  }

  /**
   * @description Retrieves one resource of the table that the model represents
   * @param {TypeResolvable} value
   * @see TypeResolvable
   */
  public static async find<Model> (value: TypeResolvable): Promise<Model | undefined> {
    const response = await this.getQuery()
      .where({ id: value })
      .first()

    if (response) {
      const model = new BaseModel<unknown>()

      model.tableName= this.tableName
      model.setLocalQueryBuilder(this.$databaseClient!)
      model._patch(response)

      return model as unknown as Model
    }
    return undefined
  }

  public static async where<Model> (params: { [K: string]: TypeResolvable }): Promise<Model[]>
  public static async where<Model> (columnName: string, value: TypeResolvable): Promise<Model[]>
  public static async where<Model> (params: { [K: string]: TypeResolvable } | string, value?: TypeResolvable) {
    const query = this.getQuery()

    if (typeof params === 'string') {
      query.where({ [params]: value })
    } else {
      Object.entries(params).forEach(([key, value]) => {
        query.where({ [key]: value })
      })
    }

    const response = await query as ObjectResolvable[]

    return response.filter(response => response)
      .map((response: ObjectResolvable) => {
      const model = new BaseModel<unknown>()

      model.tableName = this.tableName
      model.setLocalQueryBuilder(this.$databaseClient!)
      model._patch(response)

      return model
    }) as unknown as Model[]
  }

  /**
   * @description Retrieves a resource according to a column and a value
   * @param {ObjectResolvable} data
   */
  public static async findBy<Model> (data: ObjectResolvable)
  public static async findBy<Model> (columnName: string, value: TypeResolvable)
  public static async findBy<Model> (data: ObjectResolvable | string, value?: TypeResolvable): Promise<Model | undefined> {
    const response = typeof data === 'string' && value
      ? await this.getQuery()
        .where({ [data]: value })
        .first()
      : await this.getQuery()
        .where({ [Object.keys(data)[0]]: Object.values(data)[0] })
        .first()

    if (response) {
      const model = new BaseModel<Model>()

      model.tableName = this.tableName
      model.setLocalQueryBuilder(this.$databaseClient!)
      model._patch(response)

      return model as unknown as Model
    }
    return undefined
  }

  /**
   * @description Create one resource from passed data
   * @param {ObjectResolvable} data
   * @return Promise
   */
  public static async create<Model> (data: ObjectResolvable): Promise<Model> {
    this.getQueryBuilder().beforeCreate(this.tableName, data)
    await this.getQuery().insert(data)

    const response = await this.getQueryBuilder()
      .lastInsert() as ObjectResolvable

    const model = new BaseModel<unknown>()

    model.tableName = this.tableName
    model.setLocalQueryBuilder(this.$databaseClient!)
    model._patch(response)

    return model as unknown as Model
  }

  /**
   * @description Create multiple resources from passed data
   * @param {ObjectResolvable[]} data
   * @return Promise
   */
  public static async createMany<Model> (data: ObjectResolvable[]): Promise<Model[]> {
    await Promise.all(
      data.map(async (data: ObjectResolvable) => {
        this.getQueryBuilder().beforeCreate(this.modelName, data)
        await this.getQuery().insert(data)
      })
    )

    const responses = await this.getQueryBuilder()
      .lastInsert(data.length) as ObjectResolvable[]

    return responses.map((response: ObjectResolvable) => {
      const model = new BaseModel<unknown>()

      model.tableName = this.tableName
      model.setLocalQueryBuilder(this.$databaseClient!)
      model._patch(response)

      return model as unknown as Model
    })
  }

  public async update (data: ObjectResolvable): Promise<{$persisted: boolean }> {
    this.getLocalQueryBuilder().beforeSave(this.tableName, data)
    const response = await this.getLocalQuery()
      .where({ id: this['id'] })
      .update(data)

    this._patch(data)
    return { $persisted: response === 1 }
  }

  public async delete (): Promise<{$deleted: boolean }> {
    const response = await this.getLocalQuery()
      .where({ id: this['id'] })
      .delete()

    return { $deleted: response === 1 }
  }
}