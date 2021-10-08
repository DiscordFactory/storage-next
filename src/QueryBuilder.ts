import { CompletModel, KnexClient, ResponseResolvable } from './types'
import { Knex } from 'knex'

export class QueryBuilder<M> {
  constructor (
    public model: M & CompletModel,
    private knexClient: KnexClient
  ) {
  }

  public getQuery (): Knex.QueryBuilder {
    return (this as any).knexClient(this.model.tableName)
  }

  public async lastInsert (count?: number): Promise<ResponseResolvable | ResponseResolvable[]> {
    const inputs = await this.knexClient.raw(`SELECT * FROM ${this.model.tableName} ORDER BY rowid DESC LIMIT ${count || 1};`)
    return inputs.length === 1
      ? inputs[0] as Promise<ResponseResolvable>
      : inputs.reverse() as unknown as Promise<ResponseResolvable[]>
  }
}