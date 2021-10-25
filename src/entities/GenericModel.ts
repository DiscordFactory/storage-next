import Preload from '../queries/Preload'
import { ObjectResolvable, ResponseResolvable } from '../types'
import Related from '../queries/Related'
import Crud from '../queries/Crud'

export default class GenericModel<M> {
  private crud = new Crud(this, this.$queryBuilder.queryBuilder)
  constructor (fields: ResponseResolvable, private $queryBuilder) {
    Object.entries(fields).forEach(([key, value]) => {
      this[key] = value
    })
  }

  public async preload (alias: string) {
    return await new Preload(this, this.$queryBuilder).preload(alias)
  }

  public related (modelName: string): Related<M> {
    return new Related(modelName, this['id'], this.$queryBuilder)
  }

  public async update (value: ObjectResolvable): Promise<M> {
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