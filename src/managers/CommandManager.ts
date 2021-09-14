import { Collection } from 'discord.js'
import { CommandEntity } from '../entities/Command'
import path from 'path'
import { fetch } from 'fs-recursive'
import { BaseAddon } from '@discord-factory/core-next'
import Addon from '../index'

export default class CommandManager {
  public commands: Collection<string, CommandEntity> = new Collection()

  constructor (public addon: BaseAddon<Addon>) {
    this.run()
  }

  private async run () {
    const baseDir = path.join(process.cwd(), 'src')

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

        if (res?.default?.type) {
          if (res.default.type === 'basic-command') {
            const item = await import(file.path)
            const Class = new item.default()

            const command = new CommandEntity(
              this.addon,
              Class.label,
              Class.description,
              Class.tag,
              Class.usages,
              Class.alias,
              Class.roles,
              Class.permissions,
              Class.run
            )

            this.commands.set(command.tag, command)
          }
        }
      }))
  }
}