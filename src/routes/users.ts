import { FastifyInstance } from "fastify";
import { knex } from "../database";
import z from 'zod'
import { randomUUID } from "node:crypto";

export function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {

    const createUsersBodySchema = z.object({
      name: z.string(),
      email: z.email()
    })

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    const { email, name } = createUsersBodySchema.parse(request.body)

    const userByEmail = await knex('users').where({ email }).first()

    if (userByEmail) {
      return reply.status(400).send({ message: 'User already exists' })
    }

    await knex('users').insert({
      id: randomUUID(), email, name, session_id: sessionId
    })
    return reply.status(201).send()
  })
}
