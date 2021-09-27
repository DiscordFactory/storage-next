# 📦 Storage-next

When you create a discord bot, you often have to persist data in order not to lose them after a restart or a problem with your bot.
In order to answer this need, [Discord Factory](https://github.com/DiscordFactory) provides a new generation module allowing you to easily interact with your favorite database thanks to the ORM [Knex](https://knexjs.org).

## Getting started
First, you need to import the module with the following command :

With NPM
```
npm install @discord-factory/storage-next@lasted
```

With YARN
```
yarn add @discord-factory/storage-next@lasted
```

## How to use
The `@discord-factory/storage-next` module provides you with 2 commands allowing you to instantly create a template and a migration :

Make model
```
npm run make:model MyModel
yarn make:model MyModel
```
Make migration
```
npm run make:migration MyMigration
yarn make:migration MyMigration
```

### How does the module work ?
As a developer, you need to separate your application into several levels.
When using a database, you will need to define a model and migration to interoperate with your database.

A problem that comes up quite often is "how to automatically create a database with predefined tables".
This problem is solved by migrations.

A `migration` is a file that interacts with the database in order to create, alter or delete tables or columns within it.

A migration can be managed through the following command and will have a minimal structure as shown below :
```bash
npm run make:migration Folder/SubFolder/Foo
# or
yarn make:migration Folder/SubFolder/Foo
```

```ts
import { Migration, BaseMigration, Schema, Table } from '@discord-factory/storage-next'

@Migration()
export default class Foo_1631887311895 extends BaseMigration {
  /**
   * The `tableName` variable represents the name of your database table,
   * it must be unique and by convention,
   * must be in lower case.
   */
  public tableName = 'foo'

  /**
   * The `up` function is responsible
   * for sending the table named by the `tableName` variable to the database
   */
  public async up (schema: Schema): Promise<any> {
    
    /**
     * The variable `table` represents your table in the database.
     * You can add columns to it by choosing the type and/or options of the columns.
     */
    return schema.createTable(this.tableName, (table: Table) => {
      table.string('id').primary()
    })
  }
  
  /**
   * The `up` function is responsible for deleting the table
   * named by the `tableName` variable within the database.
   */
  public async down (schema: Schema): Promise<any> {
    return schema.dropTableIfExists(this.tableName)
  }
}
```
In order to insert the tables defined in your migrations,
you will need to run the command below in a terminal at the root of your application.
```bash
npm run migration:run
# or
yarn migration:run
```
You can delete them from your database with the following command
```bash
npm run migration:rollback
# or
yarn migration:rollback
```

The `model` is a file that allows you to interact with the table defined in it.
You must define in it all the properties that will represent the columns in your table, database.

A model can be managed through the following command and will have a minimal structure as shown below :

A migration can be managed through the following command and will have a minimal structure as shown below :
```bash
npm run make:model Folder/SubFolder/Foo
# or
yarn make:model Folder/SubFolder/Foo
```

```ts
import { Model, BaseModel, Uuid } from '@discord-factory/storage-next'

@Model('foo')
export default class Foo extends BaseModel {
  /**
   * The `myString` property of type string indicates that a column named `myString` exists
   * in the table named foo (defined in the model decorator) and is of type varchar.
   */
  public myString: string
  public myNumber: number
  public myBoolean boolean
}
```
The properties defined in your model should represent your columns in your database table.

As SQLite does not support auto-incrementing, it is recommended that you insert it "by default" in each of your queries to create a new database resource.

In order to solve this problem, the `@discord-factory/storage-next` module provides you with two hooks, one allowing data alteration during an insertion and the other during an update of a resource.
```ts
import { Model, BaseModel, Uuid } from '@discord-factory/storage-next'

@Model('foo')
export default class Foo extends BaseModel {
  public id: string
  public firstname: string

  // Called when Foo is used to craete ressource
  public static beforeInsert (model: Foo) {
    model.id = Uuid.generateV4()
  }
  
  // Called when Foo is used to update one ressource
  public static beforeSave (model: Foo) {
    model.firstname = `${model.firstname} Doe`
  }
}
```

## Examples
Considering the following migration and model

```ts
import { Migration, BaseMigration, Schema, Table } from '@discord-factory/storage-next'

@Migration()
export default class User_1631887311895 extends BaseMigration {
  public tableName = 'user'
  
  public async up (schema: Schema): Promise<any> {
    return schema.createTable(this.tableName, (table: Table) => {
      table.string('id').primary()
      table.string('firstname')
      table.string('lastname')
    })
  }
  
  public async down (schema: Schema): Promise<any> {
    return schema.dropTableIfExists(this.tableName)
  }
}
```
```ts
import { Model, BaseModel, Uuid } from '@discord-factory/storage-next'

@Model('user')
export default class User extends BaseModel {
  public id: string
  public firstname: string
  
  public static beforeInsert (model: Foo) {
    model.id = Uuid.generateV4()
  }
}
```

### Get one resource
```ts
const user = await User.query().find('0ab2a318-d1b0-4c1e-a7d1-31b42b2153cd') as User
console.log(user)
```
```
console.log({
  id: '0ab2a318-d1b0-4c1e-a7d1-31b42b2153cd',
  firstname: 'John',
  lastname: 'Doe'
})
```

### Get one resource by column
```ts
const user = await User.query().findBy('id', '0ab2a318-d1b0-4c1e-a7d1-31b42b2153cd') as User
console.log(user)
```
```
console.log({
  id: '0ab2a318-d1b0-4c1e-a7d1-31b42b2153cd',
  firstname: 'John',
  lastname: 'Doe'
})
```

### Create one resource
```ts
const data = {
  firstname: 'John',
  lastname: 'Doe',
}

const user = await User.query().create(data) as User 👈 // You should to define type if you want auto-complétion
console.log(user)
```
```
console.log({
  id: '0ab2a318-d1b0-4c1e-a7d1-31b42b2153cd',
  firstname: 'John',
  lastname: 'Doe'
})
```

### Create many resource
```ts
const data = [
  { firstname: 'John', lastname: 'Doe' },
  { firstname: 'Sarah', lastname: 'Doe' }
]

const users = await User.query().createMany(data) as User[] 👈 // You should to define type if you want auto-complétion
console.log(users)
```
```
console.log([
  {
    id: '0ab2a318-d1b0-4c1e-a7d1-31b42b2153cd',
    firstname: 'John',
    lastname: 'Doe'
  },
  {
    id: '0ab2a318-d1b0-4c1e-a7d1-31b42b2153fe',
    firstname: 'Sarah',
    lastname: 'Doe'
  }
])
```

### Update one resource
```ts
const data = {
  firstname: 'John',
  lastname: 'Doe',
}

const selector = {
  id: '0ab2a318-d1b0-4c1e-a7d1-31b42b2153cd'
}

const user = await User.query().updateWhere(data, selector) as User 👈 // You should to define type if you want auto-complétion
console.log(user)
```
```
console.log({
  id: '0ab2a318-d1b0-4c1e-a7d1-31b42b2153cd',
  firstname: 'John',
  lastname: 'Doe'
})
```

### Delete one resource
```ts
const selector = {
  id: '0ab2a318-d1b0-4c1e-a7d1-31b42b2153cd'
}

await User.query().delete(selector)
```

## License

[MIT](./LICENSE) License © 2021 [Baptiste Parmantier](https://github.com/LeadcodeDev)
