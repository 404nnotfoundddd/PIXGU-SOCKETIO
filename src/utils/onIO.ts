import { z, ZodSchema } from 'zod'
import type { SocketAll } from '../types'
import { logErr } from './logErr'

/**
 * onIO is a utility to handle input from socket.io
 *
 *  @example
 *  onIO.input(z.string()).on(io, 'connection', (input) => {
 *    console.log(input) // input is inferred as string
 *  })
 *
 */
export const onIO: onIO = {
  data: {
    schema: z.any(),
  },

  input: function <T extends ZodSchema>(schema: T) {
    this.data.schema = schema
    return this as unknown as onIOWithSchema<T>
  },

  on: function <T extends ZodSchema>(
    io: IO,
    ev: string,
    cb: (input: z.infer<T>) => void,
  ) {
    io.on(ev, (input: unknown) => {
      try {
        const validatedInput = this.data.schema.parse(input)
        cb(validatedInput)
      } catch (e) {
        logErr(`invalid input recevied at ${ev}`, e as Error)
        return
      }
    })
  },
}

type IO = SocketAll

type onIO = {
  data: {
    schema: ZodSchema
  }
  input: <T extends ZodSchema>(schema: T) => onIOWithSchema<T>
  on: <T extends ZodSchema>(
    io: IO,
    ev: string,
    cb: (input: z.infer<T>) => void,
  ) => void
}

type onIOWithSchema<T extends ZodSchema> = {
  data: {
    schema: T
  }
  on: (io: IO, ev: string, cb: (input: z.infer<T>) => void) => void
}
