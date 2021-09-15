import { Knex } from 'knex'
import SchemaBuilder = Knex.SchemaBuilder
import CreateTableBuilder = Knex.CreateTableBuilder

export type driverType = 'sqlite3' | 'mariadb'

export interface Table extends CreateTableBuilder {

}

export interface Schema {
  createTable (tableName: string, callback: (table: Table) => void): void
  dropTableIfExists (tableName: string): SchemaBuilder | undefined
}

export interface KnexClient {
  schema: SchemaBuilder
}