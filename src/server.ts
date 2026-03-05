import fastify from 'fastify'
import { knex } from './database'

const server = fastify()

server.get('/hello', async () => {

})

server.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server Runing!')
})
