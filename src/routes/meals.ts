import { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        is_on_diet: z.boolean(),
        date: z.string(),
      })

      const { sessionId } = request.cookies

      const {
        name,
        description,
        is_on_diet: isOnDiet,
        date,
      } = createMealsBodySchema.parse(request.body)
      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        return reply.status(400).send({ message: 'User Not Found' })
      }

      await knex('meals').insert({
        id: randomUUID(),
        user_id: user.id,
        name,
        description,
        is_on_diet: isOnDiet,
        date,
      })
      return reply.status(201).send()
    },
  )

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        return reply.status(400).send({ message: 'User Not Found' })
      }

      const meals = await knex('meals').where('user_id', user.id).select('*')

      return { meals }
    },
  )

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.uuid(),
      })
      const { id } = getMealParamsSchema.parse(request.params)
      const { sessionId } = request.cookies

      const user = await knex('users').where('session_id', sessionId).first()
      if (!user) {
        return reply.status(401).send({ message: 'Unauthorized' })
      }

      const meal = await knex('meals').where({ id, user_id: user.id }).first()

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found' })
      }
      return { meal }
    },
  )

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        return reply.status(400).send({ message: 'User Not Found' })
      }

      const meals = await knex('meals').where('user_id', user.id).select('*')
      const totalMeals = meals.length

      const mealsOnDiet = meals.filter((meal) => meal.is_on_diet)

      const mealsOffDiet = meals.filter((meal) => !meal.is_on_diet)

      let currentSequence = 0
      let bestSequence = 0

      for (const meal of meals) {
        if (meal.is_on_diet) {
          currentSequence++

          if (currentSequence > bestSequence) {
            bestSequence = currentSequence
          }
        } else {
          currentSequence = 0
        }
      }

      return reply.send({
        totalMeals,
        totalOnDiet: mealsOnDiet.length,
        totalOffDiet: mealsOffDiet.length,
        bestDietSequence: bestSequence,
      })
    },
  )

  app.put(
    '/:id',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const idMealSchema = z.object({
        id: z.uuid(),
      })

      const updatedMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        is_on_diet: z.boolean(),
        date: z.string(),
      })

      const { id } = idMealSchema.parse(request.params)

      const {
        name,
        description,
        date,
        is_on_diet: isOnDiet,
      } = updatedMealBodySchema.parse(request.body)

      const meal = await knex('meals').where({ id }).first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      await knex('meals').where({ id }).update({
        name,
        description,
        date,
        is_on_diet: isOnDiet,
        updated_at: new Date().toISOString(),
      })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const idMeal = z.object({
        id: z.uuid(),
      })

      const { id } = idMeal.parse(request.params)
      const { sessionId } = request.cookies

      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        return reply.status(401).send({ message: 'Unauthorized' })
      }

      const meal = await knex('meals').where({ id }).first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      await knex('meals')
        .where({
          id,
          user_id: user.id,
        })
        .delete()
      return reply.status(204).send()
    },
  )
}
