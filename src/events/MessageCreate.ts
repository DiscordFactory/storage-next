import { Event, BaseAddonEvent } from '@discord-factory/core-next'
import { Message } from 'discord.js'
import Addon from '../index'

@Event('messageCreate')
export default class MessageCreate extends BaseAddonEvent<Addon> {
  public async run (message: Message): Promise<void> {
    await this.context?.addon.guard.protect(message)
  }
}