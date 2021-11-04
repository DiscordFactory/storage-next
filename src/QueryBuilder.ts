import { KnexClient, ObjectResolvable, ResponseResolvable } from './types'
import { Knex } from 'knex'
import ModelManager from './managers/ModelManager'

export default class QueryBuilder<M> {
  constructor (
    public modelName: string,
    private knexClient: KnexClient
  ) {
  }

  public getQuery (): Knex.QueryBuilder {
    return (this as any).knexClient(this.modelName)
  }

  public async lastInsert (count?: number, modelName?: string): Promise<ResponseResolvable | ResponseResolvable[]> {
    const inputs = await this.knexClient.raw(`SELECT * FROM ${modelName || this.modelName} ORDER BY rowid DESC LIMIT ${count || 1};`)
    return inputs.length === 1
      ? inputs[0] as Promise<ResponseResolvable>
      : inputs.reverse() as unknown as Promise<ResponseResolvable[]>
  }

  public beforeCreate (modelName: string, data: ObjectResolvable) {
    const manager = ModelManager.getManager()
    const model = manager.models.get(`${modelName}s`)

    if (model?.instance['beforeCreate']) {
      model?.instance['beforeCreate'](data)
    }
  }
}