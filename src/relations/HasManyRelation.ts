import { BaseModel } from '../entities/Model'
import QueryBuilder from '../QueryBuilder'

export default class HasManyRelation<Model> {
  constructor (private model: BaseModel<Model>, private relation: any) {
  }

  private getLocalQueryBuilder () {
    return new QueryBuilder(this.relation, this.model.$databaseClient!)
  }

  public async create () {
  }
}