import { QueryBuilder } from '../QueryBuilder'
import { Knex } from 'knex'
import Uuid from '../Uuid'

export default class Related {
  constructor (private relationModelName: string, private queryBuilder: QueryBuilder<unknown>) {
  }

  public async attach (...ids: string[] | number[]) {
    const pivotTableName = [this.queryBuilder.model.tableName, this.relationModelName.slice(0, this.relationModelName.length - 1)]
      .sort()
      .join('_')

    await this.queryBuilder.getQuery()
      .from(pivotTableName)
      .insert(ids.map((id: string | number) => ({
        id: Uuid.generateV4(),
        [`${this.queryBuilder.model.tableName}Id`]: '240561194958716928',
        [`${this.relationModelName.slice(0, this.relationModelName.length - 1)}Id`]: id
      })))
  }
}