import { Message, PermissionResolvable } from 'discord.js'
import { CommandContext } from '../types'
import { BaseAddon } from '@discord-factory/core-next'
import Addon from '../index'

export class CommandEntity {
  public static type: string = 'basic-command'

  constructor (
    public addon: BaseAddon<Addon>,
    public label: string,
    public description: string,
    public tag: string,
    public usages: Array<string> = [],
    public alias: Array<string> = [],
    public roles: Array<string> = [],
    public permissions: Array<PermissionResolvable> = [],
    public run: (message: Message, args: string[]) => Promise<void>,
  ) {
  }
}

export function Command (context: CommandContext) {
  return (target: Function) => {
    return class Command extends CommandEntity {
      constructor (addon: BaseAddon<Addon>) {
        super(
          addon,
          context.label,
          context.description,
          context.tag,
          context.usages || [],
          context.alias || [],
          context.roles || [],
          context.permissions || [],
          target.prototype.run,
        )
      }
    } as any
  }
}

export abstract class BaseCommand {
  public addon: BaseAddon<Addon> | undefined
  public abstract run (message: Message, args: string[]): Promise<void>
}