import fastify from 'fastify'
import { env } from './env'
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
