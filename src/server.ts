import fastify from 'fastify'
import { env } from './env'
import { usersRoutes } from './routes/users'
import cookie from '@fastify/cookie'

import 'dotenv/config'

const server = fastify()

server.get('/hello', async () => {
})

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })

server.register(cookie)

server.register(usersRoutes, {
  prefix: 'users'
})
