export default class Relation<Model> {
  constructor (abstractModel: Model) {
    console.log('sbstract', abstractModel)
  }

  public hasMany (relationName: string) {
  }
}

