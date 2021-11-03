import RelatedHasMany from '../queries/RelatedHasMany'
import GenericModel from './GenericModel'

export default class Relation<M> {
  constructor (public model: GenericModel<M>) {
  }

  /**
   * @description Access point to methods linked to a relationship
   * @param {string} relationName
   * @return Promise
   */
  public hasMany (relationName: string): RelatedHasMany<M> {
    return new RelatedHasMany<M>(relationName, this.model['id'], this.model.$queryBuilder.queryBuilder)
  }

  /**
   * @description Access point to methods linked to a relationship
   * @param {string} relationName
   * @return Promise
   */
  public hasOne (relationName: string): RelatedHasMany<M> {
    return '' as any
  }

  /**
   * @description Access point to methods linked to a relationship
   * @param {string} relationName
   * @return Promise
   */
  public belongTo (relationName: string): RelatedHasMany<M> {
    return '' as any
  }
}