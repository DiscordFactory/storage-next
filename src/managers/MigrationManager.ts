import { MigrationEntity } from '../entities/Migration'
import path from 'path'
import { fetch } from 'fs-recursive'
import Storage from '../Storage'

export default class MigrationManager {
  public migrations: MigrationEntity[] = []

  constructor (public storage: Storage) {
  }

  public async initialize () {
    const baseDir = path.join(process.cwd(), process.env.NODE_ENV === 'production'
      ? path.join('build', 'src')
      : 'src')

    const fetchedFiles = await fetch(
      baseDir,
      [process.env.NODE_ENV === 'production' ? 'js' : 'ts'],
      'utf-8',
      ['node_modules', 'test']
    )

    const files = Array.from(fetchedFiles, ([key, file]) => ({ key, ...file }))
    await Promise.all(
      files.map(async (file) => {
        const res = await import(file.path)

        if (res?.default?.fileType) {
          if (res.default.fileType === 'migration') {
            const item = await import(file.path)
            const Class = new item.default()

            const migration = new MigrationEntity(
              this.storage.addon,
              Class.tableName,
              Class.up,
              Class.down,
            )

            this.migrations.push(migration)
          }
        }
      }))
  }
}