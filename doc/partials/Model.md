```ts
import { Model, BaseModel, Uuid } from '@discord-factory/storage-next'

@Model('foo')
export default class FooModel extends BaseModel {
  public id: string
  public isAdmin: boolean
  
  public static beforeInsert (model: FooModel) {
    model.id = Uuid.generateV4()
  }
}
```