import { ObjectResolvable } from '../types'
import QueryBuilder from '../QueryBuilder'

export default class GenericModel<Model> {
  constructor (fields: ObjectResolvable, private $queryBuilder: QueryBuilder<Model>) {
    this._patch(fields)
  }

  private _patch (fields: ObjectResolvable) {
    Object.entries(fields).forEach(([key, value]) => {
      this[key] = value
    })
  }

  public async update (data: ObjectResolvable) {
    const response = await this.$queryBuilder.getQuery()
      .where({ id: this['id'] })
      .update(data)

    this._patch(data)
    return { $persisted: response === 1 }
  }

  public async delete () {
    const response = await this.$queryBuilder.getQuery()
      .where({ id: this['id'] })
      .delete()

    return { $deleted: response === 1 }
  }
}