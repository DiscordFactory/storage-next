import GenericModel from '../entities/GenericModel'
import { QueryBuilder } from '../QueryBuilder'

export default class Preload<M> {
  constructor (private genericModel: GenericModel<M>, private $queryBuilder: QueryBuilder<M>) {
  }

  private serializePivotTableName (alias: string) {
    const modelName = this.$queryBuilder.model.tableName
    const relationModelName = alias.slice(0, alias.length - 1)
    return {
      modelName,
      relationModelName,
      pivotTableName: [modelName, relationModelName].sort().join('_')
    }
  }

  private relationExist (alias: string) {
    const relationHasManyModel = this.$queryBuilder.model.relations.hasMany?.get(alias)
    const relationBelongToModel = this.$queryBuilder.model.relations.belongTo?.get(alias)
    const relationManyToManyModel = this.$queryBuilder.model.relations.manyToMany?.get(alias)

    const hasRelationResolvable = relationHasManyModel === undefined
      && relationBelongToModel === undefined
      && relationManyToManyModel === undefined

    if (hasRelationResolvable) {
      throw new Error(`No relationship exists under the name "${alias}"`)
    }

    return {
      relationHasManyModel,
      relationBelongToModel,
      relationManyToManyModel
    }
  }

  public async preload (alias: string) {
    const { relationHasManyModel, relationBelongToModel, relationManyToManyModel } = this.relationExist(alias)
    const { modelName, pivotTableName } = this.serializePivotTableName(alias)
    const model: string = (relationHasManyModel!.model as unknown as { tableName: string }).tableName

    // HasMany relation
    if (relationHasManyModel !== undefined) {
      const classObject = await this.$queryBuilder.getQuery()
        .select('*')
        .from(this.$queryBuilder.model.tableName)
        .first() as M

      const columnRelationKey = `${relationHasManyModel.options?.relationKey || `${this.$queryBuilder.model.tableName}Id`}`
      const b = await this.$queryBuilder.getQuery()
        .from(model)
        .where(columnRelationKey, classObject[relationHasManyModel.options?.localKey || 'id'])

      b.forEach((role) => {
        delete role[columnRelationKey]
      })

      return new GenericModel({ ...classObject, [alias]: b }, this.$queryBuilder)
    }

    // BelonTo relation
    if (relationBelongToModel !== undefined) {
      const classObject = await this.$queryBuilder.getQuery()
        .select('*')
        .from(this.$queryBuilder.model.tableName) as M[]

      return Promise.all(
        classObject.map(async (abstractModel: M) => {
          const b = await this.$queryBuilder.getQuery()
            .from(alias)
            .where(`${alias}.${relationBelongToModel.options?.relationKey || 'id'}`, abstractModel[relationBelongToModel.options?.localKey || `${alias}Id`])
            .first()

          return new GenericModel({ ...abstractModel, [alias]: b}, this.$queryBuilder)
        })
      )
    }

    // ManyToMany relation
    if (relationManyToManyModel !== undefined) {
      const classObject = await this.$queryBuilder.getQuery()
        .select('*')
        .where({ id: this.genericModel['id'] })
        .first()

      const pivots = await this.$queryBuilder.getQuery()
        .from(pivotTableName)
        .where({ [`${modelName}Id`]: this.genericModel['id'] })

      return new GenericModel({ ...classObject, [alias]: pivots }, this.$queryBuilder)
    }
  }
}