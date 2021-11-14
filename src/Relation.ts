import { BaseModel } from './entities/Model'
import { Collection } from 'discord.js'
import HasManyRelation from './relations/HasManyRelation'

export default class Relation<Model> {
  public hasManyCollection: Collection<string, any> = new Collection()

  constructor (private model: BaseModel<Model>) {
    const relations = (model as any).relations
    if (!relations) {
      return
    }

    if (relations.hasMany) {
      Array.from(relations.hasMany).forEach(([relationName, relation]: any) => {
        this.hasManyCollection.set(relationName, relation)
      })
    }

  }

  public hasMany (relationName: string) {
    const relation = this.hasManyCollection.get(relationName)
    return new HasManyRelation(this.model, relation)
  }
}

