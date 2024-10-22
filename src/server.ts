import { runAll } from './utils'
import { base, cr, host, player, test } from './namespaces'
import { getEveryoneOutRoomsInRedis } from './helpers'

runAll(
  // first
  getEveryoneOutRoomsInRedis,
  // middlewares
  base,
  host,
  player,
  test,
  cr,
)

console.log(`------------------------------- \n \n`)
