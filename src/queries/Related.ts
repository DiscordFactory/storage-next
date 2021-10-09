import { QueryBuilder } from '../QueryBuilder'
import Uuid from '../Uuid'
import { ResponseResolvable } from '../types'

export default class Related<M> {
  constructor (private relationModelName: string, private id: string | number, private $queryBuilder: QueryBuilder<unknown>) {
  }

  private serializePivotTableName () {
    const modelName = this.$queryBuilder.model.tableName
    const relationModelName = this.relationModelName.slice(0, this.relationModelName.length - 1)
    return {
      modelName,
      relationModelName,
      pivotTableName: [modelName, relationModelName].sort().join('_')
    }
  }

  public async attach (ids: (string | number)[]): Promise<void> {
    const { relationModelName, pivotTableName } = this.serializePivotTableName()

    await Promise.all(
      ids.map(async (id) => {
        const existRelation = await this.$queryBuilder.getQuery()
          .from(relationModelName)
          .where({ id })

        if (Array.isArray(existRelation) && existRelation.length) {
          return this.$queryBuilder.getQuery()
            .from(pivotTableName)
            .insert({
              id: Uuid.generateV4(),
              [`${this.$queryBuilder.model.tableName}Id`]: this.id,
              [`${relationModelName}Id`]: id
            })
        }
      })
    )
  }

  public async detach (ids: (string | number)[]): Promise<void> {
    const { relationModelName, pivotTableName } = this.serializePivotTableName()
    await Promise.all(
      ids.map(async (id: string | number) => {
        await this.$queryBuilder.getQuery()
          .from(pivotTableName)
          .where({ [`${relationModelName}Id`]: id })
          .delete()
      })
    )
  }

  public async synchronize (ids: (string | number)[]) {
    const { relationModelName, modelName, pivotTableName } = this.serializePivotTableName()
    const trueRelations = await this.relationExist([...ids], pivotTableName, relationModelName)

    // Diff database -> ids (create)
    await this.syncDestroy(
      ids.slice(),
      trueRelations
        .filter((a) => a)
        .map((response: ResponseResolvable) => response[`${relationModelName}Id`])
    )

    // Diff ids -> database (delete)
    const pivots = await this.$queryBuilder.getQuery()
      .from(pivotTableName)
      .where({ [`${modelName}Id`]: this.id }) as (string | number)[]

    await this.syncCreate(
      ids.slice(),
      pivots.map((pivot) => pivot[`${relationModelName}Id`])
    )
  }

  private relationExist (ids, pivotTableName, relationModelName) {
    return Promise.all(
      ids.map(async (id: string | number) => {
        return this.$queryBuilder.getQuery()
          .select('*')
          .from(pivotTableName)
          .where({ [`${relationModelName}Id`]: id })
          .first()
      })
    ) as Promise<ResponseResolvable[]>
  }

  private async syncDestroy (ids, currentPivotIds) {
    currentPivotIds.forEach((id: string | number) => {
      if (ids.includes(id)) {
        const index = ids.indexOf(id)
        ids.splice(index, 1)
      }
    })

    await this.attach(ids)
  }



  private async syncCreate (ids: (string | number)[], pivotRelationIds: (string | number)[]) {
    const trashcan: (string | number)[] = []
    pivotRelationIds.forEach((id: string | number) => {
      if (!ids.includes(id)) {
        trashcan.push(id)
      }
    })

    await this.detach(trashcan)
  }
}