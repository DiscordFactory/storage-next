import path from 'path'
import { fetch } from 'fs-recursive'
import Storage from '../Storage'
import { Collection } from 'discord.js'
import { BaseModel } from '../entities/Model'

export default class ModelManager {
  private static $instance: ModelManager
  public models: Collection<string, { default: typeof BaseModel; instance: BaseModel<typeof BaseModel>; }> = new Collection()

  constructor (public storage: Storage) {
  }

  public static getManager (storage?: Storage) {
    if (!this.$instance && storage) {
      this.$instance = new ModelManager(storage)
    }
    return this.$instance
  }

  public async initialize () {
    const baseDir = path.join(
      process.cwd(),
      process.env.NODE_ENV === 'production'
        ? path.join('build', 'src')
        : 'src'
    )

    const fetchedFiles = await fetch(
      baseDir,
      [process.env.NODE_ENV === 'production' ? 'js' : 'ts'],
      'utf-8',
      ['node_modules', 'test']
    )

    const files = Array.from(fetchedFiles, ([key, file]) => ({ key, ...file }))
    await Promise.all(
      files.map(async (file) => {
        const item = await import(file.path)
        const Class = item.default

        if (!item?.default) {
          return
        }

        if (item.default.fileType === 'model') {
          const model = new Class() as BaseModel<typeof Class>
          model.setContext(this.storage.addon)

          ModelManager.getManager().models.set(model.tableName, {
            default: Class,
            instance: model
          })
        }
      })
    )
  }
}