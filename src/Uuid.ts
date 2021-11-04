import { parse, stringify, v1, v3, v4, v5, validate, version } from 'uuid'
import { InputBuffer, OutputBuffer } from './types'

export default class Uuid {
  public static generateV1 () {
    return v1()
  }

  public static generateV3 (name: string | InputBuffer, namespace: string | InputBuffer, buffer: OutputBuffer, offset?: number | undefined) {
    return v3(name, namespace, buffer, offset)
  }

  public static generateV4 () {
    return v4()
  }

  public static generateV5 (name: string | InputBuffer, namespace: string | InputBuffer, buffer: OutputBuffer, offset?: number | undefined) {
    return v5(name, namespace, buffer, offset)
  }

  public static parse (uuid: string) {
    return parse(uuid)
  }

  public static stringify (buffer: InputBuffer, offset?: number | undefined) {
    return stringify(buffer, offset)
  }

  public static version (uuid: string) {
    return version(uuid)
  }

  public static validate (uuid: string) {
    return validate(uuid)
  }
}