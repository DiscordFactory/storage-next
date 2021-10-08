import { ObjectResolvable, ResponseResolvable, TypeResolvable } from '../types'
import GenericModel from '../entities/GenericModel'
import { QueryBuilder } from '../QueryBuilder'

export default class Crud<M> {
  constructor (private genericModel: GenericModel<M>, private queryBuilder: QueryBuilder<M>) {
  }

  public async findAll (): Promise<M[]> {
    return this.queryBuilder.getQuery()
  }

  public async find (value: TypeResolvable): Promise<M> {
    const response = await this.queryBuilder.getQuery()
      .where({ id: value })
      .first()

    return new GenericModel(response, this) as unknown as M
  }

  public async findBy (column: string, value: TypeResolvable): Promise<M> {
    const response = await this.queryBuilder.getQuery()
      .where({ [column]: value })
      .first()

    return new GenericModel(response, this) as unknown as M
  }

  public async create (data: ObjectResolvable): Promise<M> {
    await this.queryBuilder.getQuery().insert(data)

    const response = await this.queryBuilder.lastInsert() as { [K: string]: any }
    return new GenericModel(response, this) as unknown as M
  }

  public async createMany (data: ObjectResolvable[]): Promise<M[]> {
    await this.queryBuilder.getQuery().insert(data)
    const response = await this.queryBuilder.lastInsert(data.length) as ResponseResolvable[]
    return response.map((response: ResponseResolvable) => (
      new GenericModel(response, this)
    )) as unknown as M[]
  }

  public async update (data: ObjectResolvable): Promise<void> {
    return this.queryBuilder.getQuery()
      .where({ id: this.genericModel['id'] })
      .update(data)
  }

  public async delete () {
    return this.queryBuilder.getQuery()
      .where({ id: this.genericModel['id'] })
      .delete()
  }
}