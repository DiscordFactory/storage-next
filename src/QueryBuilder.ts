import { KnexClient, ObjectResolvable, Relations, TypeResolvable } from './types'
import { Knex } from 'knex'
import { KnexQueryBuilder } from './types'
import Related from './queries/Related'

export class QueryBuilder<M> {
  constructor (
    public model: M & {
      tableName: string,
      relations: Relations
      beforeInsert (values: ObjectResolvable): void,
      beforeSave (values: ObjectResolvable): void
    },
    private knexClient: KnexClient
  ) {
  }

  public getQuery (): Knex.QueryBuilder {
    return (this as any).knexClient(this.model.tableName)
  }

  public async lastInsert (count?: number): Promise<M | M[]> {
    const inputs = await this.knexClient.raw(`SELECT * FROM ${this.model.tableName} ORDER BY rowid DESC LIMIT ${count || 1};`)
    return inputs.length === 1
      ? inputs[0] as Promise<M>
      : inputs.reverse() as unknown as Promise<M[]>
  }

  public async findAll (): Promise<M[]> {
    return this.getQuery().where({})
  }

  public where (selector: ObjectResolvable): KnexQueryBuilder {
    return this.getQuery().where(selector)
  }

  public async findBy (column: string, value: unknown): Promise<M> {
    return this.getQuery().where({ [column]: value }).first()
  }

  public async find (value: TypeResolvable): Promise<M> {
    return this.getQuery().where({ id: value }).first()
  }

  public async create (value: ObjectResolvable): Promise<M> {
    this.model.beforeInsert(value)

    await this.getQuery().insert(value)
    return await this.lastInsert() as M
  }

  public async createMany (values: ObjectResolvable[]): Promise<M[]> {
    values.forEach((value: ObjectResolvable) => this.model.beforeInsert(value))

    await this.getQuery().insert(values)
    return await this.lastInsert(2) as M[]
  }

  public async updateWhere (value: ObjectResolvable, selector: ObjectResolvable): Promise<M> {
    this.model.beforeSave(value)

    await this.getQuery().where(selector).update(value)
    return this.getQuery().where(value).first()
  }

  public async delete (selector: ObjectResolvable): Promise<void> {
    await this.getQuery().where(selector).delete()
  }

  private relationExist (alias: string) {
    const relationHasManyModel = this.model.relations.hasMany?.get(alias)
    const relationBelongToModel = this.model.relations.belongTo?.get(alias)

    const hasRelationResolvable = relationHasManyModel === undefined
      && relationBelongToModel === undefined

    if (hasRelationResolvable) {
      throw new Error(`No relationship exists under the name "${alias}"`)
    }

    return {
      relationHasManyModel,
      relationBelongToModel
    }
  }
  // public async preload (alias: string): Promise<M[]> {
  public async preload (alias: string) {
    const { relationHasManyModel, relationBelongToModel } = this.relationExist(alias)

    // HasMany relation
    if (relationHasManyModel !== undefined) {
      const classObject = await this.getQuery()
        .select('*')
        .from(this.model.tableName) as M[]

      return Promise.all(
        classObject.map(async (e) => {
          const tableName = alias.slice(0, alias.length - 1)

          const b = await this.getQuery()
            .from(tableName)
            .where(`${tableName}.${relationHasManyModel.options?.relationKey || `${this.model.tableName}Id`}`, e[relationHasManyModel.options?.localKey || 'id'])

          return { ...e, [alias]: b}
        })
      )
    }

    // BelonTo relation
    if (relationBelongToModel !== undefined) {
      const classObject = await this.getQuery()
        .select('*')
        .from(this.model.tableName) as M[]

      return Promise.all(
        classObject.map(async (e) => {
          const b = await this.getQuery()
            .from(alias)
            .where(`${alias}.${relationBelongToModel.options?.relationKey || 'id'}`, e[relationBelongToModel.options?.localKey || `${alias}Id`])
            .first()

          return { ...e, [alias]: b}
        })
      )
    }
  }

  public async preloadFirst (alias: string): Promise<M> {
    this.relationExist(alias)
    const model = await this.preload(alias)
    return model![0]
  }

  public related (modelName: string): Related {
    return new Related(modelName, this)
  }
}