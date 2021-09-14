import { PermissionResolvable } from 'discord.js'

export type CommandContext = {
  label: string
  description: string
  tag: string
  usages?: Array<string>
  alias?: Array<string>
  roles?: Array<string>
  permissions?: Array<PermissionResolvable>
}