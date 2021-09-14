import { GuildMember, Message, PermissionResolvable } from 'discord.js'
import { NodeEmitter } from '@discord-factory/core-next'
import Addon from './index'
import CommandContext from './CommandContext'

export default class Guard {
  constructor (public addon: Addon) {
  }

  /**
   * Performs recurring checks before an order is executed.
   * Calls on the middleware assigned to the command used
   * to authorise or not the execution of the command.
   * @param message Message
   */
  public async protect (message: Message) {
    const sender: GuildMember | null = message.member
    const args: string[] = message.content.split(' ')

    /**
     * If the author of the message is a bot,
     * we stop the process
     */
    if (message.author.bot) {
      return
    }

    /**
     * We check the presence of a token within
     * the application environment else cancel process
     */
    const prefix = this.addon.context.getModuleEnvironment(this.addon.addonName, 'APP_PREFIX')

    if (!prefix) {
      throw new Error('The prefix cannot be found, please define it in your environment file')
    }

    /**
     * Checks that the content of the message
     * starts with the prefix, if not, the process is stopped
     */
    if (!message.content.startsWith(prefix)) {
      /**
       * Emission of the event when
       * the message received is not a command
       */
      return NodeEmitter.emit(
        `${this.addon.addonName}::message::received`,
        message,
      )
    }

    /**
     * Configuration of the context to be passed
     * to the control entity
     */
    const alias: string = args[0].trim().toLowerCase().replace(prefix, '')
    const commands = this.addon.commandManager.commands
    const command = commands.get(alias)

    if (command) {
      const commandContext = new CommandContext(sender, args.slice(1), message, command)

      await this.checkPermission(commandContext)
      await this.checkRole(commandContext)

      if (commandContext.isCancelled()) {
        return NodeEmitter.emit(
          `${this.addon.addonName}::command::cancelled`,
          commandContext,
        )
      }

      /**
       * Emit successfully running
       * command event from core.
       */
      await command?.run(message, args.slice(1))

      NodeEmitter.emit(
        `${this.addon.addonName}::message::executed`,
        commandContext,
      )

      const commandAutoRemove = this.addon.context.getModuleEnvironment(this.addon.addonName, 'COMMAND_AUTO_REMOVE')
      if (commandAutoRemove) {
        await message.delete()
      }
    }
  }

  public async checkRole (context: CommandContext): Promise<any> {
    const { sender, command, message } = context
    if (command.roles?.length) {
      const hasRole = (sender: GuildMember | null, roles: Array<string>) => {
        if (!sender) {
          return false
        }

        return roles.some((role: string) => {
          return sender.roles.cache.has(role)
        })
      }

      if (!hasRole(sender, command.roles)) {
        context.setCancelled(true)

        const commandMissingRole = this.addon.context.getModuleEnvironment(this.addon.addonName, 'COMMAND_MISSING_ROLES')
        console.log(commandMissingRole)
        return await message.reply({
          content: commandMissingRole || 'You are not allowed to execute this command.'
        })
      }
    }
  }

  public async checkPermission (context: CommandContext): Promise<any> {
    const { sender, command, message } = context
    if (command.permissions?.length) {
      const hasPermissions = (sender: GuildMember | null, permissions: PermissionResolvable[]) => {
        if (!sender) {
          return false
        }

        return permissions.some((permission: PermissionResolvable) => {
          return sender.permissions.has(permission)
        })
      }

      if (!hasPermissions(sender, command.permissions)) {
        context.setCancelled(true)

        const commandMissingPermission = this.addon.context.getModuleEnvironment(this.addon.addonName, 'COMMAND_MISSING_PERMISSION')
        return await message.reply(
          commandMissingPermission
          || 'You are not allowed to execute this command.')
      }
    }
  }
}