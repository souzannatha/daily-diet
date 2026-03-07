import { FastifyInstance } from 'fastify';
import z from 'zod';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

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
      });

      let { sessionId } = request.cookies;

      const { name, description, is_on_diet, date } = createMealsBodySchema.parse(request.body);
      const user = await knex('users').where('session_id', sessionId).first();

      if (!user) {
        return reply.status(400).send({ message: 'User Not Found' });
      }

      await knex('meals').insert({
        id: randomUUID(),
        user_id: user.id,
        name,
        description,
        is_on_diet,
        date: String(new Date().toISOString),
      });
      return reply.status(201).send();
    }
  );

  app.get('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const { sessionId } = request.cookies;

    const user = await knex('users').where('session_id', sessionId).first();

    if (!user) {
      return reply.status(400).send({ message: 'User Not Found' });
    }

    const meals = await knex('meals').where('user_id', user.id).select('*');

    return { meals };
  });

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.uuid(),
    });
    const { id } = getMealParamsSchema.parse(request.params);
    const { sessionId } = request.cookies;

    const user = await knex('users').where('session_id', sessionId).first();
    if (!user) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const meal = await knex('meals').where({ id, user_id: user.id }).first();

    if (!meal) {
      return reply.status(404).send({ message: 'Meal not found' });
    }
    return { meal };
  });

  app.put('/:id', { preHandler: checkSessionIdExists }, async (request, reply) => {
    const idMealSchema = z.object({
      id: z.uuid(),
    });

    const updatedMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_on_diet: z.boolean(),
      date: z.string(),
    });

    const { id } = idMealSchema.parse(request.params);

    const { name, description, date, is_on_diet } = updatedMealBodySchema.parse(request.body);

    const meal = await knex('meals').where({ id: id }).first();

    if (!meal) {
      return reply.status(404).send({ error: 'Meal not found' });
    }

    await knex('meals')
      .where({ id })
      .update({
        name,
        description,
        date: String(new Date().toISOString),
        is_on_diet,
        updated_at: String(new Date().toISOString)
      });

    return reply.status(200).send();
  });


}
