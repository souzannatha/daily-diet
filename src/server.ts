import fastify from 'fastify'

const server = fastify()

server.get('/hello', (request, reply) => {
  reply.send('hello world!')
})
server.listen({ port: 3333 }, () => {
  console.log('HTTP Server Running!')
})
