import fastify from 'fastify'
import { env } from './env'
import { usersRoutes } from './routes/users'
import cookie from '@fastify/cookie'

import 'dotenv/config'
import { mealsRoutes } from './routes/meals'

const server = fastify()

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

server.register(mealsRoutes, {
  prefix: 'meals'
})
