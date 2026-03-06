import { FastifyInstance } from "fastify";
import z, { boolean, string } from 'zod'
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export function mealsRoutes(app: FastifyInstance) {
  app.post('/', {
    preHandler: [checkSessionIdExists],
  },
    async (request, reply) => {
      const createMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        is_on_diet: z.boolean(),
        date: z.coerce.date()
      })

      let { sessionId } = request.cookies

      const { name, description, is_on_diet, date } = createMealsBodySchema.parse(request.body)
      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        return reply.status(400).send({ message: "User Not Found" })
      }

      await knex('meals').insert({ id: randomUUID(), user_id: user.id, name, description, is_on_diet, date, })
      return reply.status(201).send()
    })
}
