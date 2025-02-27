import { Server, type ServerOptions } from 'socket.io'
import { createServer } from 'node:http'
import { VERSION } from './constants'
import express from 'express'
import { env } from './env'
import chalk from 'chalk'

const log = console.log
const port = parseInt(env.PORT)
const app = express()
const server = createServer(app)
const serverOptions: Partial<ServerOptions> = {
  /* options here */

  cors: {
    origin: env.ORIGINS.split(','),
    credentials: true,
  },
}

log(
  `${chalk.magentaBright.bold(
    JSON.stringify(
      {
        socketio: serverOptions,
        env: env,
        port: port,
        version: VERSION,
      },
      null,
      2,
    ),
  )}`
)

export const io = new Server(server, serverOptions)

log(`${chalk.yellowBright(`\n Listening on port ${port}`)} ⚡️`)
io.listen(port)

io.engine.on('connection_error', (err) => {
  console.log('io.engine.on connection_error: ', err)
})
