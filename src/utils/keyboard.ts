
export interface CallbackData {
  prefix: string
  action: string
  data: {
    [key: string]: any
  }
}

/**
 * `CallbackDataFactory` helps process, prepare, and parse Inline Keyboard callback data.
 */
export class CallbackDataFactory {
  static items: { [key: string]: string[] } = {}

  prefix: string
  action: string
  parts: string[]

  /**
   * Create new instance of `CallbackDataFactory`.
   */
  constructor(prefix: string, parts: string[]) {
    this.prefix = prefix
    this.parts = parts
  }

  /**
   * Prepare `string` from provided `parts` using callback's prefix.
   */
  prepare(action: string, ...parts: string[]): string {
    if (parts.length !== this.parts.length) throw Error('Invalid count of arguments')

    return this.prefix + ':' + action + ':' + parts.join(':')
  }

  /**
   * Create new `CallbackDataFactory` and register it.
   */
  static new(prefix: string, parts: string[]): CallbackDataFactory {
    const cdf = new CallbackDataFactory(prefix, parts)
    CallbackDataFactory.items[prefix] = parts
    return cdf
  }

  /**
   * Parse callback data from provided `string`.
   */
  static parse(data: string): CallbackData {
    const dataParts = data.split(':')
    const prefix = dataParts[0]
    const action = dataParts[1]
    const parts = CallbackDataFactory.items[prefix]
    if (!parts) throw Error('Undefined prefix')

    const newData = {}
    parts.map((part: string, index: number) => {
      newData[CallbackDataFactory.items[prefix][index]] = dataParts[index + 2]
    })

    const callbackData: CallbackData = {
      prefix,
      action,
      data: newData
    }

    return callbackData
  }

  static filter(prefix: string, action?: string): RegExp {
    const parts = CallbackDataFactory.items[prefix]
    if (!parts) throw Error('Undefined prefix')

    if (action)
      return new RegExp(`^${prefix}:${action}:`)
    else
      return new RegExp(`^${prefix}:`)
  }

  /**
   * Find specific registered `CallbackDataFactory` by prefix.
   */
  static find(prefix: string): CallbackDataFactory {
    const parts = CallbackDataFactory.items[prefix]
    if (!parts) throw Error('Undefined prefix')

    return new CallbackDataFactory(prefix, parts)
  }
}
