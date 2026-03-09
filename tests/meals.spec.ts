import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { app } from '../src/app'
import { execSync } from "node:child_process";
import request from 'supertest'


describe('Meals Route', () => {

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able create a new meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'New User',
      email: 'userdailydiet@gmail.com'
    })

    const cookies = createUserResponse.get('Set-Cookie')!

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Bread and Eggs',
      session_id: cookies,
      description: 'bread and eggs description',
      is_on_diet: true,
      date: '2026-03-09',
    }).expect(201)
  })
})
