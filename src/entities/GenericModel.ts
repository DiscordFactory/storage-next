import Preload from '../queries/Preload'
import { ObjectResolvable, ResponseResolvable } from '../types'
import Crud from '../queries/Crud'
import Relation from './Relation'

export default class GenericModel<M> {
  public relation: Relation<M> = new Relation(this)
  private crud = new Crud(this, this.$queryBuilder.queryBuilder)
  constructor (fields: ResponseResolvable, public $queryBuilder) {
    Object.entries(fields).forEach(([key, value]) => {
      this[key] = value
    })
  }

  public async preload (alias: string) {
    return new Preload(this, this.$queryBuilder.queryBuilder).preload(alias)
  }

  public async update (value: ObjectResolvable): Promise<M | undefined> {
    if (this['beforeSave']) {
      this['beforeSave'](value)
    }

    await this.crud.update(value)
    const response = await this.$queryBuilder.getQuery()
      .where(value)
      .first() as unknown as ResponseResolvable

    return new GenericModel(response, this) as unknown as M
  }

  public async delete (): Promise<void> {
    await this.crud.delete()
  }
}