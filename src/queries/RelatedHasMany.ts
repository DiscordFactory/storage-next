import { QueryBuilder } from '../QueryBuilder'
import { ObjectResolvable } from '../types'
import GenericModel from '../entities/GenericModel'

export default class RelatedHasMany<M> {
  constructor (private relationModelName: string, public id: string | number, private $queryBuilder: QueryBuilder<unknown>) {
  }

  public async create (data: ObjectResolvable) {
    const relatedModel = this.$queryBuilder.model.relations.hasMany?.get(this.relationModelName)

    if (!relatedModel) {
      throw new Error(`No relationship exists under the name "${this.relationModelName}"`)
    }

    const relationModelName = this.relationModelName.slice(0, this.relationModelName.length - 1)
    const columnRelationKey = `${relatedModel?.options?.relationKey || `${this.$queryBuilder.model.tableName}Id`}`

    if (relatedModel.model['beforeInsert']) {
      relatedModel.model['beforeInsert'](data)
    }

    await this.$queryBuilder.getQuery()
      .from(relationModelName)
      .insert({
        ...data,
        [columnRelationKey]: this.id
      })

    const response = await this.$queryBuilder.lastInsert(undefined, relationModelName) as { [K: string]: any }
    delete response[columnRelationKey]

    return new GenericModel(response, this) as unknown as M
  }
}