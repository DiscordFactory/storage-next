import { QueryBuilder } from '../QueryBuilder'
import Uuid from '../Uuid'

export default class Related {
  constructor (private relationModelName: string, private queryBuilder: QueryBuilder<unknown>) {
  }

  private serializePivotTableName () {
    const modelName = this.queryBuilder.model.tableName
    const relationModelName = this.relationModelName.slice(0, this.relationModelName.length - 1)
    return {
      modelName,
      relationModelName,
      pivotTableName: [modelName, relationModelName].sort().join('_')
    }
  }

  public async attach (ids: string[] | number[]): Promise<void> {
    const { relationModelName, pivotTableName } = this.serializePivotTableName()

    await this.queryBuilder.getQuery()
      .from(pivotTableName)
      .insert(ids.map((id: string | number) => ({
        id: Uuid.generateV4(),
        [`${this.queryBuilder.model.tableName}Id`]: '240561194958716928',
        [`${relationModelName}Id`]: id
      })))
  }

  public async detach (ids: string[] | number[]): Promise<void> {
    const { relationModelName, pivotTableName } = this.serializePivotTableName()
    await Promise.all(
      ids.map(async (id: string | number) => {
        await this.queryBuilder.getQuery()
          .from(pivotTableName)
          .where({ [`${relationModelName}Id`]: id })
          .delete()
      })
    )
  }
}