import { BaseCli, CLI, CliContextRuntime } from '@discord-factory/core-next'
import Addon from '../index'
import path from 'path'
import fs from 'fs'
import Logger from '@leadcodedev/logger'

@CLI({
  prefix: 'make:migration',
  description: 'Run migrations',
  args: ['filename'],
  config: {
    allowUnknownOptions: false,
    ignoreOptionDefaultValue: false
  }
})
export default class MakeMigration extends BaseCli<Addon> {
  public async run ({ args }: CliContextRuntime): Promise<void> {
    const location = path.parse(args.filename as string)
    const targetFile = path.join(process.cwd(), 'src', location.dir, `${location.name}_${Date.now()}.ts`)

    const templateFile = await fs.promises.readFile(
      path.join(__dirname, '..', '..', 'src', 'templates', 'Migration.txt'),
      { encoding: 'utf-8' }) as unknown as string

    const filenameUpper = location.name.charAt(0).toUpperCase() + location.name.slice(1)

    try {
      await fs.promises.mkdir(path.join(process.cwd(), 'src', location.dir), { recursive: true })
      const fileData = templateFile
        .replace(/\$migrationName/g, `${filenameUpper}_${Date.now()}`)
        .replace(/\$tableName/g, filenameUpper.toLowerCase() + 's')

      await fs.promises.writeFile(targetFile, fileData)
      Logger.send('info', `File was created in ${targetFile.replace(/\\/g, '\\\\')}`)
    } catch (e) {
      console.log(e)
    }
  }
}